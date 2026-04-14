import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginRateLimiter } from "../middleware/loginRateLimit.middleware.js";
import { registerRateLimiter } from "../middleware/registerRateLimit.middleware.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/auth.validator.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  registerRateLimiter,
  validate(registerSchema),
  authController.register,
);

authRouter.post(
  "/login",
  loginRateLimiter, validate(loginSchema),
  authController.login,
);

authRouter.get("/me", authMiddleware, authController.getMe);
authRouter.put("/me", authMiddleware, validate(updateProfileSchema),authController.updateProfile,);
authRouter.put("/me/password", authMiddleware, validate(changePasswordSchema), authController.changePassword,);
