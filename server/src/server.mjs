import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { pathToFileURL } from "node:url";

const MAX_BODY_BYTES = 10 * 1024 * 1024;
const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(JSON.stringify(body));
}

function hasValidToken(header, expectedToken) {
  if (typeof header !== "string" || !header.startsWith("Bearer ")) {
    return false;
  }

  const supplied = Buffer.from(header.slice("Bearer ".length));
  const expected = Buffer.from(expectedToken);
  return (
    supplied.length === expected.length && timingSafeEqual(supplied, expected)
  );
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  let oversized = false;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      oversized = true;
      chunks.length = 0;
    } else if (!oversized) {
      chunks.push(chunk);
    }
  }

  if (oversized) {
    throw new HttpError(413, "Request body is too large.");
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "Request body must be valid JSON.");
  }
}

function validateRequest(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object.");
  }

  const { system, prompt } = body;
  if (typeof system !== "string" || !system.trim() || system.length > 20_000) {
    throw new HttpError(400, "system must be a non-empty string of at most 20000 characters.");
  }
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 20_000) {
    throw new HttpError(400, "prompt must be a non-empty string of at most 20000 characters.");
  }

  const images = body.images ?? [];
  if (!Array.isArray(images) || images.length > MAX_IMAGES) {
    throw new HttpError(400, `images must be an array with at most ${MAX_IMAGES} items.`);
  }

  const validatedImages = images.map((image) => {
    if (
      !image ||
      typeof image !== "object" ||
      !ALLOWED_IMAGE_TYPES.has(image.mimeType) ||
      typeof image.data !== "string" ||
      !image.data ||
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(image.data) ||
      Buffer.byteLength(image.data, "base64") > MAX_IMAGE_BYTES
    ) {
      throw new HttpError(
        400,
        `Each image must include supported mimeType and base64 data under ${MAX_IMAGE_BYTES} bytes.`
      );
    }

    return { mimeType: image.mimeType, data: image.data };
  });

  return { system, prompt, images: validatedImages };
}

function extractText(responseBody) {
  const parts = responseBody?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return null;
  }

  const text = parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();
  return text || null;
}

async function handleRequest(request, response, config) {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

  if (request.method === "GET" && pathname === "/healthz") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (request.method !== "POST" || pathname !== "/v1/ai") {
    sendJson(response, 404, { error: { message: "Not found." } });
    return;
  }

  if (!hasValidToken(request.headers.authorization, config.apiToken)) {
    request.resume();
    sendJson(response, 401, { error: { message: "Unauthorized." } });
    return;
  }

  if (!request.headers["content-type"]?.startsWith("application/json")) {
    request.resume();
    sendJson(response, 415, { error: { message: "Content-Type must be application/json." } });
    return;
  }

  const contentLength = Number(request.headers["content-length"]);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    request.resume();
    sendJson(response, 413, { error: { message: "Request body is too large." } });
    return;
  }

  const input = validateRequest(await readJsonBody(request));
  const parts = [
    { text: input.prompt },
    ...input.images.map((image) => ({
      inlineData: { mimeType: image.mimeType, data: image.data },
    })),
  ];

  let geminiResponse;
  try {
    geminiResponse = await config.fetchImpl(
      `${GEMINI_API_URL}/${encodeURIComponent(config.model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": config.geminiApiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: input.system }] },
          contents: [{ role: "user", parts }],
        }),
        signal: AbortSignal.timeout(60_000),
      }
    );
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      sendJson(response, 504, { error: { message: "Gemini request timed out." } });
      return;
    }
    console.error("Gemini request failed.");
    sendJson(response, 502, { error: { message: "Gemini service is unavailable." } });
    return;
  }

  if (!geminiResponse.ok) {
    console.error("Gemini returned HTTP status", geminiResponse.status);
    sendJson(response, 502, { error: { message: "Gemini service rejected the request." } });
    return;
  }

  let geminiBody;
  try {
    geminiBody = await geminiResponse.json();
  } catch {
    sendJson(response, 502, { error: { message: "Gemini returned an invalid response." } });
    return;
  }

  const text = extractText(geminiBody);
  if (!text) {
    sendJson(response, 502, { error: { message: "Gemini returned no text." } });
    return;
  }

  sendJson(response, 200, { text });
}

export function createAppServer(config) {
  const server = createServer((request, response) => {
    handleRequest(request, response, config).catch((error) => {
      if (error instanceof HttpError) {
        sendJson(response, error.status, { error: { message: error.message } });
        return;
      }

      console.error("Request processing failed.");
      sendJson(response, 500, { error: { message: "Internal server error." } });
    });
  });

  server.headersTimeout = 10_000;
  server.requestTimeout = 120_000;
  server.keepAliveTimeout = 5_000;
  return server;
}

export function loadConfig(environment = process.env) {
  const geminiApiKey = environment.GEMINI_API_KEY;
  const apiToken = environment.API_TOKEN;
  const port = Number(environment.PORT ?? 8080);

  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is required.");
  }
  if (!apiToken || apiToken.length < 32) {
    throw new Error("API_TOKEN is required and must be at least 32 characters.");
  }
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer from 1 to 65535.");
  }

  return {
    apiToken,
    geminiApiKey,
    model: environment.GEMINI_MODEL || "gemini-2.5-flash",
    port,
    fetchImpl: fetch,
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const config = loadConfig();
    const server = createAppServer(config);
    server.listen(config.port, "0.0.0.0", () => {
      console.log(`Porch Watch AI server listening on port ${config.port}.`);
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Invalid configuration.");
    process.exitCode = 1;
  }
}
