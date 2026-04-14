import rateLimit from "express-rate-limit";

export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 uploads per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many image uploads. Please try again later.",
  },
});
