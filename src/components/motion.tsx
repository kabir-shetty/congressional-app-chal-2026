import { useEffect, type PropsWithChildren } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// Content fades and slides up 8pt over 300ms. Reanimated skips layout
// animations when the system's Reduce Motion is on.
const entering = FadeInDown.duration(300).withInitialValues({
  opacity: 0,
  transform: [{ translateY: 8 }],
});

export function FadeIn({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}

function Dot({ color, index }: { color: string; index: number }) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    progress.value = withDelay(
      index * 200,
      withRepeat(withTiming(1, { duration: 600 }), -1, true)
    );
  }, [index, progress, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.35 + progress.value * 0.65,
    transform: [{ scale: 0.6 + progress.value * 0.4 }],
  }));

  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

// Three pulsing dots for "working on it" states (static with Reduce Motion).
export function PulseDots({ color }: { color: string }) {
  return (
    <View
      style={styles.row}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {[0, 1, 2].map((i) => (
        <Dot key={i} color={color} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  dot: { width: 18, height: 18, borderRadius: 9 },
});
