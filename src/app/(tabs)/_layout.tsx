import { Tabs } from "expo-router";
import { View, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon, type IconName } from "@/components/icon";
import {
  fonts,
  makeStyles,
  radius,
  spacing,
  useColors,
} from "@/constants/theme";

// Icon box 32 + 16pt label + paddingTop spacing.sm, with breathing room; the
// home-indicator inset is added at runtime.
const TAB_BAR_HEIGHT = 72;

type TabIconProps = { name: IconName; color: ColorValue; focused: boolean };

// A pale-blue pill behind the selected tab's icon.
function TabIcon({ name, color, focused }: TabIconProps) {
  const styles = useStyles();
  return (
    <View style={[styles.indicator, focused && styles.indicatorActive]}>
      <Icon name={name} color={color} size={24} />
    </View>
  );
}

function tabIcon(name: IconName) {
  return function TabBarIcon({
    color,
    focused,
  }: {
    color: ColorValue;
    focused: boolean;
  }) {
    return <TabIcon name={name} color={color} focused={focused} />;
  };
}

// Bottom tab bar shared by all four screens; each screen draws its own top
// bar (wordmark + light/dark toggle), so no navigator header. Tab labels are
// shorter than screen titles so four fit at 16pt; like native tab bars they
// don't grow with the system text size (the screens do).
export default function TabsLayout() {
  // A fixed height overrides the navigator's own inset handling, so add the
  // home-indicator inset back in or labels get clipped on newer iPhones.
  const { bottom } = useSafeAreaInsets();
  const colors = useColors();
  const styles = useStyles();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: [styles.tabBar, { height: TAB_BAR_HEIGHT + bottom }],
        tabBarLabelStyle: styles.tabLabel,
        tabBarAllowFontScaling: false,
        sceneStyle: styles.scene,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: tabIcon("home") }}
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
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  indicator: {
    width: 56,
    height: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorActive: {
    backgroundColor: c.primaryTint,
  },
  scene: {
    backgroundColor: c.background,
  },
}));
