# arch
## Nav (expo-router, typedRoutes on → Href checked at build)
- app/_layout.tsx: useFonts (PublicSans_700Bold, Atkinson 400/700) → `<ThemeProvider>` > `AppShell({fontsReady})`: ready = fontsReady(loaded||error) && theme `loaded`; SplashScreen held until ready, null before. Renders `SchemeStatusBar` (usePathname: "/" → "light" (navy band), else isDark ? light : dark; own component so routes don't re-render Stack) + `<Stack>` Screen "(tabs)" headerShown false.
- app/(tabs)/_layout.tsx: headless `expo-router/ui` `<Tabs style bg>` > `<TabSlot/>` + `<TabList accessibilityRole="tablist">` of `TabTrigger name href asChild` > `TabButton` (Pressable role tab, selected state; drops TabTrigger's View-typed ref/style). `TABS` {name,href,label,color,onColor}. Spec in [[screens]].
- Routes: `/`, `/check`, `/quiz`, `/ai-scams` (`?topic=` voice|photos|writing|signs).

## State pattern
State local to each screen (no hooks/ dir): status/stage union + async fn calling `callAI`; actions in useCallback; error msg = `error instanceof Error ? error.message : "Something went wrong."`. Detail: [[data]].

## Conventions
- Follow claude-design/SKILL.md rules: tokens only (no raw hex in screens), pills for buttons, leaf for cards, pressed opacity 0.6 (except disabled), section colors, verdict colors reserved, icons beside text or hidden, sentence-case labels ("Check for Scam" keeps casing), confidence in words never %, no accuracy claims / testimonials / accounts / payments / privacy statement.
- Styles: themed → `const useStyles = makeStyles((c) => ({...}))` at file bottom; scheme-independent → `StyleSheet.create` (often `layout`); never import raw palettes in screens (useColors/makeStyles). Inline style only for dynamic values. Shadows via `boxShadow` strings from shape.ts.
- Text: always `AppText` (variant + tone) except inside PillButton/ThemeButton/tab labels/StepList numbers. Headings role header. Results announced via `AccessibilityInfo.announceForAccessibility`.
- Layout: `Screen` pads gutter (except edgeToEdge Home); stage content wrapped in `FadeIn` with own gap; `scrollKey` per stage.
- Comments: explain why, 1 per block, above declarations. Double quotes, semicolons, trailing commas.
- Import order mixed; VS Code organizeImports on save.
- reactCompiler enabled (experiments) — useCallback still used manually.
