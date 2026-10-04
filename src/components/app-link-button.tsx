import { Link, type Href } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fontSize, minTouchTarget, radius, spacing } from "@/constants/theme";

type AppLinkButtonProps = {
  href: Href;
  title: string;
};

// Same look as AppButton, but navigates via Link instead of firing a
// callback. `asChild` hands Link's navigation behavior to our own Pressable
// so the tap target/typography match every other button in the app.
export function AppLinkButton({ href, title }: AppLinkButtonProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        style={({ pressed }) => [styles.base, pressed && styles.pressed]}
      >
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTouchTarget,
    borderRadius: radius,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: fontSize.button,
    fontWeight: "700",
    color: colors.primaryText,
  },
  pressed: {
    opacity: 0.8,
  },
});
