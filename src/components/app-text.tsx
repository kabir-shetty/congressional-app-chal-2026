import { StyleSheet, Text, type TextProps } from "react-native";

import {
  makeStyles,
  typography,
  type Palette,
  type TypographyVariant,
} from "@/constants/theme";

type TextTone = Extract<
  keyof Palette,
  "text" | "textMuted" | "primary" | "danger" | "warning" | "success"
>;

type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  tone?: TextTone;
};

// The only text component: one entry per step of the type scale, colored
// from the active scheme. `style` merges last for layout tweaks.
export function AppText({
  variant = "body",
  tone,
  style,
  ...props
}: AppTextProps) {
  const toneStyles = useToneStyles();
  // Body copy reads in the softer muted tone; headings in full-strength text.
  const defaultTone =
    variant === "body" || variant === "callout" ? "textMuted" : "text";
  return (
    <Text
      style={[typeStyles[variant], toneStyles[tone ?? defaultTone], style]}
      {...props}
    />
  );
}

type HeadlineProps = TextProps & {
  variant?: "largeTitle" | "title";
  // Plain lead-in, then the key words in the accent blue.
  lead: string;
  accent: string;
};

export function Headline({
  variant = "title",
  lead,
  accent,
  style,
  ...props
}: HeadlineProps) {
  const toneStyles = useToneStyles();
  return (
    <Text
      accessibilityRole="header"
      style={[typeStyles[variant], toneStyles.text, style]}
      {...props}
    >
      {lead} <Text style={toneStyles.primary}>{accent}</Text>
    </Text>
  );
}

const typeStyles = StyleSheet.create(typography);

// One precomputed color style per tone, so text nodes don't allocate a new
// style object every render.
const useToneStyles = makeStyles((c) => ({
  text: { color: c.text },
  textMuted: { color: c.textMuted },
  primary: { color: c.primary },
  danger: { color: c.danger },
  warning: { color: c.warning },
  success: { color: c.success },
}));
