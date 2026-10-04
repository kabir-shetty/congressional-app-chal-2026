import { StyleSheet, View } from "react-native";

import { BodyText } from "@/components/body-text";
import { HeadingText } from "@/components/heading-text";
import { InfoPage } from "@/components/info-page";
import { colors, spacing } from "@/constants/theme";

type Topic = {
  title: string;
  body: string;
};

const topics: Topic[] = [
  {
    title: "A voice that sounds exactly like family",
    body: "A few seconds of audio from a video or voicemail is enough to clone a voice today. If a call from a grandchild or relative asks for money urgently, hang up and call that person back on a number you already have.",
  },
  {
    title: "Photos and videos that never happened",
    body: "AI can generate a photo of an accident, a hospital bed, or a face on a video call, all from scratch. A photo isn't proof by itself anymore, especially if it's paired with a request to send money fast.",
  },
  {
    title: "Messages written to sound just right",
    body: "The clumsy, misspelled scam email is mostly gone. AI now writes messages in fluent, personal-sounding English, so good writing is no longer a sign that a message is genuine.",
  },
  {
    title: "What still gives it away",
    body: "Urgency, secrecy, and a request to pay by gift card, wire transfer, or cryptocurrency are still the clearest warning signs, no matter how convincing the voice, photo, or writing is.",
  },
];

// Route: /info/ai-scams — the landing page's "AI Scams" menu item.
export default function AiScamsInfo() {
  return (
    <InfoPage>
      <BodyText style={styles.intro}>
        Here's what's changed about scams lately, and what still gives them
        away.
      </BodyText>

      {topics.map((topic) => (
        <View key={topic.title} style={styles.topic}>
          <HeadingText style={styles.topicTitle}>{topic.title}</HeadingText>
          <BodyText>{topic.body}</BodyText>
        </View>
      ))}
    </InfoPage>
  );
}

const styles = StyleSheet.create({
  intro: {
    color: colors.secondary,
  },
  topic: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
});
