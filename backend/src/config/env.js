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

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT) || 5000,

  MONGODB_URI: requireEnv("MONGODB_URI"),
  JWT_ACCESS_TOKEN_SECRET: requireEnv("JWT_ACCESS_TOKEN_SECRET"),
  ALLOWED_ORIGINS: requireEnv("ALLOWED_ORIGINS"),

  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m",

  PLANTNET_API_KEY: process.env.PLANTNET_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",

  PLANTNET_API_ENDPOINT:
    process.env.PLANTNET_API_ENDPOINT || "https://my-api.plantnet.org/v2/identify/all",

  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-1.5-flash",
};

if (env.JWT_ACCESS_TOKEN_SECRET.length < 32) {
  console.error("JWT_ACCESS_TOKEN_SECRET must be at least 32 characters long.");
  process.exit(1);
}
