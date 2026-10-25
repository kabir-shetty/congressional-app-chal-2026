// Hand-made image questions for Spot the Scam. Files live in
// assets/images/quiz/. Metro bundles only literal require() paths, so each
// image is listed here rather than discovered from the folder. Example:
//
//   {
//     source: require("@/assets/images/quiz/fake-bank-text.png"),
//     alt: "Text message saying your bank account is locked, with a link.",
//     kind: "Text message",
//     from: "+1 (844) 555-0192",
//     isScam: true,
//     explanation: "Banks don't text links to unlock accounts. Call the number on your card.",
//   },
import type { BundledImageSource } from "@/types/quiz";

export type QuizImage = {
  source: BundledImageSource; // pixel size comes from the asset
  alt: string; // what the image shows, for screen readers
  kind: string; // message type in the card header ("Text message")
  from: string; // sender in the card header
  isScam: boolean;
  explanation: string; // the sign to remember
};

export const QUIZ_IMAGES: readonly QuizImage[] = [];
