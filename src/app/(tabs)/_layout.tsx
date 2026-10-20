import { Tabs } from "expo-router";
import { Platform, View, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon, type IconName } from "@/components/icon";
import { SchemeToggle } from "@/components/scheme-toggle";
import { makeStyles, spacing, typography, useColors } from "@/constants/theme";

// Icon 26 (in a 32 pill on Android) + 16pt label + paddingTop spacing.sm,
// with breathing room; the home-indicator inset is added at runtime.
const TAB_BAR_HEIGHT = 68;

type TabIconProps = { name: IconName; color: ColorValue; focused: boolean };

// Android's Material navigation bar marks the selected destination with a
// tinted pill behind its icon; iOS tab bars rely on tint color alone.
function TabIcon({ name, color, focused }: TabIconProps) {
  const styles = useStyles();
  const icon = <Icon name={name} color={color} size={26} />;
  if (Platform.OS !== "android") {
    return icon;
  }
  return (
    <View style={[styles.indicator, focused && styles.indicatorActive]}>
      {icon}
    </View>
  );
}

function tabIcon(name: IconName) {
  return ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <TabIcon name={name} color={color} focused={focused} />
  );
}

// Bottom tab bar + teal app bar shared by all four screens. Home draws its
// own taller teal band instead of the header. Tab labels are shorter than
// header titles so four fit at 16pt; like native tab bars they don't grow
// with the system text size (the screens do).
export default function TabsLayout() {
  // A fixed height overrides the navigator's own inset handling, so add the
  // home-indicator inset back in or labels get clipped on newer iPhones.
  const { bottom } = useSafeAreaInsets();
  const colors = useColors();
  const styles = useStyles();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: [styles.tabBar, { height: TAB_BAR_HEIGHT + bottom }],
        tabBarLabelStyle: styles.tabLabel,
        tabBarAllowFontScaling: false,
        headerStyle: styles.header,
        headerTintColor: colors.onHeader,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
        headerRight: () => <SchemeToggle />,
        // The toggle already carries its own side space.
        headerRightContainerStyle: { paddingEnd: 0 },
        sceneStyle: styles.scene,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", headerShown: false, tabBarIcon: tabIcon("home") }}
      />
      <Tabs.Screen
        name="check"
        options={{
          title: "Scam Checker",
          tabBarLabel: "Checker",
          tabBarIcon: tabIcon("search"),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: "Spot the Scam",
          tabBarLabel: "Quiz",
          tabBarIcon: tabIcon("quiz"),
        }}
      />
      <Tabs.Screen
        name="ai-scams"
        options={{ title: "AI Scams", tabBarIcon: tabIcon("sparkles") }}
      />
    </Tabs>
  );
}

const useStyles = makeStyles((c) => ({
  tabBar: {
    backgroundColor: c.surface,
    borderTopColor: c.border,
    borderTopWidth: 1,
    paddingTop: spacing.sm,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: c.header,
  },
  headerTitle: {
    ...typography.headline,
    color: c.onHeader,
  },
  indicator: {
    width: 64,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorActive: {
    backgroundColor: c.surfaceTint,
  },
  scene: {
    backgroundColor: c.background,
  },
}));
