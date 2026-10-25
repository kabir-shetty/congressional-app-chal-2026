import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createAppServer, loadConfig, vertexGenerateUrl } from "../src/server.mjs";

const token = "a".repeat(40);
let server;
let baseUrl;
let fetchCalls = 0;
let geminiRequest;
// Overrides the fake ADC token source for a single test.
let tokenImpl = null;

before(async () => {
  server = createAppServer({
    apiToken: token,
    project: "test-project",
    location: "global",
    model: "gemini-test",
    getAccessToken: async () => (tokenImpl ? tokenImpl() : "test-access-token"),
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
    "https://aiplatform.googleapis.com/v1/projects/test-project/locations/global/publishers/google/models/gemini-test:generateContent"
  );
  assert.equal(
    geminiRequest.options.headers.authorization,
    "Bearer test-access-token"
  );
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

for (const [name, impl] of [
  ["throws", () => { throw new Error("Could not load the default credentials."); }],
  ["returns no token", () => null],
]) {
  test(`AI route returns 502 without calling Gemini when ADC ${name}`, async () => {
    const beforeCalls = fetchCalls;
    tokenImpl = impl;
    try {
      const response = await fetch(`${baseUrl}/v1/ai`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ system: "instructions", prompt: "question" }),
      });
      assert.equal(response.status, 502);
      assert.equal(fetchCalls, beforeCalls);
    } finally {
      tokenImpl = null;
    }
  });
}

test("regional locations use the regional Vertex AI host", () => {
  assert.equal(
    vertexGenerateUrl({ project: "p", location: "us-central1", model: "m" }),
    "https://us-central1-aiplatform.googleapis.com/v1/projects/p/locations/us-central1/publishers/google/models/m:generateContent"
  );
});

test("config requires a Google Cloud project and defaults to global", () => {
  const apiToken = "b".repeat(40);
  assert.throws(() => loadConfig({ API_TOKEN: apiToken }), /GOOGLE_CLOUD_PROJECT/);
  const config = loadConfig({ API_TOKEN: apiToken, GOOGLE_CLOUD_PROJECT: "p" });
  assert.equal(config.location, "global");
  assert.equal(config.project, "p");
});
