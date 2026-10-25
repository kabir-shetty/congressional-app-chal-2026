import type { Href } from "expo-router";
import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import { Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon, type IconName } from "@/components/icon";
import { makeStyles, useColors, type ColorName } from "@/theme/colors";
import { pressedOpacity } from "@/theme/shape";
import { fonts } from "@/theme/type";

type Tab = {
  name: string;
  href: Href;
  // One line in a quarter-width tab, so shorter than the section name.
  label: string;
  // Screen-reader name when the label is shortened: starts with the visible
  // label (voice control matches it), then the full section name.
  a11yLabel?: string;
  icon: IconName;
  // Section color that fills the active tab cell.
  color: ColorName;
  // Icon + label color on that fill.
  onColor: ColorName;
};

const TABS: Tab[] = [
  { name: "index", href: "/", label: "Home", icon: "home", color: "accent", onColor: "onAccent" },
  { name: "check", href: "/check", label: "Check", a11yLabel: "Check, Scam Checker", icon: "search", color: "check", onColor: "onCheck" },
  { name: "quiz", href: "/quiz", label: "Quiz", a11yLabel: "Quiz, Spot the Scam", icon: "quiz", color: "quiz", onColor: "onAccent" },
  { name: "ai-scams", href: "/ai-scams", label: "AI Scams", icon: "sparkles", color: "learn", onColor: "onAccent" },
];

// Tab labels grow with system text only this far, to stay on one line.
const LABEL_MAX_SCALE = 1.2;

type TabButtonProps = TabTriggerSlotProps & { tab: Tab };

// Icon over label. Active: the whole cell, edge to edge and down through
// the home-indicator inset, fills with the section color; icon and bold
// label switch to its on-color (fill behind content, so yellow stays
// readable). Icons are decorative; a11yLabel (or label) names the tab.
// TabTrigger passes onPress + isFocused; its View-typed ref and style
// aren't needed here.
function TabButton({
  tab,
  isFocused,
  ref: _ref,
  style: _style,
  ...props
}: TabButtonProps) {
  const styles = useStyles();
  const colors = useColors();
  const { bottom } = useSafeAreaInsets();
  const contentColor = isFocused ? colors[tab.onColor] : colors.muted;
  const padBottom = { paddingBottom: Math.max(bottom, 8) };
  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!isFocused }}
      accessibilityLabel={tab.a11yLabel ?? tab.label}
      style={({ pressed }) => [
        layout.button,
        padBottom,
        isFocused && { backgroundColor: colors[tab.color] },
        pressed && layout.pressed,
      ]}
    >
      <Icon name={tab.icon} color={contentColor} />
      <Text
        style={[
          styles.label,
          { color: contentColor },
          isFocused && layout.labelActive,
        ]}
        // Always one line: grows with system text up to LABEL_MAX_SCALE,
        // then shrinks to fit (no lower than 16pt at max scale) rather
        // than wrapping or clipping.
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={1 / LABEL_MAX_SCALE}
        maxFontSizeMultiplier={LABEL_MAX_SCALE}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

// Four equal tabs (headless expo-router/ui so the bar can follow the
// design exactly). Each tab pads the home-indicator inset itself so the
// active fill reaches the screen edge.
export default function TabsLayout() {
  const styles = useStyles();
  return (
    <Tabs style={styles.root}>
      <TabSlot />
      <TabList accessibilityRole="tablist" style={styles.tabBar}>
        {TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
            <TabButton tab={tab} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

const layout = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 56,
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 4,
    gap: 2,
  },
  pressed: { opacity: pressedOpacity },
  labelActive: { fontFamily: fonts.bold },
});

const useStyles = makeStyles((c) => ({
  root: {
    flex: 1,
    backgroundColor: c.bg,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: c.surface,
    borderTopWidth: 2,
    borderTopColor: c.line,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
  },
}));
