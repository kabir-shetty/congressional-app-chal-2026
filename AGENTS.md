# AGENTS (agent-only, terse)
Expo SDK57 / RN 0.86 mobile app. Mobile-first, perf, cross-platform.

## KB rules (MANDATORY)
KB = Obsidian vault `.claude/kb/`. Entry `.claude/kb/_index.md` → links to notes.
1. READ ONLY KB for understanding. Start at `.claude/kb/_index.md`, open only notes relevant to task. Do NOT read/grep/explore src, configs, or other repo files to learn the codebase.
2. Exceptions: (a) Read a file immediately before editing it (tool requirement) — only files you will edit; (b) KB missing/contradicted info needed for task → read minimal source, then fix KB in same task. `git log` may be used to check `sync:` staleness.
3. EVERY code/config/asset/dep change → update affected KB notes in same task before declaring done: tree in `_index.md`, APIs/props/types/behavior/tokens in notes, `issues.md` (add new debt, delete fixed). Bump `sync:` to current HEAD short hash if committing (else leave + note "uncommitted").
4. KB style: terse, no prose, no human-oriented explanation, fragments/symbols ok, `[[note]]` wikilinks. Facts must match code exactly (names, values, signatures). New note only if a topic doesn't fit existing ones; link it from `_index.md`.

## Expo: don't trust training data
Before touching Expo/EAS/RN APIs: fetch `https://docs.expo.dev/versions/v57.0.0/` (re-check major in package.json if deps changed) or `https://docs.expo.dev/llms.txt` → follow links. Never from memory.

## Commands (npm project → npx)
`npx expo install <pkg>` (ALWAYS, never npm add) · `npx expo start` · `npx expo lint` · `npx tsc --noEmit` · `npx expo-doctor` · `npx expo install --fix`
Run lint + typecheck before done.

## Routing
Expo Router only. Routes in `src/app/` (every file = screen, `_layout.tsx` = navigator). Non-route code outside `src/app/`. Import `Link`, `router`, `useLocalSearchParams` from `expo-router`. Docs: https://docs.expo.dev/router/introduction.md

## EAS
`npx eas-cli@latest build|submit|update` (cloud; no local Xcode/AS). Docs: https://docs.expo.dev/eas/index.md

## Rules
- `ios/`, `android/` generated (CNG) — never hand-edit; use app.json + config plugins.
- Native lib added → needs dev build (`npx expo run:ios|android` or `eas build --profile development`); Expo Go insufficient.
- Prefer Expo modules over 3rd-party; check skills before adding deps. https://docs.expo.dev/versions/latest/index.md
