import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { AppButton } from "@/components/app-button";
import { AppText, Headline } from "@/components/app-text";
import { Card } from "@/components/card";
import { FeatureCard } from "@/components/feature-card";
import { Inset } from "@/components/inset";
import { InstructionStrip } from "@/components/instruction-strip";
import { Screen } from "@/components/screen";
import { SectionLabel } from "@/components/section-label";
import { spacing } from "@/constants/theme";

// Landing screen, kept sparse on purpose: the tagline and the one main
// action (check a message) first, then the golden rule, then the two
// practice destinations. With typedRoutes on, a typo in an href is a compile
// error, not a dead link.
export default function Index() {
  return (
    <Screen>
      <Inset>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.hero}>
          <Headline
            variant="largeTitle"
            lead="Know the signs before they reach"
            accent="your door."
          />
          <AppText>
            Paste a message or add a screenshot. We&apos;ll explain it
            plainly.
          </AppText>
          <AppButton
            title="Start a check"
            icon="search"
            onPress={() => router.navigate("/check")}
            align="stretch"
          />
        </Animated.View>
      </Inset>

      <Card index={1}>
        <SectionLabel>The golden rule</SectionLabel>
        <AppText variant="headline" accessibilityRole="header">
          Before you reply to anyone
        </AppText>
        <InstructionStrip tone="warning">
          Never pay with gift cards, wire transfers, or cryptocurrency. Real
          banks, agencies, and family won&apos;t ask you to.
        </InstructionStrip>
      </Card>

      <View style={styles.list}>
        <FeatureCard
          index={2}
          href="/quiz"
          icon="quiz"
          title="Spot the Scam"
          detail="Practice with 5 messages and see what gave each one away."
        />
        <FeatureCard
          index={3}
          href="/ai-scams"
          icon="sparkles"
          title="What AI scams look like"
          detail="How AI changed scams, and the signs that still give them away."
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.lg,
    paddingTop: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
});
