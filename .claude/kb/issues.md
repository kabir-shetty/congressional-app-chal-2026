# issues (remove entries when fixed)
## TODO / unimplemented
- `EXPO_PUBLIC_AI_API_TOKEN` shipped in app bundle (extractable); server needs real caller auth + rate limits before public release. See [[data]].
- callAI end-to-end untested on device (no app tests); check.tsx Alert always says "check your internet connection" even for server/size/config errors.
- Quiz image items: generateQuizItem text-only; user will provide hand-made/licensed image set (TODO in generateQuizItem).
- Quiz image items not prefetched in createQuiz (only URIs held) → add expo-image `Image.prefetch` once generateQuizItem returns images.
- Lint: quiz.tsx setState-in-effect (createQuiz on mount) + ref-cleanup warning.
## dead / stale
- assets/images/tabIcons/* unused (tabs use expo-symbols Icon).
- Web: SymbolView loads Material Symbols font async → icons blank briefly on first paint.
- Icons via expo-symbols, not the design's Ionicons (deprecation); glyphs approximate shield-checkmark/moon/sunny.
- Web static export prerenders empty pages (root returns null until fonts + theme loaded).
- claude-design redesign never visually verified (no simulator/emulator/browser on dev machine): compare each screen vs "Porch Watch.dc.html" in light+dark, largest font scale (headline/shield collision; tab label shrink at 1.2× on narrow screens, lineHeight 20 clipping), Home arch, boxShadow on Android, VoiceOver/TalkBack. Only `expo export -p web` bundling checked.
- Splash/adaptive-icon art (assets/images) predates redesign (colors updated in app.json, images not).
- Fonts load at runtime (failure → system font).
- Root DESIGN.md is stale (old look); claude-design/ is truth. claude-design/DESIGN.md:106 says teal current quiz pill, HTML uses accent.
- package.json: reset-project script target missing; junk deps "all", "google-fonts", "ionicons".
- README stock template.
