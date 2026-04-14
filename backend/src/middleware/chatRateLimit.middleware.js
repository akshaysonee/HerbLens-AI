import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // 15 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: () => {
    throw new ApiError(429, "Too many chat requests. Please slow down.");
  },
});
