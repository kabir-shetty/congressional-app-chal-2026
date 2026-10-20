import { StyleSheet, Text, type TextProps } from "react-native";

import {
  makeStyles,
  typography,
  type Palette,
  type TypographyVariant,
} from "@/constants/theme";

type TextTone = Extract<
  keyof Palette,
  | "text"
  | "textMuted"
  | "primary"
  | "danger"
  | "warning"
  | "success"
  | "onHeader"
  | "onHeaderMuted"
  | "onStatus"
>;

type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  tone?: TextTone;
};

// The only text component: one entry per step of the type scale, colored
// from the active scheme. `style` merges last for layout tweaks.
export function AppText({
  variant = "body",
  tone = "text",
  style,
  ...props
}: AppTextProps) {
  const toneStyles = useToneStyles();
  return (
    <Text
      style={[typeStyles[variant], toneStyles[tone], style]}
      {...props}
    />
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
  onHeader: { color: c.onHeader },
  onHeaderMuted: { color: c.onHeaderMuted },
  onStatus: { color: c.onStatus },
}));
