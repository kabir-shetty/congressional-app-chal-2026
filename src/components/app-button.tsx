import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fontSize, minTouchTarget, radius, spacing } from "@/constants/theme";

type AppButtonVariant = "primary" | "secondary" | "danger";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: AppButtonVariant;
};

// Large, high-contrast, text-labeled button used everywhere instead of RN's
// default <Button> (which is small and barely stylable). Older users
// benefit more from big tap targets and a clear label than compact or
// icon-only controls.
export function AppButton({
  title,
  onPress,
  disabled,
  variant = "primary",
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant].container,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.text, variantStyles[variant].text]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTouchTarget,
    borderRadius: radius,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: fontSize.button,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});

// One stylesheet per variant so color choices live in theme.ts, not scattered
// through inline conditionals.
const variantStyles = {
  primary: StyleSheet.create({
    container: { backgroundColor: colors.primary },
    text: { color: colors.primaryText },
  }),
  secondary: StyleSheet.create({
    container: { backgroundColor: colors.secondary },
    text: { color: colors.secondaryText },
  }),
  danger: StyleSheet.create({
    container: { backgroundColor: colors.danger },
    text: { color: colors.dangerText },
  }),
};
