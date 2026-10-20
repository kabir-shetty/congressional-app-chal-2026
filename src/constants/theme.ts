import { createContext, useContext } from "react";
import { StyleSheet, type TextStyle } from "react-native";

// Centralized design tokens. The audience is seniors, so defaults favor
// large type, high contrast, and generous touch targets.
//
// Direction: "the friendly neighborhood pharmacist" — kind, expert, calm.
// A deep green-teal shell over a cool white-green ground, white cards with
// hairline borders, and system fonts (SF / Roboto) so text follows the
// phone's own size setting. Red/amber/green appear only where they carry a
// verdict. Every text color is ≥4.5:1 on the surfaces it's used on, in both
// schemes; `border` is decorative only, `borderStrong` is ≥3:1 for inputs.
export type Palette = {
  background: string; // screen ground
  surface: string; // cards, inputs, tab bar
  surfaceTint: string; // tonal buttons, grouped-list press, quiet panels
  text: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  primary: string; // filled buttons, active tab, links
  onPrimary: string;
  header: string; // app-bar band
  onHeader: string;
  onHeaderMuted: string;
  danger: string; // scam / wrong — strip band + verdict text
  dangerTint: string;
  warning: string; // uncertain / caution
  warningTint: string;
  success: string; // safe / correct
  successTint: string;
  onStatus: string; // text on a solid status band
};

const light: Palette = {
  background: "#F4F8F7",
  surface: "#FFFFFF",
  surfaceTint: "#E3F0ED",
  text: "#1F2328",
  textMuted: "#4F5B66",
  border: "#D7E4E1",
  borderStrong: "#7C8C89",
  primary: "#0B6E64",
  onPrimary: "#FFFFFF",
  header: "#0B6E64",
  onHeader: "#FFFFFF",
  onHeaderMuted: "#D3ECE8",
  danger: "#B42318",
  dangerTint: "#FDECEA",
  warning: "#8A5300",
  warningTint: "#FFF3D6",
  success: "#1E6B3A",
  successTint: "#E5F3E9",
  onStatus: "#FFFFFF",
};

const dark: Palette = {
  background: "#0E1615",
  surface: "#17211F",
  surfaceTint: "#1F302D",
  text: "#E8EEED",
  textMuted: "#A9B7B4",
  border: "#2A3835",
  borderStrong: "#71837F",
  primary: "#5CC4B6",
  onPrimary: "#062320",
  header: "#0B4F48",
  onHeader: "#FFFFFF",
  onHeaderMuted: "#BFE0DB",
  danger: "#FF8A7A",
  dangerTint: "#3A1714",
  warning: "#F2C14E",
  warningTint: "#33280C",
  success: "#6FD58F",
  successTint: "#12301D",
  onStatus: "#121212",
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
};

// Side margin for content on edge-to-edge screens (sections, Inset, intro);
// InstructionStrip's `bleed` negates it to reach the screen edges.
export const gutter = spacing.md;

// System font at senior sizes; sizes are pt, so they scale with the phone's
// text-size setting. Nothing goes below 16.
export const typography = {
  largeTitle: { fontSize: 32, lineHeight: 38, fontWeight: "800" },
  title: { fontSize: 26, lineHeight: 32, fontWeight: "700" },
  headline: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  body: { fontSize: 20, lineHeight: 28, fontWeight: "400" },
  bodyStrong: { fontSize: 20, lineHeight: 28, fontWeight: "600" },
  callout: { fontSize: 18, lineHeight: 25, fontWeight: "400" },
  label: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

// Apple/Android guidance is 44-48pt; sized up further here since small
// targets are the most common complaint from older users.
export const minTouchTarget = 56;
