import { StyleSheet, View, type ViewProps } from "react-native";

import { gutter } from "@/constants/theme";

// Loose content between cards (progress, button rows, notes) sits in this to
// line up with the cards' side margin.
export function Inset({ style, ...props }: ViewProps) {
  return <View style={[styles.inset, style]} {...props} />;
}

const styles = StyleSheet.create({
  inset: {
    paddingHorizontal: gutter,
  },
});
