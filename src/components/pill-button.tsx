import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { makeStyles } from "@/theme/colors";
import { minTouchTarget, pill, pressedOpacity, shadows } from "@/theme/shape";
import { fonts } from "@/theme/type";

// check: Scam Checker yellow fill. band: the same action on the Home band.
// quiz / quizOutline / quizGhost (outline on the screen background): Spot
// the Scam teal. outline: ink border on the soft yellow (secondary Scam
// Checker action).
export type PillVariant =
  | "check"
  | "band"
  | "quiz"
  | "quizOutline"
  | "quizGhost"
  | "outline";

// large: the screen's main action. medium: follow-up actions. small: rest.
type PillSize = "large" | "medium" | "small";

type PillButtonProps = {
  title: string;
  onPress: () => void;
  variant: PillVariant;
  size?: PillSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

// Full-pill button. Dims while pressed; disabled turns grey with no press
// feedback and no shadow.
export function PillButton({
  title,
  onPress,
  variant,
  size = "medium",
  disabled = false,
  style,
  accessibilityHint,
}: PillButtonProps) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        base.button,
        sizes[size],
        disabled ? styles.disabled : styles[variant],
        pressed && !disabled && base.pressed,
        style,
      ]}
    >
      <Text
        style={[
          base.label,
          labelSizes[size],
          disabled ? styles.disabledLabel : styles[`${variant}Label`],
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const base = StyleSheet.create({
  button: {
    borderRadius: pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pressed: {
    opacity: pressedOpacity,
  },
  label: {
    fontFamily: fonts.bold,
    textAlign: "center",
  },
});

const sizes = StyleSheet.create({
  large: { minHeight: 64 },
  medium: { minHeight: 60 },
  small: { minHeight: minTouchTarget },
});

const labelSizes = StyleSheet.create({
  large: { fontSize: 22, lineHeight: 28 },
  medium: { fontSize: 20, lineHeight: 26 },
  small: { fontSize: 18, lineHeight: 24 },
});

const useStyles = makeStyles((c) => ({
  check: { backgroundColor: c.check, boxShadow: shadows.button },
  checkLabel: { color: c.onCheck },
  band: { backgroundColor: c.bandButton, boxShadow: shadows.bandButton },
  bandLabel: { color: c.onBandButton },
  quiz: { backgroundColor: c.quiz, boxShadow: shadows.button },
  quizLabel: { color: c.onAccent },
  quizOutline: {
    backgroundColor: c.surface,
    borderWidth: 2,
    borderColor: c.quiz,
  },
  quizOutlineLabel: { color: c.quiz },
  quizGhost: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: c.quiz,
  },
  quizGhostLabel: { color: c.quiz },
  outline: {
    backgroundColor: c.checkSoft,
    borderWidth: 2,
    borderColor: c.ink,
  },
  outlineLabel: { color: c.ink },
  disabled: { backgroundColor: c.disabledBg },
  disabledLabel: { color: c.disabledFg },
}));
