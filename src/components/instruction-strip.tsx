import { View } from "react-native";

import { AppText } from "@/components/app-text";
import { gutter, makeStyles, spacing } from "@/constants/theme";

export type StatusTone = "danger" | "warning" | "success";

type InstructionStripProps = {
  tone: StatusTone;
  label?: string;
  // Inside a Card (or other section padded by `gutter`), stretch past the
  // section's side padding so the strip spans the full screen width.
  bleed?: boolean;
  children: string;
};

// The app's signature: a pharmacy-style instruction label. A solid band in
// the status color names the panel ("What to do"), and the tinted body
// below holds one plain sentence. Color repeats what the words say, never
// replaces them.
export function InstructionStrip({
  tone,
  label = "What to do",
  bleed,
  children,
}: InstructionStripProps) {
  const styles = useStyles();
  return (
    <View style={[styles[`${tone}Body`], bleed && styles.bleed]}>
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
  // Negative margin is the full-bleed escape from the parent's padding.
  bleed: {
    marginHorizontal: -gutter,
  },
  // Side padding matches the section's, so bled strip text lines up with
  // the text above it.
  band: {
    paddingHorizontal: gutter,
    paddingVertical: spacing.sm,
  },
  text: {
    paddingHorizontal: gutter,
    paddingVertical: spacing.md,
  },
  dangerBand: { backgroundColor: c.danger },
  dangerBody: { backgroundColor: c.dangerTint },
  warningBand: { backgroundColor: c.warning },
  warningBody: { backgroundColor: c.warningTint },
  successBand: { backgroundColor: c.success },
  successBody: { backgroundColor: c.successTint },
}));
