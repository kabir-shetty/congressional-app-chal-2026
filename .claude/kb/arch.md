# arch
## Nav (expo-router, typedRoutes on → Href checked at build)
- app/_layout.tsx: `<Stack>` w/ Screen "index"(headerShown:false — no such route at root, see [[issues]]) + "(tabs)"(headerShown:false; tabs render own header).
  - `SplashScreen.preventAutoHideAsync()` at module scope; `useFonts({Arvo_700Bold, PublicSans_400Regular, PublicSans_600SemiBold})`; hideAsync when loaded||error; returns null until then.
- app/(tabs)/_layout.tsx: `<Tabs>` screens in order index"Home", check"Scam Checker", quiz"Spot the Scam", ai-scams"AI Scams". No tabBarIcon set (labels only). screenOptions: active tint primary, inactive secondary, tabBar bg background/borderTop border 1/h72/pt8, label bodyMedium caption, header bg background, title display font fontSize.header text color, headerShadowVisible false.
- Routes: `/`, `/check`, `/quiz`, `/ai-scams`.

## State pattern
Screen → custom hook (hooks/*) owning `status` union + async stub fn in same file. Hook returns `{...state, actions}`; actions wrapped in useCallback; error msg = `error instanceof Error ? error.message : "Something went wrong."`. Detail: [[data]].

## Conventions
- Styles: `StyleSheet.create` at file bottom, values only from theme tokens ([[ui]]). Inline style only for dynamic values.
- Text: always BodyText/HeadingText, never raw Text (except inside buttons). Buttons: AppButton, not RN Button.
- Recurring idioms: `intro` view (HeadingText title fontSize.title + BodyText subtitle color secondary); `startAction` {alignSelf:"flex-start"} wraps buttons; "spine" = borderTop 2 primary (notices/topics) or borderLeft 4 colored (results).
- Comments: explain why, 1 per block, above declarations. Double quotes, semicolons, trailing commas.
- Import order mixed (some files externals first, some @/ first); VS Code organizeImports on save.
- reactCompiler enabled (experiments) — useCallback still used manually.
