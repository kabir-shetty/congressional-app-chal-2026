import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";

import {
  dark,
  light,
  SchemeContext,
  type ColorScheme,
  type Palette,
} from "@/theme/colors";

const STORAGE_KEY = "pw.theme";

type Theme = {
  colors: Palette;
  isDark: boolean;
  // Flips the scheme and remembers the choice across launches.
  toggle: () => void;
  // False until the saved choice has been read; hold the splash until then.
  loaded: boolean;
};

const ThemeContext = createContext<Theme>({
  colors: light,
  isDark: false,
  toggle: () => {},
  loaded: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

// Mode = the user's saved override ?? the phone's setting (live). The root
// holds rendering (and the native splash) until `loaded`, so the saved
// choice is in place before anything themed draws.
export function ThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme() === "dark" ? "dark" : "light";
  const [override, setOverride] = useState<ColorScheme | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === "light" || saved === "dark") setOverride(saved);
      })
      // Unreadable storage just means "follow the phone".
      .catch((error) => console.warn("Theme: couldn't read setting", error))
      .finally(() => setLoaded(true));
  }, []);

  const scheme = override ?? system;
  const toggle = useCallback(() => {
    const next = scheme === "dark" ? "light" : "dark";
    setOverride(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch((error) =>
      console.warn("Theme: couldn't save setting", error)
    );
  }, [scheme]);

  const theme = useMemo(
    () => ({
      colors: scheme === "dark" ? dark : light,
      isDark: scheme === "dark",
      toggle,
      loaded,
    }),
    [scheme, toggle, loaded]
  );

  return (
    <SchemeContext.Provider value={scheme}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </SchemeContext.Provider>
  );
}
