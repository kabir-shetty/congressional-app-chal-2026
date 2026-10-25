import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
};

// Plain header used by every tab except Home: h1 + optional muted line.
export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <AppText variant="title" accessibilityRole="header">
        {title}
      </AppText>
      {subtitle && <AppText tone="muted">{subtitle}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: 8 },
});
