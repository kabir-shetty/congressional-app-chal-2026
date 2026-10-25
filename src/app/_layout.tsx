import {
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold,
} from "@expo-google-fonts/atkinson-hyperlegible";
import { PublicSans_700Bold } from "@expo-google-fonts/public-sans";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { ThemeProvider, useTheme } from "@/theme/theme-provider";

// Hold the splash until the fonts and the saved theme are in, so text never
// flashes in the system face or the wrong scheme.
SplashScreen.preventAutoHideAsync();

// Home's navy band runs under the status bar, so it always takes light
// icons there; elsewhere icons follow the scheme. Separate component so
// route changes re-render only this, not the Stack.
function SchemeStatusBar() {
  const { isDark } = useTheme();
  const pathname = usePathname();
  return <StatusBar style={pathname === "/" || isDark ? "light" : "dark"} />;
}

function AppShell({ fontsReady }: { fontsReady: boolean }) {
  const { loaded } = useTheme();
  const ready = fontsReady && loaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <SchemeStatusBar />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

// Root stack; the "(tabs)" group draws its own headers. If a font fails to
// load the app still opens in the system font.
export default function RootLayout() {
  const [loaded, error] = useFonts({
    PublicSans_700Bold,
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
  });

  return (
    <ThemeProvider>
      <AppShell fontsReady={loaded || !!error} />
    </ThemeProvider>
  );
}
