import { ApiError } from "../utils/ApiError.js";
import multer from "multer";
import { env } from "../config/env.js";

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = "Internal server error";
  let details = null;

  // ✅ Custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details || null;
  }

  // ✅ Zod validation error
  else if (err.issues) {
    statusCode = 400;
    message = err.issues[0]?.message || "Validation error";
  }

  // ✅ Multer file errors
  else if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Maximum size is 10MB.";
    } else {
      message = err.message;
    }
  }

  // ✅ JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired";
  }

  // ✅ Mongo duplicate key error
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // ✅ Rate limit errors (if thrown manually)
  else if (err.status === 429) {
    statusCode = 429;
    message = err.message || "Too many requests";
  }

  // Log in development only
  if (env.NODE_ENV !== "production") {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    details,
  });
}
