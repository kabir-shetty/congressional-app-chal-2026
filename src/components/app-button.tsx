import { Pressable, Text } from "react-native";

import { Icon, type IconName } from "@/components/icon";
import {
  makeStyles,
  minTouchTarget,
  spacing,
  typography,
  useColors,
} from "@/constants/theme";

const ICON_SIZE = 24;
// Material Symbols (Android/web) draw ~3pt inside a 24pt box (measured on
// web); unverified for SF Symbols on iOS. See withIcon.
const ICON_GLYPH_INSET = 3;

// filled: the one main action on a screen. tonal: everything else.
type AppButtonVariant = "filled" | "tonal";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: AppButtonVariant;
  icon?: IconName;
  // start: hug the label at the leading edge. center: hug, centered.
  // stretch: the container's full width.
  align?: "start" | "center" | "stretch";
  // Squircle corners. Opt-in exception to the Square Corner Rule
  // (DESIGN.md); don't use by default.
  rounded?: boolean;
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
  align = "start",
  rounded,
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
        styles[align],
        icon && styles.withIcon,
        rounded && styles.rounded,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {icon && <Icon name={icon} color={foreground} size={ICON_SIZE} />}
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
  // The glyph's own whitespace adds to the leading padding; subtracting it
  // makes the gap before the icon equal the gap after the label.
  withIcon: {
    paddingStart: spacing.lg - ICON_GLYPH_INSET,
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
  // borderCurve "continuous" draws a true squircle on iOS; Android falls
  // back to a plain rounded rectangle. 16 matches the Android tab pill.
  rounded: {
    borderRadius: 16,
    borderCurve: "continuous",
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
