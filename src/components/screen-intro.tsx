import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { spacing } from "@/constants/theme";

type ScreenIntroProps = {
  title: string;
  subtitle: string;
};

// Question-style heading + one plain line at the top of each tab screen.
export function ScreenIntro({ title, subtitle }: ScreenIntroProps) {
  return (
    <View style={styles.intro}>
      <AppText variant="title" accessibilityRole="header">
        {title}
      </AppText>
      <AppText tone="textMuted">{subtitle}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: spacing.xs,
  },
});
