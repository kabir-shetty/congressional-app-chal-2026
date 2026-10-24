import { createContext, useContext } from "react";
import { StyleSheet, type TextStyle } from "react-native";

// Centralized design tokens. Direction: calm, professional, minimal — white
// and pale blue surfaces, one trustworthy blue for everything interactive,
// navy for text. Few shapes, thin lines, no decoration beyond the data
// graphs, so a worried person has one thing to look at at a time. Atkinson
// Hyperlegible (designed for low vision) is the only typeface. The audience
// is seniors: large type, and every text pair is ≥4.5:1 in both schemes.
// Dark mode keeps the same blue on deep navy.
export type Palette = {
  background: string; // screen ground
  surface: string; // pale blue panels, inputs, tab bar
  card: string; // cards
  text: string; // navy
  textMuted: string; // body copy
  border: string; // card/input hairlines (decorative)
  borderStrong: string; // inputs and outlined buttons (≥3:1)
  primary: string; // trust blue: actions, key words, chart fills
  onPrimary: string;
  primaryTint: string; // pale blue wash: icon chips, quiet fills
  track: string; // empty part of a chart
  danger: string;
  dangerTint: string;
  warning: string;
  warningTint: string;
  success: string;
  successTint: string;
};

const light: Palette = {
  background: "#FFFFFF",
  surface: "#F3F8FD",
  card: "#FFFFFF",
  text: "#0F2744",
  textMuted: "#475A73",
  border: "#DCE7F3",
  borderStrong: "#7B93B0",
  primary: "#1D5FB8",
  onPrimary: "#FFFFFF",
  primaryTint: "#E3EEFB",
  track: "#DCE7F3",
  danger: "#B42318",
  dangerTint: "#FDECEA",
  warning: "#8A5300",
  warningTint: "#FFF4DC",
  success: "#1B7048",
  successTint: "#E6F4EC",
};

const dark: Palette = {
  background: "#0B1626",
  surface: "#10203A",
  card: "#12233C",
  text: "#EAF1FA",
  textMuted: "#A9BBD2",
  border: "#223A59",
  borderStrong: "#6F89AB",
  primary: "#74B2F5",
  onPrimary: "#08203F",
  primaryTint: "#1B3556",
  track: "#27415F",
  danger: "#FF8D7B",
  dangerTint: "#3A1D1B",
  warning: "#F5C25B",
  warningTint: "#33290F",
  success: "#5ED69A",
  successTint: "#143325",
};

export type ColorScheme = "light" | "dark";

// Provided once at the root by SchemeProvider (components/scheme-provider),
// so every themed hook reads the same, hydration-safe scheme.
export const SchemeContext = createContext<ColorScheme>("light");

export function useColors(): Palette {
  return useContext(SchemeContext) === "dark" ? dark : light;
}

// Builds both schemes' StyleSheets once at module load; the returned hook
// just picks one, so themed styles cost nothing per render.
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
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

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Side margin for content; cards and loose content both sit inside it.
export const gutter = spacing.lg;

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

// Atkinson Hyperlegible comes in regular and bold only (loaded in the root
// layout; custom fonts need one family per weight). Sizes are pt, so they
// follow the phone's text size. Body stays 20; nothing goes below 16.
export const fonts = {
  regular: "AtkinsonHyperlegible_400Regular",
  bold: "AtkinsonHyperlegible_700Bold",
};

export const typography = {
  largeTitle: {
    fontFamily: fonts.bold,
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  title: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34 },
  headline: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28 },
  body: { fontFamily: fonts.regular, fontSize: 20, lineHeight: 30 },
  bodyStrong: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 28 },
  callout: { fontFamily: fonts.regular, fontSize: 18, lineHeight: 26 },
  // Small uppercase tag (section labels, strip labels).
  label: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

// Apple/Android guidance is 44-48pt; sized up further here since small
// targets are the most common complaint from older users.
export const minTouchTarget = 56;
