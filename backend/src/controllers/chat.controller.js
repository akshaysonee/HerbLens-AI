import { askGeminiHerbAssistant } from "../services/gemini.service.js";
import { ApiError } from "../utils/ApiError.js";
import { chatSchema } from "../validators/chat.validator.js";
import { isUnsafeContent } from "../utils/moderation.js";

export async function sendMessage(req, res, next) {
  try {
    const parsed = chatSchema.parse(req.body);

    const { herbName, herbDetails, history = [], question } = parsed;

    // 🔒 Moderation Guard
    if (isUnsafeContent(question)) {
      throw new ApiError(
        400,
        "Your question violates usage policy. Please ask a safe herb-related question.",
      );
    }

    const response = await askGeminiHerbAssistant({
      herbName,
      herbDetails,
      history,
      question,
    });

    return res.status(200).json({
      success: true,
      data: { response },
    });
  } catch (err) {
    next(err);
  }
}
