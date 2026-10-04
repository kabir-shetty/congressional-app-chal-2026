// Centralized design tokens for the whole app. The audience is senior
// citizens, so defaults favor large type, high-contrast colors, and
// generous spacing/touch targets over compact UI. Change values here to
// re-theme everything at once.

export const colors = {
  background: "#FFFFFF",
  surface: "#F0F0F0",
  text: "#1A1A1A",
  border: "#767676", // darker than a typical hairline so edges stay visible
  primary: "#0B4FA0", // dark enough that white text on it stays high-contrast
  primaryText: "#FFFFFF",
  secondary: "#4A4A4A",
  secondaryText: "#FFFFFF",
  danger: "#8B1E1E",
  dangerText: "#FFFFFF",
  success: "#1B5E20",
};

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const fontSize = {
  caption: 18,
  body: 20,
  button: 22,
  header: 26, // nav bar titles
  title: 30, // in-page headings
};

export const radius = 12;

// Apple/Android guidance is 44-48pt; sized up further here since small
// targets are the most common complaint from older users.
export const minTouchTarget = 56;
