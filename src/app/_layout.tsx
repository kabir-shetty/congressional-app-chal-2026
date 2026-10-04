import { Arvo_700Bold } from "@expo-google-fonts/arvo";
import {
  PublicSans_400Regular,
  PublicSans_600SemiBold,
} from "@expo-google-fonts/public-sans";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Shared header styling for every top-level screen: large, high-contrast
// title text on a plain background instead of the platform default, so
// headers stay readable at a glance for the app's senior-citizen audience.
// The "(tabs)" group gets its header hidden here because its own nested
// layout (src/app/(tabs)/_layout.tsx) renders one instead — otherwise the
// two stacks would show a header each.
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Arvo_700Bold,
    PublicSans_400Regular,
    PublicSans_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch((err) => console.log(err));
    }
  }, [fontsLoaded, fontError]);

  // Keep the splash screen up rather than flashing system-font text for a
  // frame — the display face is load-bearing for the home screen's hero.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
