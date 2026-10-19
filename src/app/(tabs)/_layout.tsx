import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

import { colors, fontFamily, fontSize } from "@/constants/theme";

// Bottom tab bar + header shared by all four screens.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="check" options={{ title: "Scam Checker" }} />
      <Tabs.Screen name="quiz" options={{ title: "Spot the Scam" }} />
      <Tabs.Screen name="ai-scams" options={{ title: "AI Scams" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 72,
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.caption,
  },
  header: {
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.header,
    color: colors.text,
  },
});
