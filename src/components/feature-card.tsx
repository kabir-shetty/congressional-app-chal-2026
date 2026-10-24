import { Link, type Href } from "expo-router";
import { Pressable, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Card } from "@/components/card";
import { Icon, type IconName } from "@/components/icon";
import { makeStyles, radius, spacing, useColors } from "@/constants/theme";

type FeatureCardProps = {
  href: Href;
  icon: IconName;
  title: string;
  detail: string;
  index?: number;
};

// A destination: one link row with a pale-blue icon chip, a title, one plain
// sentence and a chevron. The icon always sits beside its text.
export function FeatureCard({
  href,
  icon,
  title,
  detail,
  index = 0,
}: FeatureCardProps) {
  const styles = useStyles();
  const colors = useColors();
  return (
    <Card index={index} style={styles.flush}>
      <Link href={href} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${title}. ${detail}`}
        >
          {({ pressed }) => (
            <View style={[styles.row, pressed && styles.pressed]}>
              <View style={styles.chip}>
                <Icon name={icon} color={colors.primary} size={26} />
              </View>
              <View style={styles.text}>
                <AppText variant="headline">{title}</AppText>
                <AppText variant="callout">{detail}</AppText>
              </View>
              <Icon name="chevron" color={colors.textMuted} />
            </View>
          )}
        </Pressable>
      </Link>
    </Card>
  );
}

const useStyles = makeStyles((c) => ({
  // The row supplies its own padding so the whole card is the tap target.
  flush: {
    padding: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg - 1,
  },
  pressed: {
    backgroundColor: c.surface,
  },
  chip: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.primaryTint,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
}));
