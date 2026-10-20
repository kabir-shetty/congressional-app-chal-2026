import type { PropsWithChildren, ReactNode } from "react";
import { Platform, ScrollView, View } from "react-native";

import { makeStyles, spacing } from "@/constants/theme";

type ScreenProps = PropsWithChildren<{
  // Full-bleed band above the content that scrolls with it, so a
  // tall header never squeezes the content at large text sizes.
  header?: ReactNode;
}>;

// Themed, scrollable content area shared by every tab. Taps on buttons
// still register while the keyboard is open (the checker's text box).
export function Screen({ header, children }: ScreenProps) {
  const styles = useStyles();
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      // Native indicators are expected; the web one is an unthemed gutter.
      showsVerticalScrollIndicator={Platform.OS !== "web"}
    >
      {header}
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const useStyles = makeStyles((c) => ({
  scroll: {
    backgroundColor: c.background,
  },
  container: {
    flexGrow: 1,
  },
  // No side padding: sections (Card, ListGroup) touch both screen edges,
  // loose content wraps itself in Inset.
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
}));
