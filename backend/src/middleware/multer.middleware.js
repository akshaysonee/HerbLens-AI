import multer from "multer";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import { ApiError } from "../utils/ApiError.js";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB upload limit

// 🔴 Hard safety caps (anti image-bomb)
const HARD_MAX_WIDTH = 10000;
const HARD_MAX_HEIGHT = 10000;
const HARD_MAX_MEGAPIXELS = 100; // 100MP absolute maximum

// 🟢 AI-friendly resize target
const RESIZE_MAX_WIDTH = 2048;
const RESIZE_MAX_HEIGHT = 2048;

const storage = multer.memoryStorage();

// Basic pre-check only (real validation happens later)
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new ApiError(400, "Only JPG, PNG, WEBP allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
  },
}).single("image");

export const uploadSingleImage = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ApiError(400, err.message || "Image upload failed"));
    }

    if (!req.file) {
      return next(new ApiError(400, "Image file is required"));
    }

    try {
      // ✅ 1. Magic byte validation (real file type check)
      const detectedType = await fileTypeFromBuffer(req.file.buffer);

      if (
        !detectedType ||
        !["image/jpeg", "image/png", "image/webp"].includes(detectedType.mime)
      ) {
        return next(new ApiError(400, "Invalid or unsupported image format"));
      }

      // ✅ 2. Safe metadata extraction
      // const metadata = await sharp(req.file.buffer).metadata();
      const metadata = await sharp(req.file.buffer, {
        limitInputPixels: HARD_MAX_MEGAPIXELS * 1_000_000,
      }).metadata();

      if (!metadata.width || !metadata.height) {
        return next(new ApiError(400, "Invalid image dimensions"));
      }

      const megapixels = (metadata.width * metadata.height) / 1_000_000;

      // 🔴 HARD REJECTION (anti image-bomb protection)
      if (
        metadata.width > HARD_MAX_WIDTH ||
        metadata.height > HARD_MAX_HEIGHT ||
        megapixels > HARD_MAX_MEGAPIXELS
      ) {
        return next(
          new ApiError(
            400,
            "Image resolution is too large. Please upload a smaller image.",
          ),
        );
      }

      // 🟢 3. Smart resize (optimize for AI processing)
      const resizedBuffer = await sharp(req.file.buffer)
        .resize({
          width: RESIZE_MAX_WIDTH,
          height: RESIZE_MAX_HEIGHT,
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();

      // Replace buffer with optimized version
      req.file.buffer = resizedBuffer;

      next();
    } catch (error) {
      console.error("Image Processing Error:", error);
      return next(new ApiError(400, "Failed to process image file"));
    }
  });
};
