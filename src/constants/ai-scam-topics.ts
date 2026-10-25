// AI Scams copy (claude-design/"Porch Watch.dc.html"). Shared by the AI
// Scams tab and Scam Checker results, which link to the matching topic.
export type AiScamTopicId = "voice" | "photos" | "writing" | "signs";

export type AiScamTopic = {
  id: AiScamTopicId;
  title: string;
  intro: string;
  items: { title: string; detail: string }[];
  // Scam Checker result button that opens this topic.
  learnLabel: string;
};

export const AI_SCAM_TOPICS: AiScamTopic[] = [
  {
    id: "voice",
    title: "Cloned voices",
    intro:
      "With a few seconds of someone's voice from a video online, AI can make a call that sounds just like your grandchild.",
    items: [
      {
        title: "The sign",
        detail:
          "A loved one in trouble who needs money fast and asks you not to tell anyone.",
      },
      {
        title: "What to do",
        detail:
          "Hang up and call them back on the number you already have. A family code word helps too.",
      },
    ],
    learnLabel: "Learn about cloned voices",
  },
  {
    id: "photos",
    title: "Fake photos and videos",
    intro:
      "AI can make pictures and videos of people who don't exist, or of real people saying things they never said.",
    items: [
      {
        title: "The sign",
        detail:
          "A new online friend, or a famous person, who never meets in person and soon asks for money.",
      },
      {
        title: "What to do",
        detail: "Never send money to someone you have only met online.",
      },
    ],
    learnLabel: "Learn about fake photos and videos",
  },
  {
    id: "writing",
    title: "Messages that sound perfect",
    intro:
      "Scam messages used to have spelling mistakes. AI now writes clean, friendly, official-sounding text.",
    items: [
      {
        title: "The sign",
        detail:
          "Good spelling doesn't mean safe. Look at what the message asks you to do.",
      },
      {
        title: "What to do",
        detail:
          "Go to the company's app or website yourself instead of tapping a link.",
      },
    ],
    learnLabel: "Learn about messages that sound perfect",
  },
  {
    id: "signs",
    title: "Signs that never change",
    intro:
      "However real a scam looks or sounds, it almost always does one of these.",
    items: [
      { title: "It rushes you", detail: '"Today," "within 12 hours," "right now."' },
      {
        title: "It asks for secrecy",
        detail: '"Don\'t tell anyone" keeps you from checking.',
      },
      {
        title: "It wants unusual payment",
        detail: "Gift cards, wire transfers, or cryptocurrency.",
      },
      {
        title: "It asks for private details",
        detail: "Passwords, PINs, Medicare or Social Security numbers.",
      },
    ],
    learnLabel: "See the signs that never change",
  },
];

export function isAiScamTopicId(value: unknown): value is AiScamTopicId {
  return AI_SCAM_TOPICS.some((topic) => topic.id === value);
}
