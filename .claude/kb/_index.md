# KB index (agent-only, terse)
sync: e9d7b49 + uncommitted callAI→server POST (expo-image-manipulator, EXPO_PUBLIC_AI_API_URL/TOKEN), services/ai.ts callAI wiring, quiz unique scenario sampling/concurrent generation, Docker Gemini API server, + uncommitted dark/light toggle (scheme-provider override, scheme-toggle) + uncommitted "Calm blue" minimal redesign + charts (theme, components, screens, Atkinson; supersedes earlier looks) on 5b97167 (HEAD when KB last verified vs code; bump on every KB update)

## App
"Porch Watch" — Expo SDK57 RN app (pkg name congressional-app-chal-2026, Congressional App Challenge 2026). Audience: seniors. Purpose: AI-scam awareness. 4 tabs: Home, Scam Checker (paste text/screenshots→AI verdict), Spot the Scam (quiz: scam vs legit + explanation), AI Scams (static info). Docker Gemini API server in `server/`; Expo `callAI` POSTs to it (URL/token from EXPO_PUBLIC_ env).

Product truth (users, constraints, principles, a11y): `PRODUCT.md` at repo root (impeccable skill; platform adaptive). Privacy/no-accounts/free-no-ads are binding commitments. Visual truth = [[ui]] (minimal light-blue/white). `claude-design/`, root `DESIGN.md`, `.impeccable/*` describe OLD looks → stale.

## Notes
- [[arch]] routing, layouts, scheme provider, state pattern, conventions
- [[ui]] theme tokens, shared components + props
- [[screens]] per-screen behavior/UI
- [[data]] types, hooks, stubs to implement
- [[config]] deps, app.json, tsconfig, tooling, assets
- [[issues]] dead code, stale comments, TODOs

## Tree (src/, alias @/*→src/*, @/assets/*→assets/*)
```
app/_layout.tsx          Atkinson fonts+splash gate, SchemeProvider, ThemedStatusBar, Stack
app/(tabs)/_layout.tsx   Tabs navigator (no header), 4 screens, tab icons in rounded box
app/(tabs)/index.tsx     Home (tagline + CTA, golden-rule card, 2 FeatureCard rows)
app/(tabs)/check.tsx     Scam checker (state local; submit; checkForScam→callAI)
app/(tabs)/quiz.tsx      Spot-the-Scam quiz (state local; createQuiz 5 items; generateQuizItem→callAI)
app/(tabs)/ai-scams.tsx  static topics as Cards w/ instruction strips
components/app-button.tsx       AppButton (primary|secondary, flat)
components/app-text.tsx         AppText (variant, tone) + Headline (lead+accent)
components/card.tsx             Card (hairline white, index stagger)
components/feature-card.tsx     FeatureCard (icon-chip link row)
components/charts.tsx           ConfidenceBar, StepChart (minimal charts)
components/icon.tsx             Icon (expo-symbols map)
components/inset.tsx            Inset (side padding for loose content)
components/instruction-strip.tsx InstructionStrip (signature tinted label panel)
components/scheme-provider.tsx  SchemeProvider + useSchemeControl (override, web hydration-safe)
components/scheme-toggle.tsx    SchemeToggle (icon+word pill, in Screen top bar)
components/screen.tsx           Screen scroll shell + fixed top bar (shield, wordmark, toggle)
components/screen-intro.tsx     ScreenIntro (label + headline + subtitle)
components/section-label.tsx    SectionLabel (uppercase blue tag)
constants/theme.ts       Palette light/dark, SchemeContext, useColors, makeStyles, spacing, gutter, radius, fonts, typography, minTouchTarget
services/ai.ts           global callAI (POST server /v1/ai, image JPEG re-encode) + MAX_AI_IMAGES, parseJsonReply, UNEXPECTED_REPLY_MESSAGE
types/scam-check.ts      ScamCheckImage/Input/Verdict/Result
types/quiz.ts            QuizItemContent/QuizItem
```
No app tests. `server/` has Node tests. No utils/ dir. services/ holds only ai.ts.

## Standalone service
`server/` — Dockerized Node API; Gemini key server-only; bearer-token guard; `GET /healthz`, `POST /v1/ai`; JSON/base64 image contract. See [[data]].
