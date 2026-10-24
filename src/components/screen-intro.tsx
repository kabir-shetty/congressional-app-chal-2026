import { StyleSheet } from "react-native";

import { AppText, Headline } from "@/components/app-text";
import { Inset } from "@/components/inset";
import { SectionLabel } from "@/components/section-label";
import { spacing } from "@/constants/theme";

type ScreenIntroProps = {
  label: string;
  // Headline split into a plain lead-in and the accented key words.
  lead: string;
  accent: string;
  subtitle: string;
};

// Tag, headline and one plain line at the top of each tab.
export function ScreenIntro({ label, lead, accent, subtitle }: ScreenIntroProps) {
  return (
    <Inset style={styles.intro}>
      <SectionLabel>{label}</SectionLabel>
      <Headline lead={lead} accent={accent} />
      <AppText>{subtitle}</AppText>
    </Inset>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: spacing.sm,
  },
});
