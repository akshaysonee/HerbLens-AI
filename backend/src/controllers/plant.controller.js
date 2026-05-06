import { ApiError } from "../utils/ApiError.js";
import { identifyPlant as identifyPlantService } from "../services/plant.service.js";

export async function identifyPlant(req, res, next) {
  try {
    if (!req.file) {
      throw new ApiError(400, "Image required");
    }

    const result = await identifyPlantService({
      file: req.file,
      body: req.body,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
