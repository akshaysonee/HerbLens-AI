import { ApiError } from "../utils/ApiError.js";
import { identifyPlantWithPlantNet } from "./plantnet.service.js";

const ALLOWED_ORGANS = ["leaf", "flower", "fruit", "bark", "habit"];

export async function identifyPlant({ file, body }) {
  if (!file) {
    throw new ApiError(400, "Image file is required");
  }

  let organs;

  if (!body?.organs) {
    organs = ["leaf"];
  } else {
    const parsedOrgans = Array.isArray(body.organs)
      ? body.organs
      : String(body.organs)
          .split(",")
          .map((o) => o.trim().toLowerCase())
          .filter(Boolean);

    // 🔥 Strict whitelist validation
    const invalidOrgans = parsedOrgans.filter(
      (organ) => !ALLOWED_ORGANS.includes(organ),
    );

    if (invalidOrgans.length > 0) {
      throw new ApiError(
        400,
        `Invalid organ type provided. Allowed values: ${ALLOWED_ORGANS.join(", ")}`,
      );
    }

    organs = parsedOrgans.length > 0 ? parsedOrgans : ["leaf"];
  }

  const plantnetResult = await identifyPlantWithPlantNet(file.buffer);

  return {
    commonName: plantnetResult.commonName,
    plantName: plantnetResult.scientificName,
    confidence: plantnetResult.confidence,
    family: plantnetResult.family,
    genus: plantnetResult.genus,
    observationOrgan: plantnetResult.observationOrgan,
    wikipediaUrl: plantnetResult.wikipediaUrl,
  };
}
