# config
Pkg mgr: npm (package-lock.json, no bun.lock) → use npx. main "expo-router/entry".
## deps (key)
expo ~57.0.26 · react/react-dom 19.2.3 · react-native 0.86.3 · expo-router ~57 · expo-image · expo-image-picker · expo-image-manipulator ~57.0.21 (callAI image re-encode, no config plugin) · expo-font (useFonts in app/_layout) · @expo-google-fonts/atkinson-hyperlegible · expo-splash-screen (config plugin only) · expo-symbols (Icon; SymbolView beta, SF/Material) · expo-status-bar · reanimated 4.5.1 · worklets 0.10.1 · gesture-handler · screens · safe-area-context (useSafeAreaInsets in tabs, SafeAreaView on Home) · react-native-web.
Installed but unused in src: @expo/ui, expo-asset, expo-constants, expo-device, expo-glass-effect, expo-linking, expo-system-ui, expo-web-browser, and junk "all", "google-fonts", "ionicons" (see [[issues]]).
dev: typescript ~6.0.3, @types/react, eslint ^9 + eslint-config-expo (eslint.config.js; `npx expo lint` works).
scripts: start/android/ios/web/lint; reset-project → scripts/reset-project.js MISSING.

## app.json
name/slug congressional-app-chal-2026 · scheme congressionalappchal2026 · portrait · userInterfaceStyle automatic · icon assets/images/icon.png · ios.icon assets/expo.icon · android adaptiveIcon bg #FFFFFF + fg/bg/mono pngs, predictiveBackGestureEnabled false · web output static, favicon.
plugins: expo-router; expo-splash-screen{bg #FFFFFF, dark.bg #0B1626, image splash-icon.png, w76}; expo-image-picker{photosPermission text}.
experiments: typedRoutes, reactCompiler.

## tsconfig
extends expo/tsconfig.base, strict, paths @/*→src/*, @/assets/*→assets/*.

## assets
images/: icon, splash-icon, favicon, android-icon-*; template leftovers unused: expo-badge*, expo-logo, logo-glow, react-logo*, tutorial-web, tabIcons/{home,explore}(@2x,@3x). expo.icon/ (iOS icon composer).
## other
ios/ android/ gitignored (CNG). .claude/settings.json enables expo plugin. .vscode: fixAll/organizeImports/sortMembers on save. README = stock create-expo-app.

## env
Root `.env.example` → copy to `.env.local` (gitignored `.env*.local`): `EXPO_PUBLIC_AI_API_URL` (LAN IP, not localhost, on phone), `EXPO_PUBLIC_AI_API_TOKEN` (= server API_TOKEN). Inlined at bundle time; static `process.env.EXPO_PUBLIC_X` only.
## server/
Independent Docker build context for Gemini API (`docker build -t porch-watch-ai ./server`). Node 22 Alpine, port 8080, non-root. Secrets via runtime env/`--env-file`; `.env` ignored.
