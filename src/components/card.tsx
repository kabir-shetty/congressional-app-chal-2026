import { View, type ViewProps } from "react-native";

import { gutter, makeStyles, spacing } from "@/constants/theme";

// Full-width section: a surface band that touches both screen edges, ruled
// top and bottom with hairlines, square corners. The one container for
// grouping a heading, its copy, and its actions. Never nest.
export function Card({ style, ...props }: ViewProps) {
  const styles = useStyles();
  return <View style={[styles.card, style]} {...props} />;
}

const useStyles = makeStyles((c) => ({
  card: {
    gap: spacing.md,
    paddingHorizontal: gutter,
    paddingVertical: spacing.lg,
    backgroundColor: c.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: c.border,
  },
}));
