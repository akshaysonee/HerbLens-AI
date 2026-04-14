import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 registrations per IP per hour
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "Too many registration attempts. Please try again later.",
      ),
    );
  },
});
