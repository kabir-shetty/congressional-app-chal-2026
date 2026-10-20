import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createAppServer } from "../src/server.mjs";

const token = "a".repeat(40);
let server;
let baseUrl;
let fetchCalls = 0;
let geminiRequest;

before(async () => {
  server = createAppServer({
    apiToken: token,
    geminiApiKey: "test-api-key",
    model: "gemini-test",
    fetchImpl: async (url, options) => {
      fetchCalls++;
      geminiRequest = { url, options };
      return Response.json({
        candidates: [
          { content: { parts: [{ text: '{"verdict":' }, { text: '"uncertain"}' }] } },
        ],
      });
    },
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve()))
  );
});

test("health check works without credentials", async () => {
  const response = await fetch(`${baseUrl}/healthz`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("AI route rejects missing bearer token", async () => {
  const beforeCalls = fetchCalls;
  const response = await fetch(`${baseUrl}/v1/ai`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ system: "instructions", prompt: "question" }),
  });
  assert.equal(response.status, 401);
  assert.equal(fetchCalls, beforeCalls);
});

test("AI route maps text and image input to Gemini", async () => {
  const response = await fetch(`${baseUrl}/v1/ai`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      system: "Return JSON only.",
      prompt: "Check this message.",
      images: [{ mimeType: "image/png", data: "aGVsbG8=" }],
    }),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { text: '{"verdict":"uncertain"}' });
  assert.equal(
    geminiRequest.url,
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-test:generateContent"
  );
  assert.equal(geminiRequest.options.headers["x-goog-api-key"], "test-api-key");
  const body = JSON.parse(geminiRequest.options.body);
  assert.deepEqual(body.systemInstruction, {
    parts: [{ text: "Return JSON only." }],
  });
  assert.deepEqual(body.contents[0].parts[1], {
    inlineData: { mimeType: "image/png", data: "aGVsbG8=" },
  });
});

test("AI route rejects invalid image data before calling Gemini", async () => {
  const beforeCalls = fetchCalls;
  const response = await fetch(`${baseUrl}/v1/ai`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      system: "instructions",
      prompt: "question",
      images: [{ mimeType: "image/png", data: "not base64" }],
    }),
  });
  assert.equal(response.status, 400);
  assert.equal(fetchCalls, beforeCalls);
});
