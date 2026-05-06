import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "Too many login attempts. Please try again after 15 minutes.",
      ),
    );
  },
});
