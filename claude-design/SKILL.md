---
name: porch-watch-ui
description: Build or edit Porch Watch screens (Expo / React Native) so they match the design system in DESIGN.md. Use for any UI work in src/app or shared components.
---

# Porch Watch UI

Read `DESIGN.md` before changing any screen. It is the visual source of truth. `PRODUCT.md` is the source of truth for copy, tone, and scope.

## Setup (once)

1. Fonts: install `@expo-google-fonts/public-sans` and `@expo-google-fonts/atkinson-hyperlegible`; load `PublicSans_700Bold`, `AtkinsonHyperlegible_400Regular`, `AtkinsonHyperlegible_700Bold` in the root layout.
2. Icons: `@expo/vector-icons` (Ionicons).
3. Create `src/theme/` with:
   - `colors.ts` — `light` and `dark` objects using the exact token names and hex values from DESIGN.md.
   - `ThemeProvider` — mode = user override (AsyncStorage key `pw.theme`) ?? `useColorScheme()`. Expose `{ colors, isDark, toggle }`.
   - `type.ts` — the type scale from DESIGN.md.
4. Shared components in `src/components/`: `PillButton` (variants: check, quiz, quizOutline, accent, outline), `LeafCard`, `VerdictPanel`, `StepList`, `ScreenHeader`, `ThemeButton`.

## Rules

- Use tokens only. No raw hex in screens.
- Buttons are pills; cards use the leaf radius (28/28/28/8). Never uniform rounded rectangles.
- Every `Pressable` dims to opacity 0.6 while pressed, except when disabled.
- Section color: Home navy, Scam Checker yellow (fill + dark text only), Spot the Scam teal, AI Scams violet. Red/green/amber only for verdicts and quiz feedback.
- Minimums: body 20pt, any text 16pt, touch target 56pt, contrast 4.5:1. Keep system font scaling on; test at the largest size.
- Icons always sit next to text unless decorative (then hide from screen readers).
- Copy: plain, warm, short sentences. Sentence-case buttons ("It's not a scam", "Try again"); "Check for Scam" keeps its casing. Confidence is shown in words, never as a percentage.
- Don't add accuracy claims, testimonials, accounts, payments, or a privacy statement (until server behavior is verified).

## Theme button

On the Home band, right of the logo. Shows the opposite mode: `moon` + "Dark" in light mode, `sunny` + "Light" in dark mode. Tapping sets and persists the override.

## Checklist before finishing

- [ ] Light and dark both checked.
- [ ] Largest system font size: no clipping, headline/shield don't collide.
- [ ] VoiceOver/TalkBack: headings, tab roles, result announced.
- [ ] Pressed state visible on every button.
- [ ] Matches the corresponding screen in `Porch Watch.dc.html`.
