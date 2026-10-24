# issues (remove entries when fixed)
## TODO / unimplemented
- `EXPO_PUBLIC_AI_API_TOKEN` shipped in app bundle (extractable); server needs real caller auth + rate limits before public release. See [[data]].
- callAI end-to-end untested on device (no app tests); check.tsx Alert always says "check your internet connection" even for server/size/config errors.
- Quiz image items: generateQuizItem text-only; user will provide hand-made/licensed image set (TODO in generateQuizItem).
- Merge of origin/main (e2bd199) in progress: src/hooks/use-quiz.ts, use-scam-check.ts conflicted (deleted locally, edited remotely w/ fake test responses).
- Quiz image items not prefetched in createQuiz (only URIs held) → add expo-image `Image.prefetch` once generateQuizItem returns images.
- Pre-existing lint: quiz.tsx setState-in-effect (createQuiz on mount) + ref-cleanup warning; scheme-provider.tsx setHydrated-in-effect.
## dead / stale
- assets/images/tabIcons/* unused (tabs use expo-symbols Icon).
- Web: SymbolView loads Material Symbols font async → icons blank briefly on first paint.
- Native chrome never visually verified (no simulator/emulator on dev machine): iOS/Android captures, Dynamic Type/font-scale large sizes, Android tab pill. Evidence so far = web build only (.impeccable/review/).
- Splash/adaptive-icon art (assets/images) predates redesign (colors updated in app.json, images not).
- Redesign unverified on device/simulator: Atkinson metrics at large font scale, top bar fit at 360pt + large text, chart rendering, dark palette by eye. Fonts load at runtime (failure → system font).
- Root DESIGN.md, .impeccable/, claude-design/ are stale vs [[ui]].
- package.json: reset-project script target missing; junk deps "all", "google-fonts", "ionicons".
- README stock template.
- dark/light choice not persisted (no storage dep); resets per launch
