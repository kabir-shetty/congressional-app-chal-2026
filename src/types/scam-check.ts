import type { AiScamTopicId } from "@/constants/ai-scam-topics";

// A single image attached to a check, as returned by the image picker.
export type ScamCheckImage = {
  uri: string;
  width: number;
  height: number;
};

// Everything the user submits for one scam check: free text plus any screenshots.
export type ScamCheckInput = {
  text: string;
  images: ScamCheckImage[];
};

export const SCAM_VERDICTS = ["likely_scam", "likely_safe", "uncertain"] as const;

export type ScamVerdict = (typeof SCAM_VERDICTS)[number];

export function isScamVerdict(value: unknown): value is ScamVerdict {
  return SCAM_VERDICTS.includes(value as ScamVerdict);
}

// One thing the AI noticed in the message ("What we noticed").
export type ScamSign = {
  title: string;
  detail: string;
};

// A validated AI reply for one check.
export type ScamCheckResult = {
  verdict: ScamVerdict;
  confidence: number; // 0-1; shown in words only
  action: string; // the one most important thing to do now
  signs: ScamSign[];
  steps: string[]; // "What to do now"
  topic: AiScamTopicId; // AI Scams topic the result links to
};
