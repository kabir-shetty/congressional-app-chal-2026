import { View } from "react-native";

import { makeStyles } from "@/constants/theme";

type MeterProps = {
  // 0 to 1; clamped so a stray value can't overflow the track.
  value: number;
  label: string;
};

// Thin square-ended progress bar for the quiz. The number it shows is
// always also written out in nearby text.
export function Meter({ value, label }: MeterProps) {
  const styles = useStyles();
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
    >
      <View style={[styles.fill, { width: `${percent}%` }]} />
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  track: {
    height: 8,
    backgroundColor: c.surfaceTint,
  },
  fill: {
    height: "100%",
    backgroundColor: c.primary,
  },
}));
