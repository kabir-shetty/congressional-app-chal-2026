import { ScrollView, StyleSheet } from "react-native";

import { AppLinkButton } from "@/components/app-link-button";
import { colors, spacing } from "@/constants/theme";

// Landing screen: a menu of large, clearly-labeled buttons linking out to
// each info topic, the scam checker, and the quiz. With typedRoutes on,
// Expo Router checks each AppLinkButton's href against actual route files
// at build time, so a typo here is a compile error rather than a dead link.
export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppLinkButton href="/info/ai-scams" title="AI Scams" />
      <AppLinkButton href="/check" title="Scam Checker" />
      <AppLinkButton href="/quiz" title="AI or Not Quiz" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
});
