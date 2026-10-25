import { router, type Href } from "expo-router";
import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/app-text";
import { Icon } from "@/components/icon";
import { FadeIn } from "@/components/motion";
import { PillButton } from "@/components/pill-button";
import { Screen } from "@/components/screen";
import { ThemeButton } from "@/components/theme-button";
import { makeStyles, useColors, type ColorName } from "@/theme/colors";
import { gutter, leaf, pressedOpacity } from "@/theme/shape";

// Depth of the shallow arch along the band's bottom edge.
const ARCH_DEPTH = 36;
// Prototype shield (74, about two headline lines) enlarged 20%, centered on
// the headline's second line (y≈50). Center nudged 7pt right of the
// prototype's (55) so the headline still fits on 360pt screens.
const SHIELD_SIZE = 89;
const SHIELD_CENTER_RIGHT = 48;
const SHIELD_CENTER_Y = 50;
// Headline text stops at the shield's left edge, never under it.
const SHIELD_CLEARANCE = SHIELD_CENTER_RIGHT + SHIELD_SIZE / 2;

type FeatureCardProps = {
  href: Href;
  fill: ColorName;
  tone: "quiz" | "learn";
  mark: ReactNode;
  title: string;
  detail: string;
  cta: string;
};

// Whole-card link to a section, tinted in that section's color.
function FeatureCard({ href, fill, tone, mark, title, detail, cta }: FeatureCardProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={() => router.navigate(href)}
      accessibilityRole="link"
      accessibilityLabel={`${title}. ${detail} ${cta}`}
      style={({ pressed }) => [
        leaf,
        layout.card,
        { backgroundColor: colors[fill] },
        pressed && layout.pressed,
      ]}
    >
      {mark}
      <AppText variant="heading">{title}</AppText>
      <AppText tone="muted">{detail}</AppText>
      <View style={layout.cta}>
        <AppText variant="bodyStrong" tone={tone}>
          {cta} →
        </AppText>
      </View>
    </Pressable>
  );
}

// Route: / — navy band (logo, theme button, tagline, the one main action),
// then the two learning sections.
export default function Index() {
  const styles = useStyles();
  const colors = useColors();
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <Screen edgeToEdge>
      <FadeIn>
        <View style={[styles.band, { paddingTop: top + 16 }]}>
          <View style={layout.topRow}>
            <View style={layout.brand}>
              <View style={layout.logo} accessibilityElementsHidden>
                <View style={styles.logoSun} />
                <View style={styles.logoDot} />
              </View>
              <AppText variant="wordmark" tone="onBand" maxFontSizeMultiplier={1.3}>
                Verisafe
              </AppText>
            </View>
            <ThemeButton />
          </View>

          <View>
            <AppText
              variant="homeTitle"
              tone="onBand"
              accessibilityRole="header"
              style={layout.headline}
            >
              {"Know the signs\nbefore they\nreach your door."}
            </AppText>
            <View style={layout.shield}>
              <Icon name="shield" color={colors.sun} size={SHIELD_SIZE} />
            </View>
          </View>

          <AppText tone="onBandMuted" style={layout.lede}>
            Got a message that worries you? Check it before you reply, click,
            or pay.
          </AppText>
          <PillButton
            title="Check for Scam"
            variant="band"
            size="large"
            onPress={() => router.navigate("/check")}
            style={layout.bandButton}
          />
        </View>
        {/* Bottom half of a wide ellipse: the band's arched lower edge. */}
        <View style={layout.archClip} accessibilityElementsHidden>
          <View
            style={[
              styles.arch,
              { transform: [{ scaleX: width / (ARCH_DEPTH * 2) }] },
            ]}
          />
        </View>

        <View style={layout.content}>
          <FeatureCard
            href="/quiz"
            fill="quizTint"
            tone="quiz"
            mark={
              <View style={layout.marks} accessibilityElementsHidden>
                <View style={[layout.circle, styles.quizFill]} />
                <View style={[layout.circle, styles.quizRing]} />
                <View style={[layout.circle, styles.quizFill, layout.faded]} />
              </View>
            }
            title="Spot the Scam"
            detail="Practice with 5 messages. See how you do."
            cta="Start practice"
          />
          <FeatureCard
            href="/ai-scams"
            fill="learnTint"
            tone="learn"
            mark={
              <View
                style={[layout.marks, layout.marksBottom]}
                accessibilityElementsHidden
              >
                <View style={[layout.halfDisc, styles.learnFill]} />
                <View style={[layout.circle, styles.learnFill, layout.faded]} />
              </View>
            }
            title="How AI changed scams"
            detail="Cloned voices, fake photos, perfect-sounding messages."
            cta="Read about AI Scams"
          />
        </View>
      </FadeIn>
    </Screen>
  );
}

const layout = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  brand: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
  },
  headline: {
    paddingRight: SHIELD_CLEARANCE,
  },
  // Under the theme button (nudged right), on the headline's second line.
  shield: {
    position: "absolute",
    right: SHIELD_CENTER_RIGHT - SHIELD_SIZE / 2,
    top: SHIELD_CENTER_Y - SHIELD_SIZE / 2,
  },
  lede: {
    marginTop: 10,
  },
  bandButton: {
    marginTop: 6,
  },
  archClip: {
    height: ARCH_DEPTH,
    overflow: "hidden",
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: gutter,
    paddingBottom: 32,
    gap: 18,
  },
  card: {
    padding: 22,
    gap: 8,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  cta: {
    marginTop: 6,
    minHeight: 44,
    justifyContent: "center",
  },
  marks: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  marksBottom: {
    alignItems: "flex-end",
    gap: 4,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  halfDisc: {
    width: 44,
    height: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  faded: {
    opacity: 0.3,
  },
});

const useStyles = makeStyles((c) => ({
  band: {
    paddingHorizontal: gutter,
    paddingBottom: 40 - ARCH_DEPTH,
    gap: 14,
    backgroundColor: c.band,
  },
  // Circle scaled horizontally to the screen width; only its lower half
  // shows below the band.
  arch: {
    alignSelf: "center",
    marginTop: -ARCH_DEPTH,
    width: ARCH_DEPTH * 2,
    height: ARCH_DEPTH * 2,
    borderRadius: ARCH_DEPTH,
    backgroundColor: c.band,
  },
  logoSun: {
    width: 20,
    height: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: c.sun,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
    backgroundColor: c.logoDot,
  },
  quizFill: { backgroundColor: c.quiz },
  quizRing: { borderWidth: 3, borderColor: c.quiz },
  learnFill: { backgroundColor: c.learn },
}));
