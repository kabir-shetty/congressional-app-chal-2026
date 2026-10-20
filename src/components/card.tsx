import { View, type ViewProps } from "react-native";

import { makeStyles, radius, spacing } from "@/constants/theme";

// White panel with a hairline border and no shadow — the one container for
// grouping a heading, its copy, and its actions. Never nest cards.
export function Card({ style, ...props }: ViewProps) {
  const styles = useStyles();
  return <View style={[styles.card, style]} {...props} />;
}

const useStyles = makeStyles((c) => ({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: radius.card,
  },
}));
