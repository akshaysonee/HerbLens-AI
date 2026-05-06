import fetch from "node-fetch";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const AI_TIMEOUT_MS = 15000; // 15 seconds max

export async function askGroqHerbAssistant({
  herbName,
  herbDetails,
  history = [],
  question,
}) {
  if (!env.GROQ_API_KEY) {
    throw new ApiError(500, "Groq AI service not configured");
  }

  // ================= SAME SYSTEM PROMPT AS GEMINI =================
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

  // ================= GROQ USES OPENAI MESSAGE FORMAT =================
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((h) => ({
      role: h.role === "assistant" ? "assistant" : "user",
      content: h.content,
    })),
    { role: "user", content: question },
  ];

  // ================= TIMEOUT CONTROLLER =================
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  let res;

  try {
    res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch (error) {
    clearTimeout(timeout);

    if (error.name === "AbortError") {
      throw new ApiError(504, "Groq AI service timed out. Please try again.");
    }

    throw new ApiError(502, "Unable to connect to Groq AI service.");
  }

  // ================= STATUS HANDLING =================
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Groq API Error:", res.status, errorText);

    if (res.status === 429) {
      throw new ApiError(
        429,
        "Groq AI request limit reached. Please try again later.",
      );
    }

    if (res.status === 503) {
      throw new ApiError(
        503,
        "Groq AI service is currently busy. Please try again.",
      );
    }

    throw new ApiError(502, "Groq AI service temporarily unavailable.");
  }

  let data;

  try {
    data = await res.json();
  } catch {
    throw new ApiError(502, "Invalid response from Groq AI service.");
  }

  const text = data?.choices?.[0]?.message?.content?.trim() || null;

  if (!text) {
    throw new ApiError(502, "Groq AI did not generate a valid response.");
  }

  return text;
}
