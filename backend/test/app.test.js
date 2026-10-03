import assert from "node:assert/strict";
import { test } from "node:test";

process.env.ALLOWED_ORIGINS ||= "http://localhost:5173";

test("Express app imports without starting the server", async () => {
  const { default: app } = await import("../src/app.js");

  assert.equal(typeof app, "function");
  assert.equal(app.get("trust proxy"), 1);
});

test("moderation utility flags unsafe and off-topic prompts", async () => {
  const { isOffTopic, isUnsafeContent } =
    await import("../src/utils/moderation.js");

  assert.equal(isUnsafeContent("how to make a drug from this plant"), true);
  assert.equal(isOffTopic("write javascript code for me"), true);
  assert.equal(isOffTopic("what are the traditional uses of this herb"), false);
});
