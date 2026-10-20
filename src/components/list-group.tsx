import { Link, type Href } from "expo-router";
import { Children, Fragment, type PropsWithChildren } from "react";
import { Pressable, View } from "react-native";

import { AppText } from "@/components/app-text";
import { Icon } from "@/components/icon";
import {
  makeStyles,
  minTouchTarget,
  radius,
  spacing,
  useColors,
} from "@/constants/theme";

// Inset grouped list, the native pattern for a short set of destinations.
// Rows are separated by hairlines drawn here so rows stay layout-agnostic.
export function ListGroup({ children }: PropsWithChildren) {
  const styles = useStyles();
  const rows = Children.toArray(children);
  return (
    <View style={styles.group}>
      {rows.map((row, i) => (
        <Fragment key={i}>
          {i > 0 && <View style={styles.separator} />}
          {row}
        </Fragment>
      ))}
    </View>
  );
}

type ListRowProps = {
  href: Href;
  title: string;
  detail: string;
};

export function ListRow({ href, title, detail }: ListRowProps) {
  const styles = useStyles();
  const colors = useColors();
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link">
        {({ pressed }) => (
          <View style={[styles.row, pressed && styles.pressed]}>
            <View style={styles.text}>
              <AppText variant="bodyStrong">{title}</AppText>
              <AppText variant="callout" tone="textMuted">
                {detail}
              </AppText>
            </View>
            <Icon name="chevron" color={colors.textMuted} />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const useStyles = makeStyles((c) => ({
  group: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  separator: {
    height: 1,
    marginLeft: spacing.md,
    backgroundColor: c.border,
  },
  row: {
    minHeight: minTouchTarget + spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  pressed: {
    backgroundColor: c.surfaceTint,
  },
  text: {
    flex: 1,
    gap: 2,
  },
}));
