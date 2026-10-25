import type { ViewStyle } from "react-native";

// Side margin of every screen (prototype padding 22).
export const gutter = 22;

// Cards and panels: the "leaf" — three round corners, one tight. Never
// uniform rounded rectangles.
export const leaf = {
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  borderBottomRightRadius: 28,
  borderBottomLeftRadius: 8,
} satisfies ViewStyle;

export const pill = 999;

// Apple/Android guidance is 44-48pt; sized up for older users.
export const minTouchTarget = 56;

// Every Pressable dims to this while pressed, except when disabled.
export const pressedOpacity = 0.6;

export const shadows = {
  // Filled primary buttons.
  button: "0px 6px 16px rgba(20, 32, 51, 0.18)",
  // The "Check for Scam" button on the navy Home band.
  bandButton: "0px 8px 20px rgba(0, 0, 0, 0.22)",
  // Theme button on the Home band.
  chip: "0px 4px 12px rgba(0, 0, 0, 0.18)",
} satisfies Record<string, ViewStyle["boxShadow"]>;
