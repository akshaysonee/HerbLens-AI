import FormData from "form-data";
import fetch from "node-fetch";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const MIN_CONFIDENCE = 0.3; // 30% minimum threshold
const REQUEST_TIMEOUT = 45000; // 45 seconds timeout

export async function identifyPlantWithPlantNet(imageBuffer) {
  if (!env.PLANTNET_API_KEY) {
    throw new ApiError(500, "PlantNet API key missing");
  }

  const form = new FormData();
  form.append("images", imageBuffer, {
    filename: "plant.jpg",
  });

  const url = `${env.PLANTNET_API_ENDPOINT}?api-key=${env.PLANTNET_API_KEY}`;

  // 🔥 Timeout Controller
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  let res;

  try {
    res = await fetch(url, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch (error) {
    clearTimeout(timeout);

    // 🔥 Timeout error
    if (error.name === "AbortError") {
      throw new ApiError(
        504,
        "Request timed out. Please check your internet connection and try again.",
      );
    }

    // Network error
    throw new ApiError(
      502,
      "Unable to connect to plant identification service",
    );
  }

  if (!res.ok) {
    if (res.status === 404) {
      throw new ApiError(
        404,
        "Invalid image detected. Please upload a clear plant image.",
      );
    }

    if (res.status === 429) {
      throw new ApiError(
        429,
        "Plant identification limit reached. Please try later.",
      );
    }

    throw new ApiError(
      400,
      "Unable to identify plant. Please upload a clear herb image.",
    );
  }

  let data;

  try {
    data = await res.json();
  } catch {
    throw new ApiError(
      502,
      "Invalid response from plant identification service",
    );
  }

  const best = data?.results?.[0];

  if (!best) {
    throw new ApiError(
      400,
      "Invalid image detected. Please upload a clear herb image.",
    );
  }

  if (!best.score || best.score < MIN_CONFIDENCE) {
    throw new ApiError(
      400,
      "Plant detection confidence is too low. Please upload a clearer herb image.",
    );
  }

return {
  commonName: best.species?.commonNames?.[0] || null,
  scientificName: best.species?.scientificNameWithoutAuthor,
  confidence: best.score,
  family: best.species?.family?.scientificNameWithoutAuthor || null,
  genus: best.species?.genus?.scientificNameWithoutAuthor || null,
  observationOrgan: best.organs?.[0] || null,
  wikipediaUrl: best.species?.scientificNameWithoutAuthor
    ? `https://en.wikipedia.org/wiki/${best.species.scientificNameWithoutAuthor.replace(
        / /g,
        "_",
      )}`
    : null,
};
}

