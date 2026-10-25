# issues (remove entries when fixed)
## TODO / unimplemented
- `EXPO_PUBLIC_AI_API_TOKEN` shipped in app bundle (extractable); server needs real caller auth + rate limits before public release. See [[data]].
- EAS builds: root `.env` gitignored → not available to EAS Build; set EXPO_PUBLIC_AI_API_URL/TOKEN as EAS env vars before first `eas build`, e.g. `eas env:set --name EXPO_PUBLIC_AI_API_URL --value <url> --environment production --visibility plaintext` (client vars plaintext or sensitive, not secret). No eas.json yet. See [[config]].
- Server env file on dev machine is `server/.env.local`, but README/KB say `--env-file server/.env` (user's file; not renamed).
- callAI end-to-end untested on device (no app tests); check.tsx Alert always says "check your internet connection" even for server/size/config errors.
- assets/images/quiz/ holds 4 unreferenced files (not bundled, but committed): wells-fargo-blocked-card-text.jpg (same flow as genuine Fortera → ambiguous), bankfive-username-text.png (603KB; key "reply with username" line hidden under nav bar, browser chrome), college-board-text.webp (off-topic, short link), Screenshot_20261019-232459.webp (partisan PAC ad with recipient name + sender number; user excluded from quiz — shouldn't be committed). Decide: delete or keep out of repo.
- Quiz image cues: only genuine images carry teaching annotations (credit-union green arrows, Fortera caption labels) → "annotated = genuine" tell. Crop/replace if better sources found.
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
