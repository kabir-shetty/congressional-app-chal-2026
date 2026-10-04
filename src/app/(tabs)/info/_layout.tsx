import { Stack } from "expo-router";

import { colors, fontFamily, fontSize } from "@/constants/theme";

// Every file dropped into src/app/(tabs)/info/ is picked up by Expo Router
// automatically and shares this stack, so new topic pages don't need their
// own layout file — just add a <Stack.Screen name="<slug>" options={{
// title: "..." }} /> entry below for its header title. The tabs layout
// hides its own header for this route (see src/app/(tabs)/_layout.tsx) so
// this is the only header shown, styled with the same theme tokens.
export default function InfoLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: {
          fontFamily: fontFamily.display,
          fontSize: fontSize.header,
          color: colors.text,
        },
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="ai-scams" options={{ title: "AI Scams" }} />
    </Stack>
  );
}
