# arch
## Nav (expo-router, typedRoutes on → Href checked at build)
- app/_layout.tsx: `<SchemeProvider>` > `<StatusBar style="light" />` (teal band top in both schemes) + `<Stack>` w/ Screen "(tabs)"(headerShown:false). No font loading/splash gating (system fonts; splash auto-hides).
- app/(tabs)/_layout.tsx: `<Tabs>` screens in order index"Home"(headerShown false), check"Scam Checker"(tabBarLabel "Checker"), quiz"Spot the Scam"(tabBarLabel "Quiz"), ai-scams"AI Scams". `tabIcon(name)` → `TabIcon` (Icon 26; Android only: 64x32 pill bg surfaceTint when focused, Material nav bar). Icons home/search/quiz/sparkles. screenOptions (useColors/makeStyles): active primary, inactive textMuted, tabBar bg surface/borderTop border 1/pt8/height `TAB_BAR_HEIGHT`(68)+useSafeAreaInsets().bottom, label 16/600, tabBarAllowFontScaling false (native tab-bar behavior), header bg header + tint onHeader + title typography.headline, headerShadowVisible false, sceneStyle bg background.
- Routes: `/`, `/check`, `/quiz`, `/ai-scams`.

## State pattern
State local to each screen (no hooks/ dir): `status` union + async fn calling `callAI`; actions in useCallback; error msg = `error instanceof Error ? error.message : "Something went wrong."`. Detail: [[data]].

## Conventions
- Styles: themed → `const useStyles = makeStyles((c) => ({...}))` at file bottom; scheme-independent → `StyleSheet.create`. Values only from theme tokens ([[ui]]); never import raw palettes (read via useColors/makeStyles). Inline style only for dynamic values.
- Text: always `AppText` (variant + tone), never raw Text (except inside AppButton). Buttons: AppButton (filled = one main action, tonal = rest), sentence-case labels except locked "Check for Scam".
- Recurring idioms: `Screen` + `ScreenIntro` per tab; Cards for grouped content (never nested, no icon-card grids); advice/verdicts/errors via `InstructionStrip` (errors: warning "That didn't work"); destinations via ListGroup/ListRow; headings role header; result changes announced via `AccessibilityInfo.announceForAccessibility`. No negative margins, no eyebrow labels above headings, no colored side borders.
- Comments: explain why, 1 per block, above declarations. Double quotes, semicolons, trailing commas.
- Import order mixed (some files externals first, some @/ first); VS Code organizeImports on save.
- reactCompiler enabled (experiments) — useCallback still used manually.
