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
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="info" options={{ headerShown: false }} />
    </Stack>
  );
}
