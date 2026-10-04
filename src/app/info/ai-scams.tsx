import { InfoPage } from "@/components/info-page";

// To add another info topic later: add a sibling file here (e.g.
// src/app/info/phishing.tsx) rendering <InfoPage>, give it a title in
// src/app/info/_layout.tsx, then link to it from src/app/index.tsx.
export default function AiScamsInfo() {
  return <InfoPage />;
}
