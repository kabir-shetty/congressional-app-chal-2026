import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { SchemeProvider } from "@/components/scheme-provider";

// Root stack. The "(tabs)" group renders its own headers, so the root one
// is hidden. Every screen's top is the teal app-bar band in both schemes,
// so status bar icons are always light.
export default function RootLayout() {
  return (
    <SchemeProvider>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SchemeProvider>
  );
}
