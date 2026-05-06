import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "Unauthorized: No token provided"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new ApiError(401, "Unauthorized: Invalid token format"));
    }

    const decoded = verifyAccessToken(token);

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message); // 🔥 logging

    // 🔥 Better error distinction
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Session expired. Please login again."));
    }

    return next(new ApiError(401, "Invalid or expired token"));
  }
}