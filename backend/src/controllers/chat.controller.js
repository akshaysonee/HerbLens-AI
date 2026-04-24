import { askGeminiHerbAssistant } from "../services/gemini.service.js";
import { askGroqHerbAssistant } from "../services/groq.service.js";
import { ApiError } from "../utils/ApiError.js";
import { chatSchema } from "../validators/chat.validator.js";
import { isUnsafeContent, isOffTopic } from "../utils/moderation.js";

export async function sendMessage(req, res, next) {
  try {
    const parsed = chatSchema.parse(req.body);

    const {
      herbName,
      herbDetails,
      history = [],
      question,
      activeModel,
    } = parsed;

    // 🔒 Moderation Guard
    if (isUnsafeContent(question)) {
      throw new ApiError(
        400,
        "Your question violates usage policy. Please ask a safe herb-related question.",
      );
    }

    // 🌿 Scope Guard
    if (isOffTopic(question)) {
      throw new ApiError(
        400,
        "I’m here to help with information about this plant. Feel free to ask any related questions.",
      );
    }

    let response;
    let usedModel;

    // ================= GROQ ALREADY ACTIVE =================
    // If frontend says Groq is already active, skip Gemini entirely
    if (activeModel === "groq") {
      response = await askGroqHerbAssistant({
        herbName,
        herbDetails,
        history,
        question,
      });
      usedModel = "groq";
    } else {
      // ================= TRY GEMINI FIRST =================
      try {
        response = await askGeminiHerbAssistant({
          herbName,
          herbDetails,
          history,
          question,
        });
        usedModel = "gemini";
      } catch (geminiError) {
        // ================= FALLBACK TO GROQ =================
        console.warn(
          "Gemini failed, falling back to Groq:",
          geminiError.message,
        );

        try {
          response = await askGroqHerbAssistant({
            herbName,
            herbDetails,
            history,
            question,
          });
          usedModel = "groq";
        } catch (groqError) {
          console.error("Groq also failed:", groqError.message);
          throw new ApiError(
            502,
            "AI service is currently unavailable. Please try again later.",
          );
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: { response, usedModel },
    });
  } catch (err) {
    next(err);
  }
}
