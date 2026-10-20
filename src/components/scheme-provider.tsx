import { useEffect, useState, type PropsWithChildren } from "react";
import { Platform, useColorScheme } from "react-native";

import { SchemeContext } from "@/constants/theme";

// Follows the phone's light/dark setting. Static web pages are prerendered
// in light, and React doesn't patch styles that differ during hydration, so
// on web the light scheme is kept until after mount, then the real one
// applies; native has no prerender and uses the system scheme immediately.
export function SchemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme() === "dark" ? "dark" : "light";
  const [hydrated, setHydrated] = useState(Platform.OS !== "web");
  useEffect(() => setHydrated(true), []);
  return (
    <SchemeContext.Provider value={hydrated ? system : "light"}>
      {children}
    </SchemeContext.Provider>
  );
}
