import { createContext, useContext } from "react";
import {
  StyleSheet,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";

// Tokens from claude-design/DESIGN.md (source: "Porch Watch.dc.html").
// Navy base, one color per section: Home navy, Scam Checker yellow (fill
// behind dark text only), Spot the Scam teal, AI Scams violet. Red/green/
// amber are reserved for verdicts and quiz feedback.
export type Palette = {
  bg: string; // screen background
  surface: string; // cards, inputs, tab bar
  ink: string; // primary text
  muted: string; // secondary text
  line: string; // borders, dividers
  lineStrong: string; // input borders
  soft: string; // message header strip
  accent: string; // Home / general accent (navy)
  onAccent: string;
  band: string; // Home header band
  onBand: string;
  onBandMuted: string;
  sun: string; // decorative yellow (icons, fills)
  bandButton: string; // "Check for Scam" on the Home band (same yellow both schemes)
  onBandButton: string;
  logoDot: string; // teal dot in the logo mark, same in both schemes
  check: string; // Scam Checker buttons (fill only)
  onCheck: string;
  checkSoft: string; // secondary Scam Checker button fill
  quiz: string; // Spot the Scam accent (teal)
  quizTint: string;
  learn: string; // AI Scams accent (violet)
  learnTint: string;
  scamInk: string;
  scamTint: string;
  safeInk: string;
  safeTint: string;
  unsureInk: string;
  unsureTint: string;
  disabledBg: string;
  disabledFg: string;
};

export const light: Palette = {
  bg: "#F4F6F9",
  surface: "#FFFFFF",
  ink: "#142033",
  muted: "#46536A",
  line: "#D5DCE6",
  lineStrong: "#8C99AD",
  soft: "#E9EDF3",
  accent: "#1F3A5F",
  onAccent: "#FFFFFF",
  band: "#1F3A5F",
  onBand: "#FFFFFF",
  onBandMuted: "#D6E0EE",
  sun: "#F2C14E",
  bandButton: "#F2C14E",
  onBandButton: "#142033",
  logoDot: "#7FD3CF",
  check: "#F2C14E",
  onCheck: "#142033",
  checkSoft: "#FFF8E3",
  quiz: "#1C7472",
  quizTint: "#D6EFEC",
  learn: "#77479C",
  learnTint: "#EEE4F6",
  scamInk: "#A12C1C",
  scamTint: "#FBE3DE",
  safeInk: "#1F6440",
  safeTint: "#DDF0E4",
  unsureInk: "#7A5300",
  unsureTint: "#F7EBCB",
  disabledBg: "#DCE2EA",
  disabledFg: "#4F5B6E",
};

export const dark: Palette = {
  bg: "#0F1621",
  surface: "#18212F",
  ink: "#EEF2F7",
  muted: "#AEB9CA",
  line: "#2C3747",
  lineStrong: "#5B687C",
  soft: "#222C3B",
  accent: "#9DBCEB",
  onAccent: "#0F1621",
  band: "#1A2B42",
  onBand: "#EEF2F7",
  onBandMuted: "#C3CEDD",
  sun: "#E8B940",
  bandButton: "#F2C14E",
  onBandButton: "#0F1621",
  logoDot: "#7FD3CF",
  check: "#E8B940",
  onCheck: "#0F1621",
  checkSoft: "#241E10",
  quiz: "#7FD3CF",
  quizTint: "#14302F",
  learn: "#CDAAEE",
  learnTint: "#271D35",
  scamInk: "#F2A595",
  scamTint: "#3A1E1A",
  safeInk: "#8FD3A8",
  safeTint: "#16301F",
  unsureInk: "#E8C46E",
  unsureTint: "#33290F",
  disabledBg: "#2C3747",
  disabledFg: "#AEB9CA",
};

export type ColorScheme = "light" | "dark";
export type ColorName = keyof Palette;

// Provided once at the root by ThemeProvider, so every themed hook reads the
// same, hydration-safe scheme.
export const SchemeContext = createContext<ColorScheme>("light");

export function useColors(): Palette {
  return useContext(SchemeContext) === "dark" ? dark : light;
}

// Builds both schemes' StyleSheets once at module load; the returned hook
// just picks one, so themed styles cost nothing per render.
export function makeStyles<
  const T extends Record<string, ViewStyle | TextStyle | ImageStyle>,
>(
  factory: (colors: Palette) => T
) {
  const sheets = {
    light: StyleSheet.create(factory(light)),
    dark: StyleSheet.create(factory(dark)),
  };
  return function useStyles() {
    return useContext(SchemeContext) === "dark" ? sheets.dark : sheets.light;
  };
}
