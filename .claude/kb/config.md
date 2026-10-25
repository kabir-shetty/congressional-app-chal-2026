# config
Pkg mgr: npm (package-lock.json, no bun.lock) → use npx. main "expo-router/entry".
## deps (key)
expo ^58.0.19 (SDK 58; docs https://docs.expo.dev/versions/v58.0.0/) · react/react-dom 19.3.0 · react-native 0.88.0 · expo-router ~58 (incl. headless `expo-router/ui` tabs) · expo-image · expo-image-picker · expo-image-manipulator ~58.0.15 (callAI image re-encode, no config plugin) · expo-font (useFonts in app/_layout) · @expo-google-fonts/atkinson-hyperlegible · @expo-google-fonts/public-sans ^0.4.2 (PublicSans_700Bold headings) · @react-native-async-storage/async-storage 2.2.0 (theme override `pw.theme`; in Expo Go) · expo-splash-screen (config plugin only) · expo-symbols (Icon) · expo-status-bar · reanimated 4.7.1 · worklets 0.13.0 · gesture-handler · screens · safe-area-context (useSafeAreaInsets in Screen, Home, tab bar) · react-native-web.
Installed but unused in src: @expo/ui, expo-asset, expo-constants, expo-device, expo-glass-effect, expo-linking, expo-system-ui, expo-web-browser, and junk "all", "google-fonts", "ionicons" (see [[issues]]).
dev: typescript ~6.0.3, @types/react, eslint ^9 + eslint-config-expo (eslint.config.js; `npx expo lint` works).
scripts: start/android/ios/web/lint; reset-project → scripts/reset-project.js MISSING.

## app.json
name/slug congressional-app-chal-2026 · scheme congressionalappchal2026 · portrait · userInterfaceStyle automatic · icon assets/images/icon.png · ios.icon assets/expo.icon · android adaptiveIcon bg #FFFFFF + fg/bg/mono pngs, predictiveBackGestureEnabled false · web output static, favicon.
plugins: expo-router; expo-splash-screen{bg #F4F6F9, dark.bg #0F1621 (= bg tokens), image splash-icon.png, w76}; expo-image-picker{photosPermission text}.
experiments: typedRoutes, reactCompiler.

## tsconfig
extends expo/tsconfig.base, strict, paths @/*→src/*, @/assets/*→assets/*.

## assets
images/: icon, splash-icon, favicon, android-icon-*; template leftovers unused: expo-badge*, expo-logo, logo-glow, react-logo*, tutorial-web, tabIcons/{home,explore}(@2x,@3x). expo.icon/ (iOS icon composer).
## other
ios/ android/ gitignored (CNG). .claude/settings.json enables expo plugin. .vscode: fixAll/organizeImports/sortMembers on save. README = stock create-expo-app.

## env
Root `.env.example` → copy to `.env` (gitignored, as is `.env*.local`): `EXPO_PUBLIC_AI_API_URL` (server host + port = server `PORT`, default 8787; LAN IP or public IP, not localhost, on phone), `EXPO_PUBLIC_AI_API_TOKEN` (= server API_TOKEN). Inlined at bundle time; static `process.env.EXPO_PUBLIC_X` only. Not available to EAS Build (gitignored) → EAS env vars needed ([[issues]]).
## server/
Independent Docker build context (`docker build -t porch-watch-ai ./server`). Node 22 Alpine; `npm ci --omit=dev` as root (node_modules root-owned), then USER node; port 8787 (ENV PORT; HEALTHCHECK reads process.env.PORT). Moved off 8080 (taken on user's Docker host). Config via `--env-file server/.env` (template `.env.example`); off-GCP mount ADC JSON read-only + `GOOGLE_APPLICATION_CREDENTIALS` (readable by uid 1000). `.env` ignored. Image build not verified (no docker daemon on dev machine). Own package-lock.json (npm, not expo install).
