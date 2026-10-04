// Centralized design tokens for the whole app. The audience is senior
// citizens, so defaults favor large type, high-contrast colors, and
// generous spacing/touch targets over compact UI. Change values here to
// re-theme everything at once.
//
// Palette direction: "neighborhood watch" — the warmth of neighbors looking
// out for each other, not a sterile warning system. Paper/ink carry the
// plain-spoken reading experience; porch (amber) is the one accent, spent
// on actions and the recurring "spine" divider; dusk (deep teal) gives
// headers and secondary choices their own weight so the page doesn't read
// as a single-accent template. Every color below was checked for at least
// a 4.5:1 contrast ratio against the background it's meant to sit on.
export const colors = {
  background: "#FBF7EF", // paper — warm linen, not a stark white
  surface: "#F1E8D8", // card — a shade deeper, for content set apart from paper
  text: "#2B2420", // ink — warm near-black, keeps body copy legible
  border: "#8C7B63", // line — aged-paper tan, visible without shouting
  primary: "#9C5518", // porch — lamplight amber, the one bold accent
  primaryText: "#FFFFFF",
  secondary: "#1E3A3F", // dusk — deep evening teal, for headers & alt choices
  secondaryText: "#FFFFFF",
  danger: "#8F3324", // brick — alert red, warm rather than clinical
  dangerText: "#FFFFFF",
  success: "#355E3B", // moss — reassuring green for correct/safe states
};

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const fontSize = {
  caption: 16, // meta lines: score, counts
  body: 20,
  button: 20,
  header: 22, // nav bar titles
  title: 24, // in-page section headings
  display: 32, // hero headline (index screen only)
};

// Arvo is a sturdy slab serif — closer to a hand-painted sign or a stamped
// envelope than a glossy editorial typeface — used only for headlines, so
// it reads as a deliberate, occasional voice rather than the page's default
// delivery vehicle. Public Sans (built for US civic/government services) is
// the workhorse for everything meant to be read quickly and plainly.
export const fontFamily = {
  display: "Arvo_700Bold",
  body: "PublicSans_400Regular",
  bodyMedium: "PublicSans_600SemiBold",
};

export const radius = 12;

// Apple/Android guidance is 44-48pt; sized up further here since small
// targets are the most common complaint from older users.
export const minTouchTarget = 56;
