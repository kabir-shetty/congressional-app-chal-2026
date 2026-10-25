import { StyleSheet, Text, type TextProps } from "react-native";

import { makeStyles, type ColorName } from "@/theme/colors";
import { typography, type TypographyVariant } from "@/theme/type";

type TextTone = Extract<
  ColorName,
  | "ink"
  | "muted"
  | "accent"
  | "onBand"
  | "onBandMuted"
  | "quiz"
  | "learn"
  | "scamInk"
  | "safeInk"
  | "unsureInk"
>;

type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  tone?: TextTone;
};

// The only text component: one entry per step of the type scale, colored
// from the active scheme. `style` merges last for layout tweaks.
export function AppText({
  variant = "body",
  tone = "ink",
  style,
  ...props
}: AppTextProps) {
  const toneStyles = useToneStyles();
  return (
    <Text style={[typeStyles[variant], toneStyles[tone], style]} {...props} />
  );
}

const typeStyles = StyleSheet.create(typography);

// One precomputed color style per tone, so text nodes don't allocate a new
// style object every render.
const useToneStyles = makeStyles((c) => ({
  ink: { color: c.ink },
  muted: { color: c.muted },
  accent: { color: c.accent },
  onBand: { color: c.onBand },
  onBandMuted: { color: c.onBandMuted },
  quiz: { color: c.quiz },
  learn: { color: c.learn },
  scamInk: { color: c.scamInk },
  safeInk: { color: c.safeInk },
  unsureInk: { color: c.unsureInk },
}));
