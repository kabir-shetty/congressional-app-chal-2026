# ui
Source of truth: `claude-design/` — `Porch Watch.dc.html` (HTML prototype, wins) > `DESIGN.md` (tokens/type/shape/screens) > `SKILL.md` (rules + checklist). Direction: plain, calm, civic; navy base, one color per section (Home navy `accent`, Scam Checker yellow `check` (fill behind dark text only), Spot the Scam teal `quiz`, AI Scams violet `learn`). Red/green/amber (`scam*`/`safe*`/`unsure*`) only for verdicts + quiz feedback. Leaf cards, pill buttons, circles; no uniform rounded rects.
Seniors/a11y (PRODUCT.md): body 20, min 16, touch 56, contrast ≥4.5:1, text label on every control, font scaling on.
Known HTML vs DESIGN.md mismatch: quiz current-pill outline = `accent` (HTML) vs "teal" (DESIGN.md:106); code follows HTML.

## theme/colors.ts
`Palette` keys + light / dark:
bg #F4F6F9/#0F1621 · surface #FFFFFF/#18212F · ink #142033/#EEF2F7 · muted #46536A/#AEB9CA · line #D5DCE6/#2C3747 · lineStrong #8C99AD/#5B687C · soft #E9EDF3/#222C3B · accent #1F3A5F/#9DBCEB · onAccent #FFFFFF/#0F1621 · band #1F3A5F/#1A2B42 · onBand #FFFFFF/#EEF2F7 · onBandMuted #D6E0EE/#C3CEDD · sun #F2C14E/#E8B940 · bandButton #F2C14E/#F2C14E · onBandButton #142033/#0F1621 · logoDot #7FD3CF both · check #F2C14E/#E8B940 · onCheck #142033/#0F1621 · checkSoft #FFF8E3/#241E10 · quiz #1C7472/#7FD3CF · quizTint #D6EFEC/#14302F · learn #77479C/#CDAAEE · learnTint #EEE4F6/#271D35 · scamInk #A12C1C/#F2A595 · scamTint #FBE3DE/#3A1E1A · safeInk #1F6440/#8FD3A8 · safeTint #DDF0E4/#16301F · unsureInk #7A5300/#E8C46E · unsureTint #F7EBCB/#33290F · disabledBg #DCE2EA/#2C3747 · disabledFg #4F5B6E/#AEB9CA.
Exports: `light`, `dark`, `ColorScheme`, `ColorName`, `SchemeContext` (default "light"), `useColors()`, `makeStyles<const T extends Record<string, View|Text|ImageStyle>>(c=>styles)` (both sheets at load; RN 0.88 has no StyleSheet.NamedStyles).

## theme/type.ts
`fonts` heading PublicSans_700Bold · regular AtkinsonHyperlegible_400Regular · bold AtkinsonHyperlegible_700Bold.
`typography` (size/lineHeight): display 51/56 H · title 32/37 H · resultTitle 30/35 H · homeTitle 29/33 H · statusTitle 29/35 H · feedbackTitle 24/29 H · heading 22/27 H · subheading 21/26 H · body 20/29 · bodyStrong 20/28 b · callout 18/26 · calloutStrong 18/24 b · small 16/24 · smallStrong 16/22 b · wordmark 16/22 b ls1.28 upper · label 17/22 b ls0.7 upper. (H = Public Sans.) `TypographyVariant`.

## theme/shape.ts
`gutter` 22 · `leaf` {TL28 TR28 BR28 BL8} · `pill` 999 · `minTouchTarget` 56 · `pressedOpacity` 0.6 · `shadows` (boxShadow strings) button "0px 6px 16px rgba(20,32,51,0.18)", bandButton "0px 8px 20px rgba(0,0,0,0.22)", chip "0px 4px 12px rgba(0,0,0,0.18)".

## theme/theme-provider.tsx
`ThemeProvider` + `useTheme()` {colors, isDark, toggle, loaded}. scheme = override ?? useColorScheme() (live). Override read once from AsyncStorage key `pw.theme` ("light"|"dark"), errors → console.warn + follow phone; `loaded` true after read. toggle sets + saves opposite. Root returns null until loaded (see [[arch]]). Provides `SchemeContext`.

## components (named exports)
- `AppText({variant?="body", tone?="ink"})` tones ink muted accent onBand onBandMuted quiz learn scamInk safeInk unsureInk.
- `PillButton({title,onPress,variant,size?="medium",disabled?,style?:StyleProp<ViewStyle>,accessibilityHint?})` role button. variants: check (check bg, onCheck, shadow button) · band (bandButton, onBandButton, shadow bandButton) · quiz (quiz bg, onAccent, shadow) · quizOutline (surface bg, 2 quiz border) · quizGhost (transparent, 2 quiz border) · outline (checkSoft bg, 2 ink border). sizes minH large 64 / medium 60 / small 56; label 22 / 20 / 18 Atkinson bold. disabled → disabledBg/Fg, no shadow, no press dim. pressed opacity 0.6.
- `LeafCard({fill?="surface", border?: ColorName}&ViewProps)` leaf radius; border 2 when set; caller sets padding/gap.
- `VerdictPanel({verdict,action,sure})` fill verdict tint, padding 24/22 gap 12: 16 dot (ink) + label variant, resultTitle headline (header), bodyStrong action, callout "How sure: " + calloutStrong sure. `verdictStyle: Record<ScamVerdict,{label,headline,ink,tint}>` likely_scam "Likely a scam"/"This looks like a scam." · likely_safe "Likely not a scam"/"This looks like a normal message." · uncertain "Can't tell"/"We can't tell from this message alone.".
- `StepList({steps})` role list; 34 circle check bg + onCheck number (hidden from a11y), text a11y "Step N: …"; gap 12/14.
- `ScreenHeader({title,subtitle?})` title (header) + muted body, gap 8.
- `ThemeButton` Home band only: surface pill minH 56 px20 shadow chip; Icon moon/sun 22 + "Dark"/"Light" (opposite mode); a11y "Switch to dark/light mode".
- `Screen({children, edgeToEdge?, scrollKey?})` bg; not edgeToEdge → paddingTop safe top + content padding 16/22/32 gap 20; edgeToEdge → none (Home band handles inset). Scroll to top on focus (useFocusEffect) + when scrollKey changes. keyboardShouldPersistTaps handled; no web scroll indicator.
- motion.tsx: `FadeIn({style?})` entering FadeInDown 300ms from translateY 8 (reanimated skips w/ Reduce Motion). `PulseDots({color})` 3×18 dots, scale .6→1 + opacity .35→1, 600ms repeat reverse, 200ms stagger; static when useReducedMotion; hidden from a11y.
- `Icon({name,color,size?=24})` expo-symbols; keys home (house.fill/home), search (magnifyingglass/search), quiz (questionmark.circle.fill/help), sparkles (sparkles/auto_awesome) = tab icons; shield (checkmark.shield.fill/verified_user), moon, sun. Ionicons not used (@expo/vector-icons slated for deprecation per Expo docs).
