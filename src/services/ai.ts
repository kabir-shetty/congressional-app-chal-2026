// Single entry point for every model call in the app. Screens build their
// own instructions and parse their own replies; this only talks to the model,
// via the Porch Watch AI server (see server/README.md).

import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

// Pixel size of the source image, so large screenshots can be scaled down.
export type AIImage = { uri: string; width: number; height: number };

export type AIRequest = {
  // Fixed instructions for the model. Kept apart from `prompt` so user text
  // is never mistaken for instructions.
  system: string;
  prompt: string;
  images?: AIImage[];
};

// Callers surface error.message directly in the UI, so keep this plain.
export const UNEXPECTED_REPLY_MESSAGE =
  "Got an unexpected answer. Please try again.";

// Set in .env (see .env.example). EXPO_PUBLIC_ values are inlined into
// the app bundle, so the token is not a secret; it only keeps out casual callers.
const API_URL = process.env.EXPO_PUBLIC_AI_API_URL;
const API_TOKEN = process.env.EXPO_PUBLIC_AI_API_TOKEN;
const ENDPOINT = API_URL && `${API_URL.replace(/\/+$/, "")}/v1/ai`;

// Server limits (server/README.md).
export const MAX_AI_IMAGES = 5;
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const MAX_REQUEST_BYTES = 10 * 1024 * 1024;

const REQUEST_TIMEOUT_MS = 60_000;
// Caps width (keeps screenshot text readable) and total pixels (keeps tall
// scrolling captures under the server's size limits) without squashing tall
// images the way a longest-edge cap would.
const MAX_IMAGE_WIDTH = 1280;
const MAX_IMAGE_PIXELS = 1280 * 6000;
const IMAGE_QUALITY = 0.7;

// Re-encodes a picked image as JPEG base64, the shape the server expects.
async function encodeImage(image: AIImage) {
  const context = ImageManipulator.manipulate(image.uri);
  let rendered;
  try {
    const scale = Math.min(
      1,
      MAX_IMAGE_WIDTH / image.width,
      Math.sqrt(MAX_IMAGE_PIXELS / (image.width * image.height)),
    );
    if (scale < 1) {
      context.resize({ width: Math.round(image.width * scale), height: null });
    }
    rendered = await context.renderAsync();
    const { base64 } = await rendered.saveAsync({
      format: SaveFormat.JPEG,
      compress: IMAGE_QUALITY,
      base64: true,
    });
    if (!base64) throw new Error("Image encoding returned no data.");
    // Server limits decoded bytes; base64 is 4 chars per 3 bytes.
    if ((base64.length * 3) / 4 > MAX_IMAGE_BYTES) {
      throw new Error("Image is too large to send.");
    }
    return { mimeType: "image/jpeg", data: base64 };
  } finally {
    // Free native bitmaps now rather than waiting for GC.
    rendered?.release();
    context.release();
  }
}

// Resolves with the model's raw text reply.
export async function callAI(request: AIRequest): Promise<string> {
  if (!ENDPOINT || !API_TOKEN) {
    throw new Error(
      "AI server is not configured (EXPO_PUBLIC_AI_API_URL / EXPO_PUBLIC_AI_API_TOKEN).",
    );
  }
  const sources = request.images ?? [];
  if (sources.length > MAX_AI_IMAGES) {
    throw new Error(`At most ${MAX_AI_IMAGES} images can be sent.`);
  }

  // One at a time so only one full-size bitmap is decoded at once.
  const images = [];
  for (const image of sources) images.push(await encodeImage(image));

  const payload = JSON.stringify({
    system: request.system,
    prompt: request.prompt,
    images: images.length > 0 ? images : undefined,
  });
  if (payload.length > MAX_REQUEST_BYTES) {
    throw new Error("Request is too large to send.");
  }

  // AbortController + timer rather than AbortSignal.timeout, which React
  // Native does not reliably provide.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  let body: unknown;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: payload,
      signal: controller.signal,
    });
    // Server replies {text} on success, {error:{message}} on failure.
    body = await response.json().catch((error) => {
      if (controller.signal.aborted) throw error;
      return null;
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        `AI request timed out after ${REQUEST_TIMEOUT_MS / 1000}s.`,
        { cause: error },
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const message = (body as { error?: { message?: unknown } } | null)?.error
      ?.message;
    throw new Error(
      `AI server error ${response.status}: ${typeof message === "string" ? message : "no details"}`,
    );
  }
  const text = (body as { text?: unknown } | null)?.text;
  if (typeof text !== "string") throw new Error(UNEXPECTED_REPLY_MESSAGE);
  return text;
}

// Parses a reply that was asked to be JSON-only and returns it as an object
// to read fields from. Models often wrap JSON in ``` fences despite being
// told not to, so those are stripped first.
export function parseJsonReply(reply: string): Record<string, unknown> {
  const json = reply.trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error(UNEXPECTED_REPLY_MESSAGE);
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(UNEXPECTED_REPLY_MESSAGE);
  }
  return data as Record<string, unknown>;
}
