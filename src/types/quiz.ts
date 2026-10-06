// A quiz item is either a snippet of text or an image — the player has to
// guess whether the model generated it itself.
export type QuizItemContent =
  | { type: "text"; text: string }
  | { type: "image"; uri: string; width: number; height: number };

export type QuizItem = {
  id: string;
  content: QuizItemContent; // grouped together since there's two possible formats
  isScam: boolean; // the correct answer to "is this a scam?"
  explanation: string; // explains why the answer is what it is
};
