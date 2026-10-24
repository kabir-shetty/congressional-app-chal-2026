import { Pressable, Text } from "react-native";

import { Icon, type IconName } from "@/components/icon";
import {
  makeStyles,
  minTouchTarget,
  radius,
  spacing,
  typography,
  useColors,
} from "@/constants/theme";

const ICON_SIZE = 24;

// primary: the one main action on a screen, solid blue. secondary: everything
// else, outlined. Flat, no shadow; pressing dims them.
type AppButtonVariant = "primary" | "secondary";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: AppButtonVariant;
  icon?: IconName;
  // start: hug the label at the leading edge. center: hug, centered.
  // stretch: the container's full width.
  align?: "start" | "center" | "stretch";
};

// Large, text-labeled button used everywhere instead of RN's default
// <Button>. Older users benefit more from big targets and a clear label
// than compact or icon-only controls, so `icon` only ever accompanies text.
export function AppButton({
  title,
  onPress,
  disabled,
  variant = "primary",
  icon,
  align = "start",
}: AppButtonProps) {
  const styles = useStyles();
  const colors = useColors();
  const isPrimary = variant === "primary";
  const foreground = disabled
    ? colors.textMuted
    : isPrimary
      ? colors.onPrimary
      : colors.primary;
  return (
    <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        style={({ pressed }) => [
          styles.base,
          styles[align],
          isPrimary ? styles.primary : styles.secondary,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        {icon && <Icon name={icon} color={foreground} size={ICON_SIZE} />}
        <Text style={[styles.text, { color: foreground }]}>{title}</Text>
      </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  base: {
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  secondary: {
    backgroundColor: c.card,
    borderColor: c.borderStrong,
  },
  // Flat and pale: reads as unavailable without relying on faded text.
  disabled: {
    backgroundColor: c.surface,
    borderColor: c.border,
  },
  pressed: {
    opacity: 0.8,
  },
  start: {
    alignSelf: "flex-start",
  },
  center: {
    alignSelf: "center",
  },
  stretch: {
    alignSelf: "stretch",
  },
  text: {
    ...typography.bodyStrong,
    flexShrink: 1,
    textAlign: "center",
  },
}));
