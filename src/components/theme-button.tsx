import { Pressable, StyleSheet, Text } from "react-native";

import { Icon } from "@/components/icon";
import { makeStyles } from "@/theme/colors";
import { minTouchTarget, pill, pressedOpacity, shadows } from "@/theme/shape";
import { useTheme } from "@/theme/theme-provider";
import { fonts } from "@/theme/type";

// Sits on the Home band. Shows the mode you'd switch to: moon + "Dark" in
// light mode, sun + "Light" in dark mode. Tapping saves the choice.
export function ThemeButton() {
  const styles = useStyles();
  const { colors, isDark, toggle } = useTheme();
  const label = isDark ? "Light" : "Dark";
  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${label.toLowerCase()} mode`}
      style={({ pressed }) => [styles.button, pressed && base.pressed]}
    >
      <Icon name={isDark ? "sun" : "moon"} color={colors.ink} size={22} />
      <Text style={styles.label} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </Pressable>
  );
}

const base = StyleSheet.create({
  pressed: { opacity: pressedOpacity },
});

const useStyles = makeStyles((c) => ({
  button: {
    minHeight: minTouchTarget,
    paddingHorizontal: 20,
    borderRadius: pill,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: c.surface,
    boxShadow: shadows.chip,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: c.ink,
  },
}));
