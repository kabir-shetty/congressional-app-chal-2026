import { View } from "react-native";

import { AppText } from "@/components/app-text";
import { InstructionStrip } from "@/components/instruction-strip";
import { Screen } from "@/components/screen";
import { ScreenIntro } from "@/components/screen-intro";
import { makeStyles, radius, spacing } from "@/constants/theme";

type Topic = {
  title: string;
  body: string;
  advice: string;
};

const topics: Topic[] = [
  {
    title: "A voice that sounds exactly like family",
    body: "A few seconds of audio from a video or voicemail is enough to clone a voice today.",
    advice: "If a relative calls asking for money urgently, hang up and call them back on a number you already have.",
  },
  {
    title: "Photos and videos that never happened",
    body: "AI can generate a photo of an accident, a hospital bed, or a face on a video call, all from scratch. A photo isn't proof by itself anymore.",
    advice: "Don't send money because of a photo or video alone, especially when you're told to hurry.",
  },
  {
    title: "Messages written to sound just right",
    body: "The clumsy, misspelled scam email is mostly gone. AI now writes messages in fluent, personal-sounding English.",
    advice: "Don't trust a message because it's well written. Check who really sent it.",
  },
];

// Route: /ai-scams — a short read: what's new, then what still gives scams
// away. Set as one article, not a stack of matching cards.
export default function AiScamsInfo() {
  const styles = useStyles();
  return (
    <Screen>
      <ScreenIntro
        title="What's changed about scams lately"
        subtitle="And what still gives them away."
      />

      <View style={styles.article}>
        {topics.map((topic, i) => (
          <View
            key={topic.title}
            style={[styles.section, i > 0 && styles.divided]}
          >
            <AppText variant="headline" accessibilityRole="header">
              {topic.title}
            </AppText>
            <AppText>{topic.body}</AppText>
            <InstructionStrip tone="success">{topic.advice}</InstructionStrip>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <AppText variant="title" accessibilityRole="header">
          What still gives it away
        </AppText>
        <AppText>
          However real the voice, photo, or writing seems, these are still the
          clearest warning signs:
        </AppText>
        <InstructionStrip tone="danger" label="Stop if you see">
          Pressure to act right now, a request to keep it secret, or payment
          by gift card, wire transfer, or cryptocurrency.
        </InstructionStrip>
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  article: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
  },
  section: {
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  divided: {
    borderTopWidth: 1,
    borderTopColor: c.border,
  },
}));
