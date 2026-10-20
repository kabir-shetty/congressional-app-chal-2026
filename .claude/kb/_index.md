# KB index (agent-only, terse)
sync: e9d7b49 + uncommitted services/ai.ts callAI wiring, quiz unique scenario sampling/concurrent generation, Docker Gemini API server, + uncommitted "The Pharmacist" design-system refactor (theme/makeStyles/SchemeProvider/AppText/InstructionStrip, light+dark) on 5b97167 (HEAD when KB last verified vs code; bump on every KB update)

## App
"Porch Watch" — Expo SDK57 RN app (pkg name congressional-app-chal-2026, Congressional App Challenge 2026). Audience: seniors. Purpose: AI-scam awareness. 4 tabs: Home, Scam Checker (paste text/screenshots→AI verdict), Spot the Scam (quiz: scam vs legit + explanation), AI Scams (static info). Docker Gemini API server in `server/`; Expo `callAI` remains stub/unconnected.

Product truth (users, constraints, principles, a11y): `PRODUCT.md` at repo root (impeccable skill; platform adaptive). Privacy/no-accounts/free-no-ads are binding commitments. Visual system: `DESIGN.md` + `.impeccable/design.json`; direction contract `.impeccable/surfaces/src-app-tabs-index-tsx.md`.

## Notes
- [[arch]] routing, layouts, scheme provider, state pattern, conventions
- [[ui]] theme tokens, shared components + props
- [[screens]] per-screen behavior/UI
- [[data]] types, hooks, stubs to implement
- [[config]] deps, app.json, tsconfig, tooling, assets
- [[issues]] dead code, stale comments, TODOs

## Tree (src/, alias @/*→src/*, @/assets/*→assets/*)
```
app/_layout.tsx          Stack root in SchemeProvider; StatusBar light
app/(tabs)/_layout.tsx   Tabs navigator, 4 screens, tab icons (+Android pill), teal header
app/(tabs)/index.tsx     Home (teal greeting band, check card, rule strip, grouped list)
app/(tabs)/check.tsx     Scam checker (state local; submit; checkForScam→callAI)
app/(tabs)/quiz.tsx      Spot-the-Scam quiz (state local; createQuiz 5 items; generateQuizItem→callAI)
app/(tabs)/ai-scams.tsx  static article w/ instruction strips
components/app-button.tsx       AppButton (filled|tonal, icon?, fullWidth?)
components/app-text.tsx         AppText (variant, tone) — only text component
components/card.tsx             Card (hairline panel)
components/icon.tsx             Icon (expo-symbols map)
components/instruction-strip.tsx InstructionStrip (signature "What to do" label)
components/list-group.tsx       ListGroup/ListRow (grouped links)
components/meter.tsx            Meter progress bar
components/scheme-provider.tsx  SchemeProvider (light/dark, web hydration-safe)
components/screen.tsx           Screen scroll shell (header? slot)
components/screen-intro.tsx     ScreenIntro title+subtitle
constants/theme.ts       Palette light/dark, SchemeContext, useColors, makeStyles, spacing, typography, radius, minTouchTarget
services/ai.ts           global callAI (STUB) + parseJsonReply, UNEXPECTED_REPLY_MESSAGE
types/scam-check.ts      ScamCheckImage/Input/Verdict/Result
types/quiz.ts            QuizItemContent/QuizItem
```
No app tests. `server/` has Node tests. No utils/ dir. services/ holds only ai.ts.

## Standalone service
`server/` — Dockerized Node API; Gemini key server-only; bearer-token guard; `GET /healthz`, `POST /v1/ai`; JSON/base64 image contract. See [[data]].
