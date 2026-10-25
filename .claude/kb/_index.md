# KB index (agent-only, terse)
sync: 3ee2bfb + uncommitted: SDK 58 upgrade (user), claude-design redesign (src/theme/*, new components, headless tabs, persisted theme, new checker/quiz AI schemas), callAI review fixes (HEAD when KB last verified vs code; bump on every KB update)

## App
"Porch Watch" — Expo SDK58 / RN 0.88 app (pkg name congressional-app-chal-2026, Congressional App Challenge 2026). Audience: seniors. Purpose: AI-scam awareness. 4 tabs: Home, Scam Checker (paste text/screenshots→AI verdict, signs, steps), Spot the Scam (5 AI-generated messages, scam vs not + sign), AI Scams (static accordion). Docker Gemini API server in `server/`; Expo `callAI` POSTs to it (URL/token from EXPO_PUBLIC_ env).

Product truth (users, constraints, principles, a11y): `PRODUCT.md` at repo root. Privacy/no-accounts/free-no-ads are binding commitments. Visual truth = `claude-design/` (HTML prototype > DESIGN.md > SKILL.md), summarized in [[ui]]. Root `DESIGN.md` = old look → stale.

## Notes
- [[arch]] routing, layouts, theme provider, state pattern, conventions
- [[ui]] theme tokens, shared components + props
- [[screens]] per-screen behavior/UI
- [[data]] types, content constants, screen logic, AI service
- [[config]] deps, app.json, tsconfig, tooling, assets, env
- [[issues]] dead code, stale comments, TODOs

## Tree (src/, alias @/*→src/*, @/assets/*→assets/*)
```
app/_layout.tsx          fonts (Public Sans + Atkinson) + ThemeProvider + splash gate, SchemeStatusBar, Stack
app/(tabs)/_layout.tsx   headless expo-router/ui Tabs; icon+1-line-label TabButton, active cell filled
app/(tabs)/index.tsx     Home (navy arched band, ThemeButton, Check for Scam, 2 section cards)
app/(tabs)/check.tsx     Scam Checker (input/checking/result; checkForScam→callAI)
app/(tabs)/quiz.tsx      Spot the Scam (5 slots: 30% image each, rest generateQuizItem→callAI; score)
app/(tabs)/ai-scams.tsx  AI Scams accordion (?topic= opens one)
components/app-text.tsx       AppText (variant, tone)
components/icon.tsx           Icon (expo-symbols: tab icons, shield, moon, sun)
components/leaf-card.tsx      LeafCard (leaf radius, fill, border)
components/motion.tsx         FadeIn, PulseDots
components/pill-button.tsx    PillButton (check|band|quiz|quizOutline|quizGhost|outline)
components/screen.tsx         Screen (scroll shell; edgeToEdge, scrollKey, top on focus)
components/screen-header.tsx  ScreenHeader (h1 + subtitle)
components/step-list.tsx      StepList (yellow numbered circles)
components/theme-button.tsx   ThemeButton (Home band light/dark)
components/verdict-panel.tsx  VerdictPanel + verdictStyle
constants/ai-scam-topics.ts   AI_SCAM_TOPICS, AiScamTopicId, isAiScamTopicId
constants/quiz-images.ts      QUIZ_IMAGES (image quiz questions; files in assets/images/quiz/)
theme/colors.ts          Palette light/dark, SchemeContext, useColors, makeStyles
theme/type.ts            fonts, typography
theme/shape.ts           gutter, leaf, pill, minTouchTarget, pressedOpacity, shadows
theme/theme-provider.tsx ThemeProvider + useTheme (AsyncStorage pw.theme)
services/ai.ts           global callAI (POST server /v1/ai, image JPEG re-encode) + MAX_AI_IMAGES, parseJsonReply, UNEXPECTED_REPLY_MESSAGE
types/scam-check.ts      ScamCheckImage/Input, SCAM_VERDICTS/ScamVerdict/isScamVerdict, ScamSign, ScamCheckResult
types/quiz.ts            BundledImageSource, QuizItemContent/QuizItem (kind, from)
```
No app tests. `server/` has Node tests. No utils/ dir. services/ holds only ai.ts.

## Standalone service
`server/` — Dockerized Node API; Gemini via Vertex AI + Google Cloud ADC (no API key); bearer-token guard; `GET /healthz`, `POST /v1/ai`; JSON/base64 image contract. See [[data]].
