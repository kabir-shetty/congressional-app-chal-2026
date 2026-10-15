# KB index (agent-only, terse)
sync: 13245eb (HEAD when KB last verified vs code; bump on every KB update)

## App
"Porch Watch" — Expo SDK57 RN app (pkg name congressional-app-chal-2026, Congressional App Challenge 2026). Audience: seniors. Purpose: AI-scam awareness. 4 tabs: Home, Scam Checker (paste text/screenshots→AI verdict), AI or Not (quiz), AI Scams (static info). AI backend NOT implemented (stubs throw).

## Notes
- [[arch]] routing, layouts, fonts/splash, state pattern
- [[ui]] theme tokens, shared components + props
- [[screens]] per-screen behavior/UI
- [[data]] types, hooks, stubs to implement
- [[config]] deps, app.json, tsconfig, tooling, assets
- [[issues]] dead code, stale comments, TODOs

## Tree (src/, alias @/*→src/*, @/assets/*→assets/*)
```
app/_layout.tsx          Stack root; loads fonts; splash gate
app/(tabs)/_layout.tsx   Tabs navigator, 4 screens, header styling
app/(tabs)/index.tsx     Home (hero + 3 notices, no links)
app/(tabs)/check.tsx     Scam checker → useScamCheck
app/(tabs)/quiz.tsx      AI-or-Not quiz → useQuiz
app/(tabs)/ai-scams.tsx  static info via InfoPage
components/app-button.tsx       AppButton (primary|secondary|danger)
components/app-link-button.tsx  AppLinkButton (UNUSED)
components/body-text.tsx        BodyText
components/heading-text.tsx     HeadingText
components/info-page.tsx        InfoPage scroll shell
constants/theme.ts       colors/spacing/fontSize/fontFamily/radius/minTouchTarget
hooks/use-scam-check.ts  useScamCheck + stub checkForScam
hooks/use-quiz.ts        useQuiz + stub generateQuizItem
types/scam-check.ts      ScamCheckImage/Input/Verdict/Result
types/quiz.ts            QuizItemContent/QuizItem
```
No tests. No services/ or utils/ dir (hooks+services merged into hooks files, commit f4b8305).
