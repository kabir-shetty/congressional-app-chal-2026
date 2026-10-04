import { Stack } from "expo-router";

import { colors, fontSize } from "@/constants/theme";

// Every file dropped into src/app/info/ is picked up by Expo Router
// automatically and shares this stack, so new topic pages don't need their
// own layout file — just add a <Stack.Screen name="<slug>" options={{
// title: "..." }} /> entry below for its header title. The root layout
// hides its own header for this whole group (see src/app/_layout.tsx) so
// this is the only header shown, styled with the same theme tokens.
export default function InfoLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontSize: fontSize.header, color: colors.text },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="ai-scams" options={{ title: "AI Scams" }} />
    </Stack>
  );
}
