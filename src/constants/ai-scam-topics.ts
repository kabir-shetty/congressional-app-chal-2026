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
      "With a few seconds of audio of a loved one's voice, AI can make a call that sounds just like them.",
    items: [
      {
        title: "The signs",
        detail:// the indentation is missing bc this type of string would accidentally include it
          `A call from an unknown number claiming to be a loved one.
The loved one appears to be in an urgent situation.
They ask for money and insist you tell nobody else.`,
      },
      {
        title: "What to do",
        detail:
          `Hang up and call them back on the number you already have.
Speak to other family members to see if they got call like yours.
Have a family codeword that you can ask the caller to confirm their identity.`,
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
        title: "The signs",
        detail:
          `A new online friend, or a famous person, who never meets in person and soon asks for money.
The videos of them often have weird inconsistencies, are often low in quality, and are usually 30 seconds or less.
The images of them often don't make sense when you look at the smaller details.`,
      },
      {
        title: "What to do",
        detail: `Never send money to someone you have only met online.
Report the person on the platform you met them on.`,
      },
    ],
    learnLabel: "Learn about fake photos and videos",
  },
  {
    id: "writing",
    title: "Messages that sound perfect",
    intro:
      "Scam messages used to have spelling mistakes, broken English, and informal wording. AI now writes clean, friendly, official-sounding text.",
    items: [
      {
        title: "The signs",
        detail:
          `Good spelling doesn't mean safe. Look at what the message asks you to do.
They will often ask you to click a link, call a number, or provide personal information.
Companies will never ask for private information over the phone.`,
      },
      {
        title: "What to do",
        detail:
          `Go to the company's app or website yourself instead of tapping a link.
Report the message as spam and block the number if it turns out to be a scam.`,
      },
    ],
    learnLabel: "Learn about messages that sound perfect",
  },
  {
    id: "signs",
    title: "Signs that never change",
    intro:
      "No matter what type of scam it is, it almost always does one of these.",
    items: [
      { title: "It rushes you", detail: `Phrases like "Today," "within 12 hours," "right now."
That sense of urgency is meant to trick you into making decisions without thinking.` },
      {
        title: "It asks for secrecy",
        detail: `"Don't tell anyone" keeps you from checking and getting help from loved ones.`,
      },
      {
        title: "It wants unusual payment",
        detail: `Strange forms like gift cards, wire transfers, or cryptocurrency.
These forms often make it much more difficult to track and recover money after it's been sent.`,
      },
      {
        title: "It asks for private details",
        detail: `Usernames, Passwords, PINs, Medicare or Social Security numbers.
These can be used to steal money or impersonate you.`,
      },
    ],
    learnLabel: "See the signs that never change",
  },
];

export function isAiScamTopicId(value: unknown): value is AiScamTopicId {
  return AI_SCAM_TOPICS.some((topic) => topic.id === value);
}
