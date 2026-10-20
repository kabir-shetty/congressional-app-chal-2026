import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { Platform, useColorScheme } from "react-native";

import { SchemeContext, type ColorScheme } from "@/constants/theme";

type SchemeControl = { scheme: ColorScheme; toggle: () => void };

const SchemeControlContext = createContext<SchemeControl>({
  scheme: "light",
  toggle: () => {},
});

// Current scheme plus toggle(); toggling pins an override that ignores later
// system changes for the rest of the session.
export function useSchemeControl() {
  return useContext(SchemeControlContext);
}

// Follows the phone's light/dark setting until the user toggles, after which
// their choice wins for the rest of the session. Static web pages are
// prerendered in light, and React doesn't patch styles that differ during
// hydration, so on web the light scheme is kept until after mount, then the
// real one applies; native has no prerender and uses the scheme immediately.
export function SchemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme() === "dark" ? "dark" : "light";
  const [override, setOverride] = useState<ColorScheme | null>(null);
  const [hydrated, setHydrated] = useState(Platform.OS !== "web");
  useEffect(() => setHydrated(true), []);

  const scheme = hydrated ? (override ?? system) : "light";
  const toggle = useCallback(
    () => setOverride(scheme === "dark" ? "light" : "dark"),
    [scheme]
  );
  const control = useMemo(() => ({ scheme, toggle }), [scheme, toggle]);

  return (
    <SchemeContext.Provider value={scheme}>
      <SchemeControlContext.Provider value={control}>
        {children}
      </SchemeControlContext.Provider>
    </SchemeContext.Provider>
  );
}
