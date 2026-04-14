import { Router } from "express";
import * as chatController from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { chatRateLimiter } from "../middleware/chatRateLimit.middleware.js";

export const chatRouter = Router();

chatRouter.post(
  "/",
  authMiddleware,
  chatRateLimiter,
  chatController.sendMessage,
);
