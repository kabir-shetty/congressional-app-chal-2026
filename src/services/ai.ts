// Single entry point for every model call in the app. Screens build their
// own instructions and parse their own replies; this only talks to the model.

export type AIImage = { uri: string };

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

// Resolves with the model's raw text reply.
// TODO: implement the model call.
export async function callAI(_request: AIRequest): Promise<string> {
  throw new Error("callAI is not implemented yet.");
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
