import { Router } from "express";
import * as chatController from "../controllers/chat.controller.js";
import { chatRateLimiter } from "../middleware/chatRateLimit.middleware.js";

export const chatRouter = Router();

chatRouter.post(
  "/",
  chatRateLimiter,
  chatController.sendMessage,
);
