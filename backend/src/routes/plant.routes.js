import { Router } from "express";
import * as plantController from "../controllers/plant.controller.js";
import { uploadSingleImage } from "../middleware/multer.middleware.js";
import { uploadRateLimiter } from "../middleware/uploadRateLimit.middleware.js";

export const plantRouter = Router();

plantRouter.post(
  "/identify",
  uploadRateLimiter,
  uploadSingleImage,
  plantController.identifyPlant,
);
