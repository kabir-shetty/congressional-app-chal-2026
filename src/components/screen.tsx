import { useState, type PropsWithChildren } from "react";
import {
  Platform,
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/app-text";
import { Icon } from "@/components/icon";
import { SchemeToggle } from "@/components/scheme-toggle";
import { gutter, makeStyles, spacing, useColors } from "@/constants/theme";

// Themed, scrollable content area shared by every tab, under a fixed top bar
// holding the wordmark and the light/dark toggle. The bar gains a hairline
// once content scrolls beneath it.
// Taps on buttons still register while the keyboard is open.
export function Screen({ children }: PropsWithChildren) {
  const styles = useStyles();
  const colors = useColors();
  const { top } = useSafeAreaInsets();
  const [scrolled, setScrolled] = useState(false);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = e.nativeEvent.contentOffset.y > 8;
    if (next !== scrolled) setScrolled(next);
  };

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.bar,
          { paddingTop: top + spacing.sm },
          scrolled && styles.barScrolled,
        ]}
      >
        <View style={styles.brand}>
          <Icon name="shield" color={colors.primary} size={26} />
          <AppText
            variant="headline"
            numberOfLines={1}
            maxFontSizeMultiplier={1.15}
          >
            Porch Watch
          </AppText>
        </View>
        <SchemeToggle />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={32}
        // Native indicators are expected; the web one is an unthemed gutter.
        showsVerticalScrollIndicator={Platform.OS !== "web"}
      >
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  root: {
    flex: 1,
    backgroundColor: c.background,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: gutter,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    backgroundColor: c.background,
  },
  barScrolled: {
    borderBottomColor: c.border,
  },
  brand: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  // Cards carry their own side margin; loose content wraps itself in Inset.
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
}));
