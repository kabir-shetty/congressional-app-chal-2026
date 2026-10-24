import { StyleSheet, Text, View } from "react-native";

import { AppText } from "@/components/app-text";
import { fonts, makeStyles, radius, spacing } from "@/constants/theme";

// Two deliberately small charts, one color, no gridlines or decoration. Each
// is also fully described in text, so the graphic is never the only source.

type ConfidenceBarProps = {
  // 0 to 1; clamped so a stray value can't overflow the track.
  value: number;
  // Words for what the bar shows, read aloud ("How sure we are").
  label: string;
};

// A single horizontal bar from "Not sure" to "Very sure" with the percentage
// above it.
export function ConfidenceBar({ value, label }: ConfidenceBarProps) {
  const styles = useStyles();
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <View
      style={base.group}
      accessible
      accessibilityLabel={`${label}: ${percent}%`}
    >
      <AppText variant="callout">
        {label}: <Text style={styles.percent}>{percent}%</Text>
      </AppText>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
      <View style={base.ends}>
        <AppText variant="callout">Not sure</AppText>
        <AppText variant="callout">Very sure</AppText>
      </View>
    </View>
  );
}

type StepChartProps = {
  // One entry per question already answered: true = got it right.
  results: boolean[];
  total: number;
  // Index of the question being asked, or null once finished.
  current: number | null;
};

// One column per quiz question, height says the outcome: tall solid blue =
// right, medium blue outline = missed, short grey = not yet; the tallest
// pale column marks the question being asked. Used for progress and, once
// finished, as the score chart.
export function StepChart({ results, total, current }: StepChartProps) {
  const styles = useStyles();
  const right = results.filter(Boolean).length;
  const missed = results.length - right;
  const summary = `${right} right${missed > 0 ? `, ${missed} missed` : ""}`;
  return (
    <View
      style={base.group}
      accessible
      accessibilityLabel={`${summary}, out of ${total} questions`}
    >
      <View style={base.steps}>
        {Array.from({ length: total }, (_, i) => {
          const answered = i < results.length;
          return (
            <View
              key={i}
              style={[
                styles.step,
                answered && results[i] && styles.stepRight,
                answered && !results[i] && styles.stepMissed,
                i === current && !answered && styles.stepCurrent,
              ]}
            />
          );
        })}
      </View>
      <View style={base.ends}>
        <AppText variant="callout">{summary}</AppText>
        <AppText variant="callout">{total} questions</AppText>
      </View>
    </View>
  );
}

const base = StyleSheet.create({
  group: {
    gap: spacing.sm,
  },
  ends: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  steps: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    height: 56,
  },
});

const useStyles = makeStyles((c) => ({
  percent: {
    fontFamily: fonts.bold,
    color: c.text,
  },
  track: {
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: c.track,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: c.primary,
  },
  // Not answered yet: the shortest, palest column.
  step: {
    flex: 1,
    height: 16,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: c.borderStrong,
    backgroundColor: c.surface,
  },
  stepRight: {
    height: 48,
    borderColor: c.primary,
    backgroundColor: c.primary,
  },
  stepMissed: {
    height: 28,
    borderColor: c.primary,
    backgroundColor: "transparent",
  },
  stepCurrent: {
    height: 56,
    borderColor: c.primary,
    backgroundColor: c.primaryTint,
  },
}));
