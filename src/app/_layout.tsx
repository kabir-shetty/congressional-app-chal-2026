import { Stack } from "expo-router";

import { colors, fontSize } from "@/constants/theme";

// Shared header styling for every top-level screen: large, high-contrast
// title text on a plain background instead of the platform default, so
// headers stay readable at a glance for the app's senior-citizen audience.
// The "info" group gets its header hidden here because its own nested
// layout (src/app/info/_layout.tsx) renders one instead — otherwise the two
// stacks would show a header each.
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontSize: fontSize.header, color: colors.text },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="check" options={{ title: "Scam Checker" }} />
      <Stack.Screen name="quiz" options={{ title: "AI or Not Quiz" }} />
      <Stack.Screen name="info" options={{ headerShown: false }} />
    </Stack>
  );
}
