import type { TextStyle } from "react-native";

// Headings in Public Sans 700; body and buttons in Atkinson Hyperlegible
// (designed for low vision). Custom fonts need one family per weight; all
// three are loaded in the root layout. Sizes are pt and follow the phone's
// text size. Body stays 20; nothing goes below 16.
export const fonts = {
  heading: "PublicSans_700Bold",
  regular: "AtkinsonHyperlegible_400Regular",
  bold: "AtkinsonHyperlegible_700Bold",
};

// Scale from claude-design/DESIGN.md (prototype rem × 16, rounded).
export const typography = {
  // Quiz score "N of 5".
  display: { fontFamily: fonts.heading, fontSize: 51, lineHeight: 56 },
  // Screen title (h1).
  title: { fontFamily: fonts.heading, fontSize: 32, lineHeight: 37 },
  // Result headline.
  resultTitle: { fontFamily: fonts.heading, fontSize: 30, lineHeight: 35 },
  homeTitle: { fontFamily: fonts.heading, fontSize: 29, lineHeight: 33 },
  // Waiting-state headline ("Reading the message…").
  statusTitle: { fontFamily: fonts.heading, fontSize: 29, lineHeight: 35 },
  // Quiz feedback ("You got it.").
  feedbackTitle: { fontFamily: fonts.heading, fontSize: 24, lineHeight: 29 },
  // Card / section title (h2).
  heading: { fontFamily: fonts.heading, fontSize: 22, lineHeight: 27 },
  // Accordion and quiz sub-headings.
  subheading: { fontFamily: fonts.heading, fontSize: 21, lineHeight: 26 },
  body: { fontFamily: fonts.regular, fontSize: 20, lineHeight: 29 },
  bodyStrong: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 28 },
  callout: { fontFamily: fonts.regular, fontSize: 18, lineHeight: 26 },
  calloutStrong: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24 },
  small: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  smallStrong: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  // "PORCH WATCH" on the Home band.
  wordmark: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 1.28,
    textTransform: "uppercase",
  },
  // Uppercase verdict label.
  label: {
    fontFamily: fonts.bold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
