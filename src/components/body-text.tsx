import { StyleSheet, Text, type TextProps } from "react-native";

import { colors, fontSize } from "@/constants/theme";

// Standard readable paragraph/label text (20pt, high-contrast) used instead
// of RN's default ~14pt Text throughout the app. `style` still merges in so
// screens can tweak color/weight per use (e.g. an error in red).
export function BodyText({ style, ...props }: TextProps) {
  return <Text style={[styles.text, style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontSize: fontSize.body,
    color: colors.text,
  },
});
