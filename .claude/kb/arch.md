# arch
## Nav (expo-router, typedRoutes on → Href checked at build)
- app/_layout.tsx: useFonts (Atkinson Hyperlegible 400/700; splash held via expo-router SplashScreen until loaded or error) → `<SchemeProvider>` > `ThemedStatusBar` (light icons on dark, dark on light) + `<Stack>` w/ Screen "(tabs)"(headerShown:false).
- app/(tabs)/_layout.tsx: `<Tabs>` headerShown false (each Screen draws own top bar w/ wordmark + SchemeToggle); screens in order index"Home", check"Scam Checker"(tabBarLabel "Checker"), quiz"Spot the Scam"(tabBarLabel "Quiz"), ai-scams"AI Scams". `tabIcon(name)` → named `TabBarIcon` → `TabIcon` (Icon 24 in 56x32 pill; focused: primaryTint bg). Icons home/search/quiz/sparkles. screenOptions: active primary, inactive textMuted, tabBar bg surface/borderTop border 1/pt8/height `TAB_BAR_HEIGHT`(72)+useSafeAreaInsets().bottom, label Atkinson bold 16, tabBarAllowFontScaling false, sceneStyle bg background.
- Routes: `/`, `/check`, `/quiz`, `/ai-scams`.

## State pattern
State local to each screen (no hooks/ dir): `status` union + async fn calling `callAI`; actions in useCallback; error msg = `error instanceof Error ? error.message : "Something went wrong."`. Detail: [[data]].

## Conventions
- Styles: themed → `const useStyles = makeStyles((c) => ({...}))` at file bottom; scheme-independent → `StyleSheet.create`. Values only from theme tokens ([[ui]]; no shadows); never import raw palettes (read via useColors/makeStyles). Inline style only for dynamic values.
- Text: always `AppText` (variant + tone), never raw Text (except inside AppButton). Buttons: AppButton (filled = one main action, tonal = rest), sentence-case labels except locked "Check for Scam".
- Recurring idioms: `Screen` + `ScreenIntro` per tab; `Card`s (never nested) w/ `index` stagger; advice/verdicts via `InstructionStrip` (quiz errors: warning "That didn't work"; checker errors: console + native Alert); destinations via FeatureCard; headings role header (Headline/AppText); result changes announced via `AccessibilityInfo.announceForAccessibility`. Layout: Screen has no side padding; Card/FeatureCard margin themselves gutter, loose content in `Inset`. Buttons: one primary per screen, rest secondary. SectionLabel tag above headings. Card entrance respects reduce-motion. Charts via charts.tsx, always with a text summary.
- Comments: explain why, 1 per block, above declarations. Double quotes, semicolons, trailing commas.
- Import order mixed (some files externals first, some @/ first); VS Code organizeImports on save.
- reactCompiler enabled (experiments) — useCallback still used manually.
