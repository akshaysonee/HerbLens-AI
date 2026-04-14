import { Router } from "express";
import * as plantController from "../controllers/plant.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadSingleImage } from "../middleware/multer.middleware.js";
import { uploadRateLimiter } from "../middleware/uploadRateLimit.middleware.js";

export const plantRouter = Router();

plantRouter.post(
  "/identify",
  authMiddleware,
  uploadRateLimiter,
  uploadSingleImage,
  plantController.identifyPlant,
);
