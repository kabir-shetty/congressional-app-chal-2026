import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { colors, spacing } from "@/constants/theme";

// Shared shell for every src/app/info/<topic>.tsx route. The page title is
// set on the route itself (see src/app/info/_layout.tsx) and shown in the
// header, so this only provides the themed, scrollable content area — new
// topic pages render this and pass their copy in as children.
export function InfoPage({ children }: PropsWithChildren) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {children}
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
