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

export type ScamVerdict = "likely_scam" | "likely_safe" | "uncertain";

// What the AI call is expected to hand back once it's implemented.
export type ScamCheckResult = {
  verdict: ScamVerdict;
  confidence: number; // 0-1
  explanation: string;
};
