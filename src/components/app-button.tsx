import { Pressable, Text } from "react-native";

import { Icon, type IconName } from "@/components/icon";
import {
  makeStyles,
  minTouchTarget,
  spacing,
  typography,
  useColors,
} from "@/constants/theme";

// filled: the one main action on a screen. tonal: everything else.
type AppButtonVariant = "filled" | "tonal";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: AppButtonVariant;
  icon?: IconName;
  // Stretch to the container's width instead of hugging the label.
  fullWidth?: boolean;
};

// Large, text-labeled button used everywhere instead of RN's default
// <Button>. Older users benefit more from big targets and a clear label
// than compact or icon-only controls, so `icon` only ever accompanies text.
export function AppButton({
  title,
  onPress,
  disabled,
  variant = "filled",
  icon,
  fullWidth,
}: AppButtonProps) {
  const styles = useStyles();
  const colors = useColors();
  const foreground = disabled
    ? colors.textMuted
    : variant === "filled"
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
        disabled ? styles.disabled : styles[variant],
        fullWidth ? styles.fullWidth : styles.hug,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {icon && <Icon name={icon} color={foreground} size={24} />}
      <Text
        style={[styles.text, disabled ? styles.disabledText : styles[`${variant}Text`]]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  base: {
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    // Always reserve the border so a button doesn't change width when it
    // switches to the outlined disabled look.
    borderWidth: 2,
    borderColor: "transparent",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  filled: {
    backgroundColor: c.primary,
  },
  tonal: {
    backgroundColor: c.surfaceTint,
  },
  filledText: {
    color: c.onPrimary,
  },
  tonalText: {
    color: c.primary,
  },
  hug: {
    alignSelf: "flex-start",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  text: {
    ...typography.bodyStrong,
    flexShrink: 1,
    textAlign: "center",
  },
  // Its own outlined, muted look rather than a faded copy (which in dark
  // mode still read as available) or the tonal fill (which reads as a
  // secondary action).
  disabled: {
    backgroundColor: "transparent",
    borderColor: c.border,
  },
  disabledText: {
    color: c.textMuted,
  },
  pressed: {
    opacity: 0.75,
  },
}));
