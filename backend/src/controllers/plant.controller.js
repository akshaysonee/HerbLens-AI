import { identifyPlantWithPlantNet } from "../services/plantnet.service.js";

export async function identifyPlant(req, res, next) {
  try {
    if (!req.file) {
      throw new ApiError(400, "Image required");
    }

    const plantnet = await identifyPlantWithPlantNet(req.file.buffer);

    return res.json({
      success: true,
      data: {
        commonName: plantnet.commonName,
        plantName: plantnet.scientificName,
        confidence: plantnet.confidence,
        family: plantnet.family,
        genus: plantnet.genus,
        observationOrgan: plantnet.observationOrgan,
        wikipediaUrl: plantnet.wikipediaUrl,
      },
    });
  } catch (err) {
    next(err);
  }
}
