import { View } from "react-native";

import { AppText } from "@/components/app-text";
import { makeStyles, radius, spacing } from "@/constants/theme";

export type StatusTone = "danger" | "warning" | "success";

type InstructionStripProps = {
  tone: StatusTone;
  label?: string;
  children: string;
};

// The app's signature: a pharmacy-style instruction label. A solid band in
// the status color names the panel ("What to do"), and the tinted body
// below holds one plain sentence. Color repeats what the words say, never
// replaces them.
export function InstructionStrip({
  tone,
  label = "What to do",
  children,
}: InstructionStripProps) {
  const styles = useStyles();
  return (
    <View style={[styles.strip, styles[`${tone}Body`]]}>
      <View style={[styles.band, styles[`${tone}Band`]]}>
        <AppText variant="label" tone="onStatus">
          {label}
        </AppText>
      </View>
      <AppText style={styles.text}>{children}</AppText>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  strip: {
    borderRadius: radius.control,
    overflow: "hidden",
  },
  band: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  dangerBand: { backgroundColor: c.danger },
  dangerBody: { backgroundColor: c.dangerTint },
  warningBand: { backgroundColor: c.warning },
  warningBody: { backgroundColor: c.warningTint },
  successBand: { backgroundColor: c.success },
  successBody: { backgroundColor: c.successTint },
}));
