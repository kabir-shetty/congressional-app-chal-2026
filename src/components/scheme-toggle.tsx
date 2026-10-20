import { Pressable, StyleSheet } from "react-native";

import { Icon } from "@/components/icon";
import { useSchemeControl } from "@/components/scheme-provider";
import { minTouchTarget, useColors } from "@/constants/theme";

// Default native header bar height; a taller box would spill outside the
// header and only the part inside it is tappable, so hitSlop makes up the rest.
const HEADER_HEIGHT = 44;

// Sits on the teal band/header, so it's drawn in the on-header color. Shows
// the scheme it will switch to (moon in light, sun in dark).
export function SchemeToggle() {
  const { scheme, toggle } = useSchemeControl();
  const colors = useColors();
  const isDark = scheme === "dark";
  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      hitSlop={(minTouchTarget - HEADER_HEIGHT) / 2}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon name={isDark ? "sun" : "moon"} color={colors.onHeader} size={28} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: minTouchTarget,
    height: HEADER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
