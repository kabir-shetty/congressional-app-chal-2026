# issues (remove entries when fixed)
## TODO / unimplemented
- `callAI` stub (services/ai.ts) still throws; `server/` Gemini API exists but Expo networking/image encoding are not connected. See [[data]].
- Quiz image items: generateQuizItem text-only; user will provide hand-made/licensed image set (TODO in generateQuizItem).
- Merge of origin/main (e2bd199) in progress: src/hooks/use-quiz.ts, use-scam-check.ts conflicted (deleted locally, edited remotely w/ fake test responses).
- Tabs have no icons (tabIcons pngs exist, unused).
- Quiz image items not prefetched in createQuiz (only URIs held) → add expo-image `Image.prefetch` once generateQuizItem returns images.
- ESLint not installed: `npx expo lint` auto-installs eslint + eslint-config-expo into package.json then fails. Don't let it mutate deps unasked; revert package.json/lock if it does.
## dead / stale
- app/_layout.tsx registers Stack.Screen "index" but no src/app/index.tsx (index lives in (tabs)).
- AppLinkButton unused. index.tsx style noticeAction unused; Notice.href unused; comment mentions AppLinkButton.
- info-page.tsx comment refs src/app/info/<topic>.tsx + info/_layout.tsx — don't exist.
- ai-scams.tsx / check.tsx route comments say "landing page's menu item" — now tabs.
- package.json: reset-project script target missing; junk deps "all", "google-fonts", "ionicons".
- README stock template.
