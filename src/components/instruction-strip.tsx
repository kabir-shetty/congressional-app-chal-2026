import { View } from "react-native";

import { AppText } from "@/components/app-text";
import { makeStyles, radius, spacing } from "@/constants/theme";

export type StatusTone = "danger" | "warning" | "success";

type InstructionStripProps = {
  tone: StatusTone;
  label?: string;
  children: string;
};

// The app's signature: a quiet tinted panel with an uppercase label in the
// status color over one plain sentence. The label's words carry the meaning;
// color only reinforces it.
export function InstructionStrip({
  tone,
  label = "What to do",
  children,
}: InstructionStripProps) {
  const styles = useStyles();
  return (
    <View style={[styles.strip, styles[`${tone}Body`]]}>
      <AppText variant="label" tone={tone}>
        {label}
      </AppText>
      <AppText tone="text">{children}</AppText>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  strip: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  dangerBody: { backgroundColor: c.dangerTint },
  warningBody: { backgroundColor: c.warningTint },
  successBody: { backgroundColor: c.successTint },
}));
