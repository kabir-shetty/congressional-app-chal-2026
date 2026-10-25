import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { LeafCard } from "@/components/leaf-card";
import { useColors } from "@/theme/colors";
import type { ScamVerdict } from "@/types/scam-check";

// Verdict label, colors, and fixed headline. The result always states the
// verdict in words; color is never the only signal.
export const verdictStyle = {
  likely_scam: {
    label: "Likely a scam",
    headline: "This looks like a scam.",
    ink: "scamInk",
    tint: "scamTint",
  },
  likely_safe: {
    label: "Likely not a scam",
    headline: "This looks like a normal message.",
    ink: "safeInk",
    tint: "safeTint",
  },
  uncertain: {
    label: "Can't tell",
    headline: "We can't tell from this message alone.",
    ink: "unsureInk",
    tint: "unsureTint",
  },
} as const satisfies Record<ScamVerdict, object>;

type VerdictPanelProps = {
  verdict: ScamVerdict;
  // The one most important thing to do, shown in bold.
  action: string;
  // Confidence in words ("Very likely"); never a percentage.
  sure: string;
};

// Tinted result panel at the top of a Scam Checker result.
export function VerdictPanel({ verdict, action, sure }: VerdictPanelProps) {
  const colors = useColors();
  const { label, headline, ink, tint } = verdictStyle[verdict];
  return (
    <LeafCard fill={tint} style={styles.panel}>
      <View style={styles.labelRow}>
        <View style={[styles.dot, { backgroundColor: colors[ink] }]} />
        <AppText variant="label" tone={ink}>
          {label}
        </AppText>
      </View>
      <AppText variant="resultTitle" accessibilityRole="header">
        {headline}
      </AppText>
      <AppText variant="bodyStrong">{action}</AppText>
      <AppText variant="callout">
        How sure: <AppText variant="calloutStrong">{sure}</AppText>
      </AppText>
    </LeafCard>
  );
}

const styles = StyleSheet.create({
  panel: {
    paddingVertical: 24,
    paddingHorizontal: 22,
    gap: 12,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
