import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { LeafCard } from "@/components/leaf-card";
import { FadeIn } from "@/components/motion";
import { Screen } from "@/components/screen";
import { ScreenHeader } from "@/components/screen-header";
import {
  AI_SCAM_TOPICS,
  isAiScamTopicId,
  type AiScamTopicId,
} from "@/constants/ai-scam-topics";
import { makeStyles } from "@/theme/colors";
import { pressedOpacity } from "@/theme/shape";

// Route: /ai-scams — one expandable section per topic, one open at a time.
// `?topic=<id>` (from a Scam Checker result) opens that section.
export default function AiScamsInfo() {
  const styles = useStyles();
  // URL params are untrusted strings; ignore unknown topics.
  const params = useLocalSearchParams<{ topic?: string }>();
  const topic = isAiScamTopicId(params.topic) ? params.topic : undefined;
  const [open, setOpen] = useState<AiScamTopicId | null>(
    topic ?? AI_SCAM_TOPICS[0].id
  );
  // Tabs stay mounted, so a later link with a new topic must reopen here
  // (state adjusted during render rather than in an effect).
  const [linkedTopic, setLinkedTopic] = useState(topic);
  if (topic !== linkedTopic) {
    setLinkedTopic(topic);
    if (topic) setOpen(topic);
  }
  // Consume the param so the next link, even to the same topic, is a change.
  useEffect(() => {
    if (topic) router.setParams({ topic: undefined });
  }, [topic]);

  return (
    <Screen>
      <FadeIn style={layout.stage}>
        <ScreenHeader
          title="AI Scams"
          subtitle="AI makes scams look and sound more real. The warning signs stay the same."
        />

        {AI_SCAM_TOPICS.map((t) => {
          const isOpen = open === t.id;
          return (
            <LeafCard
              key={t.id}
              border={isOpen ? "learn" : "line"}
              style={layout.section}
            >
              <Pressable
                onPress={() => setOpen(isOpen ? null : t.id)}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                accessibilityLabel={t.title}
                style={({ pressed }) => [
                  layout.toggle,
                  pressed && layout.pressed,
                ]}
              >
                <AppText variant="subheading" style={layout.title}>
                  {t.title}
                </AppText>
                <AppText variant="smallStrong" tone="learn">
                  {isOpen ? "Close" : "Read"}
                </AppText>
              </Pressable>

              {isOpen && (
                <View style={layout.body}>
                  <AppText>{t.intro}</AppText>
                  {t.items.map((item) => (
                    <View key={item.title} style={styles.item}>
                      <AppText variant="calloutStrong" tone="learn">
                        {item.title}
                      </AppText>
                      <AppText variant="callout">{item.detail}</AppText>
                    </View>
                  ))}
                </View>
              )}
            </LeafCard>
          );
        })}
      </FadeIn>
    </Screen>
  );
}

const layout = StyleSheet.create({
  stage: { gap: 18 },
  section: { overflow: "hidden" },
  toggle: {
    minHeight: 64,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  pressed: { opacity: pressedOpacity },
  title: { flex: 1 },
  body: {
    paddingHorizontal: 18,
    paddingBottom: 20,
    gap: 14,
  },
});

const useStyles = makeStyles((c) => ({
  item: {
    gap: 4,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: c.soft,
  },
}));
