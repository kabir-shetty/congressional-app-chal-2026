# issues (remove entries when fixed)
## TODO / unimplemented
- `callAI` stub (services/ai.ts) still throws; `server/` Gemini API exists but Expo networking/image encoding are not connected. See [[data]].
- Quiz image items: generateQuizItem text-only; user will provide hand-made/licensed image set (TODO in generateQuizItem).
- Merge of origin/main (e2bd199) in progress: src/hooks/use-quiz.ts, use-scam-check.ts conflicted (deleted locally, edited remotely w/ fake test responses).
- Quiz image items not prefetched in createQuiz (only URIs held) → add expo-image `Image.prefetch` once generateQuizItem returns images.
- ESLint not installed: `npx expo lint` auto-installs eslint + eslint-config-expo into package.json then fails. Don't let it mutate deps unasked; revert package.json/lock if it does.
## dead / stale
- assets/images/tabIcons/* unused (tabs use expo-symbols Icon).
- Web: SymbolView loads Material Symbols font async → icons blank briefly on first paint.
- Native chrome never visually verified (no simulator/emulator on dev machine): iOS/Android captures, Dynamic Type/font-scale large sizes, Android tab pill. Evidence so far = web build only (.impeccable/review/).
- ai-scams.tsx `article` style repeats Card's surface/top-bottom border inline (needs per-section padding + full-width dividers, so not a Card).
- Splash/adaptive-icon art (assets/images) predates "The Pharmacist" redesign; splash bg has no dark variant.
- package.json: reset-project script target missing; junk deps "all", "google-fonts", "ionicons".
- README stock template.
