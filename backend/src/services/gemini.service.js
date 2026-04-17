import fetch from "node-fetch";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;

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
You are an expert herbal knowledge assistant.

The herb being discussed is:
Scientific Name: ${herbName}
Common Name: ${herbDetails?.commonName || "Unknown"}

IMPORTANT RULES:
- Answer ONLY the specific question asked.
- Do NOT repeat the full herb information.
- Do NOT use section headers unless directly relevant.
- Keep your response short and to the point.
- Use bullet points only when listing multiple items.
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

  // ================= TIMEOUT CONTROLLER =================
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  let res;

  try {
    res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      throw new ApiError(504, "AI service timed out. Please try again.");
    }

    throw new ApiError(502, "Unable to connect to AI service.");
  }

  // ================= STATUS HANDLING =================
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Gemini API Error:", res.status, errorText);

    if (res.status === 429) {
      throw new ApiError(
        429,
        "AI request limit reached. Please try again later.",
      );
    }

    throw new ApiError(502, "AI service temporarily unavailable.");
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
