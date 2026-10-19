# issues (remove entries when fixed)
## TODO / unimplemented
- `callAI` stub (services/ai.ts) throws → both features always error. See [[data]].
- Quiz "Not AI" items are model-written (human-style prompt) → answer untrue; need real human-written source (TODO in generateQuizItem).
- Quiz: 5 identical-prompt callAI calls, no context → likely near-duplicate items.
- Tabs have no icons (tabIcons pngs exist, unused).
- Quiz image items not prefetched in createQuiz (only URIs held) → add expo-image `Image.prefetch` once generateQuizItem returns images.
- Quiz question fetching: sequential loop vs Promise.all vs one batch call (see createQuiz TODO). generateQuizItem now wired; decision still open.
- ESLint not installed: `npx expo lint` auto-installs eslint + eslint-config-expo into package.json then fails. Don't let it mutate deps unasked; revert package.json/lock if it does.
## dead / stale
- app/_layout.tsx registers Stack.Screen "index" but no src/app/index.tsx (index lives in (tabs)).
- AppLinkButton unused. index.tsx style noticeAction unused; Notice.href unused; comment mentions AppLinkButton.
- info-page.tsx comment refs src/app/info/<topic>.tsx + info/_layout.tsx — don't exist.
- ai-scams.tsx / check.tsx route comments say "landing page's menu item" — now tabs.
- package.json: reset-project script target missing; junk deps "all", "google-fonts", "ionicons".
- README stock template.
