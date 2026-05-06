import fetch from "node-fetch";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

// Key is intentionally excluded from the URL so it never appears in Morgan
// access logs. It is passed via the x-goog-api-key request header instead,
// which Google's Generative Language API fully supports.
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent`;

const AI_TIMEOUT_MS = 15000; // 15 seconds max

export async function askGeminiHerbAssistant({
  herbName,
  herbDetails,
  history = [],
  question,
}) {
  if (!env.GEMINI_API_KEY) {
    throw new ApiError(500, "AI service not configured");
  }

  // ================= SAFE SYSTEM PROMPT =================
  const isFirstMessage = history.length === 0;

  const systemPrompt = isFirstMessage
    ? `
You are an expert herbal knowledge assistant.

The herb has already been identified using AI.

Plant Information:
Scientific Name: ${herbName}
Common Name: ${herbDetails?.commonName || "Unknown"}
Family: ${herbDetails?.family || "Unknown"}
Genus: ${herbDetails?.genus || "Unknown"}

You MUST return ALL sections below. Use this format exactly.

Description:
(1 sentence only)

Native Region:
• point
• point

Traditional Uses:
• point
• point

Medicinal Properties:
• point
• point

Health Benefits:
• point
• point

Usage Instructions:
• point
• point

Precautions / Side Effects:
• point
• point

Safety Warnings:
• point
• point

Rules:
- Keep bullet points short
- Max 4 bullet points per section
- Avoid long explanations
`
    : `
You are an expert herbal knowledge assistant ONLY.

The herb being discussed is:
Scientific Name: ${herbName}
Common Name: ${herbDetails?.commonName || "Unknown"}

IMPORTANT RULES:
- Answer ONLY the specific question asked.
- Do NOT repeat the full herb information.
- Do NOT use section headers unless directly relevant.
- Keep your response short and to the point.
- Use bullet points only when listing multiple items.
- If the question is NOT related to this herb or plants/health in general, respond ONLY with: "I can only answer questions about ${herbDetails?.commonName || herbName}. Please ask something related to this herb."
- Never answer questions about technology, sports, politics, entertainment, or any non-herb topic.
`;

  // ================= SAFE CONTENT STRUCTURE =================
  const contents = [
    {
      role: "user",
      parts: [{ text: systemPrompt }],
    },
    ...history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    })),
    {
      role: "user",
      parts: [{ text: question }],
    },
  ];

  // ================= FETCH =================
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  let res;

  try {
    res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          maxOutputTokens: 1200,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch (error) {
    clearTimeout(timeout);

    if (error.name === "AbortError") {
      throw new ApiError(504, "AI service timed out.");
    }

    throw new ApiError(502, "Unable to connect to AI service.");
  }

  // ================= STATUS HANDLING =================
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Gemini API Error:", res.status, errorText);

    if (res.status === 429) {
      throw new ApiError(429, "Gemini rate limit reached.");
    }

    if (res.status === 503) {
      throw new ApiError(503, "Gemini is currently overloaded.");
    }

    throw new ApiError(502, "Gemini service temporarily unavailable.");
  }

  let data;

  try {
    data = await res.json();
  } catch {
    throw new ApiError(502, "Invalid response from AI service.");
  }

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("\n")
      .trim() || null;

  if (!text) {
    throw new ApiError(502, "AI did not generate a valid response.");
  }

  return text;
}
