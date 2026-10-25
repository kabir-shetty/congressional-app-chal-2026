import { useFocusEffect } from "expo-router";
import {
  useCallback,
  useEffect,
  useRef,
  type PropsWithChildren,
} from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewInstance,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { makeStyles } from "@/theme/colors";
import { gutter } from "@/theme/shape";

type ScreenProps = PropsWithChildren<{
  // Content draws under the status bar and handles the top inset itself
  // (the Home band); otherwise the screen pads it and the side gutter.
  edgeToEdge?: boolean;
  // Scrolls back to the top whenever this changes (stage / question).
  scrollKey?: string | number;
}>;

// Themed, scrollable content area shared by every tab. Taps on buttons
// still register while the keyboard is open.
export function Screen({ children, edgeToEdge = false, scrollKey }: ScreenProps) {
  const styles = useStyles();
  const { top } = useSafeAreaInsets();
  const scrollRef = useRef<ScrollViewInstance>(null);

  // Screen changes start at the top: tabs stay mounted, so reset on focus
  // as well as on stage changes.
  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);
  useFocusEffect(scrollToTop);
  useEffect(scrollToTop, [scrollKey, scrollToTop]);

  return (
    <View style={[styles.root, !edgeToEdge && { paddingTop: top }]}>
      <ScrollView
        ref={scrollRef}
        style={layout.scroll}
        contentContainerStyle={edgeToEdge ? layout.fill : layout.padded}
        keyboardShouldPersistTaps="handled"
        // Native indicators are expected; the web one is an unthemed gutter.
        showsVerticalScrollIndicator={Platform.OS !== "web"}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const layout = StyleSheet.create({
  scroll: { flex: 1 },
  fill: { flexGrow: 1 },
  padded: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: gutter,
    paddingBottom: 32,
    gap: 20,
  },
});

const useStyles = makeStyles((c) => ({
  root: {
    flex: 1,
    backgroundColor: c.bg,
  },
}));
