import { StyleSheet, View, type ViewProps } from "react-native";

import { gutter } from "@/constants/theme";

// Screen content runs edge to edge so sections can touch both sides; loose
// content between sections (progress, button rows, notes) sits in this to
// keep the standard side margin.
export function Inset({ style, ...props }: ViewProps) {
  return <View style={[styles.inset, style]} {...props} />;
}

const styles = StyleSheet.create({
  inset: {
    paddingHorizontal: gutter,
  },
});
