// A quiz item is either a snippet of text or an image — the player has to
// guess whether it's a scam.
export type QuizItemContent =
  | { type: "text"; text: string }
  | { type: "image"; uri: string; width: number; height: number };

export type QuizItem = {
  id: string;
  kind: string; // message type shown in the card header ("Text message")
  from: string; // sender shown in the card header
  content: QuizItemContent; // grouped together since there's two possible formats
  isScam: boolean; // the correct answer to "is this a scam?"
  explanation: string; // the sign to remember
};
