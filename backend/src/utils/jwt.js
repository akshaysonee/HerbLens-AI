import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// 🔐 Standard payload structure
export function signAccessToken(user) {
  const payload = {
    id: user.id,
    type: "access",
  };

  return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN || "1h",
  });
}

export function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);

    // 🔥 Extra validation
    if (!decoded || decoded.type !== "access" || !decoded.id) {
      throw new Error("Invalid token structure");
    }

    return decoded;
  } catch (error) {
    throw error;
  }
}