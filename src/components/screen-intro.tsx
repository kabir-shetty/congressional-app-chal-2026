import { StyleSheet } from "react-native";

import { AppText } from "@/components/app-text";
import { Inset } from "@/components/inset";
import { spacing } from "@/constants/theme";

type ScreenIntroProps = {
  title: string;
  subtitle: string;
};

// Question-style heading + one plain line at the top of each tab screen.
export function ScreenIntro({ title, subtitle }: ScreenIntroProps) {
  return (
    <Inset style={styles.intro}>
      <AppText variant="title" accessibilityRole="header">
        {title}
      </AppText>
      <AppText tone="textMuted">{subtitle}</AppText>
    </Inset>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: spacing.xs,
  },
});
