import { askGeminiHerbAssistant } from "../services/gemini.service.js";
import { ApiError } from "../utils/ApiError.js";

export async function sendChatMessage(req, res, next) {
  try {
    const { herbName, herbDetails, history, question } = req.body;

    if (!herbName || !question) {
      throw new ApiError(400, "Missing herb name or question");
    }

    const response = await askGeminiHerbAssistant({
      herbName,
      herbDetails,
      history,
      question,
    });

    return res.json({
      success: true,
      data: {
        response,
      },
    });
  } catch (err) {
    next(err);
  }
}


