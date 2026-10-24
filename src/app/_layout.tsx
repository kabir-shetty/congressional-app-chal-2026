import {
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold,
} from "@expo-google-fonts/atkinson-hyperlegible";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import {
  SchemeProvider,
  useSchemeControl,
} from "@/components/scheme-provider";

// Hold the splash until the fonts are in, so text never flashes in the
// system face and then jumps.
SplashScreen.preventAutoHideAsync();

// Status bar icons follow the scheme: light icons on the dark ground, dark
// icons on the paper one.
function ThemedStatusBar() {
  const { scheme } = useSchemeControl();
  return <StatusBar style={scheme === "dark" ? "light" : "dark"} />;
}

// Root stack. The "(tabs)" group draws its own top bar, so the stack header
// is hidden. If a font fails to load the app still opens in the system font (bold
// then comes from the platform, not Atkinson).
export default function RootLayout() {
  const [loaded, error] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
  });
  const ready = loaded || !!error;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <SchemeProvider>
      <ThemedStatusBar />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SchemeProvider>
  );
}
