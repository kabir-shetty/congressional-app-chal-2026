import { Pressable } from "react-native";

import { AppText } from "@/components/app-text";
import { Icon } from "@/components/icon";
import { useSchemeControl } from "@/components/scheme-provider";
import {
  makeStyles,
  minTouchTarget,
  radius,
  spacing,
  useColors,
} from "@/constants/theme";

// Visible height; hitSlop makes up the rest of the 56pt target.
const PILL_HEIGHT = 40;

// Icon + word, since icons never stand alone for this audience. Names the
// mode it will switch to.
export function SchemeToggle() {
  const { scheme, toggle } = useSchemeControl();
  const colors = useColors();
  const styles = useStyles();
  const isDark = scheme === "dark";
  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      hitSlop={(minTouchTarget - PILL_HEIGHT) / 2}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon name={isDark ? "sun" : "moon"} color={colors.primary} size={22} />
      <AppText variant="callout" tone="primary" maxFontSizeMultiplier={1.3}>
        {isDark ? "Light" : "Dark"}
      </AppText>
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  button: {
    minHeight: PILL_HEIGHT,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: c.primaryTint,
  },
  pressed: {
    opacity: 0.75,
  },
}));
