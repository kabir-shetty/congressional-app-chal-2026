import Animated, { FadeInDown } from "react-native-reanimated";
import type { ViewProps } from "react-native";

import { gutter, makeStyles, radius, spacing } from "@/constants/theme";

type CardProps = ViewProps & {
  // Position in a stack of cards; staggers the entrance by 80ms each.
  index?: number;
};

// The one container: white panel, hairline border, soft corners, no shadow.
// Fades in from slightly below (reduced-motion users get none). Never nest.
export function Card({ style, index = 0, ...props }: CardProps) {
  const styles = useStyles();
  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 80)}
      style={[styles.card, style]}
      {...props}
    />
  );
}

const useStyles = makeStyles((c) => ({
  card: {
    gap: spacing.md,
    marginHorizontal: gutter,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.card,
  },
}));
