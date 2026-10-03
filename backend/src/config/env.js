import dotenv from "dotenv";

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }

  return value.trim();
}

function parseAllowedOrigins(value) {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT) || 5000,

  ALLOWED_ORIGINS: parseAllowedOrigins(requireEnv("ALLOWED_ORIGINS")),

  PLANTNET_API_KEY: process.env.PLANTNET_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",

  PLANTNET_API_ENDPOINT:
    process.env.PLANTNET_API_ENDPOINT ||
    "https://my-api.plantnet.org/v2/identify/all",

  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
};
