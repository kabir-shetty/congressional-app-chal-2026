import { StyleSheet, Text, type TextProps } from "react-native";

import { colors, fontFamily, fontSize } from "@/constants/theme";

// The slab-serif display face, used for the hero line, section titles, and
// notice headings — the one place the type system gets to have personality.
// `style` still merges in so screens can size it per context (title vs.
// display).
export function HeadingText({ style, ...props }: TextProps) {
  return <Text style={[styles.text, style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.title,
    color: colors.text,
  },
});
