import assert from "node:assert/strict";
import { test } from "node:test";

process.env.MONGODB_URI ||= "mongodb://localhost:27017/herbal_recognition_test";
process.env.JWT_ACCESS_TOKEN_SECRET ||= "test_secret_that_is_long_enough_for_jwt";
process.env.ALLOWED_ORIGINS ||= "http://localhost:5173";

test("Express app imports without starting the server", async () => {
  const { default: app } = await import("../src/app.js");

  assert.equal(typeof app, "function");
  assert.equal(app.get("trust proxy"), 1);
});

test("JWT utility signs and verifies access tokens", async () => {
  const { signAccessToken, verifyAccessToken } = await import("../src/utils/jwt.js");

  const token = signAccessToken({ id: "user-id-123" });
  const decoded = verifyAccessToken(token);

  assert.equal(decoded.id, "user-id-123");
  assert.equal(decoded.type, "access");
});

test("moderation utility flags unsafe and off-topic prompts", async () => {
  const { isOffTopic, isUnsafeContent } = await import("../src/utils/moderation.js");

  assert.equal(isUnsafeContent("how to make a drug from this plant"), true);
  assert.equal(isOffTopic("write javascript code for me"), true);
  assert.equal(isOffTopic("what are the traditional uses of this herb"), false);
});
