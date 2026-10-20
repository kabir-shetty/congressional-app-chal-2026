# ui
Direction "The Pharmacist" (impeccable; contract `.impeccable/surfaces/src-app-tabs-index-tsx.md`, system doc `DESIGN.md`): kind/expert/calm; teal shell, cool white-green ground, white hairline cards (no shadows), system fonts (SF/Roboto, follow OS text size), status hues only in instruction strips/verdicts. Light + dark follow phone. Craft bans: eyebrows/kickers, colored side borders, matching icon-card grids, nested cards.

## constants/theme.ts
`Palette` keys: background surface surfaceTint text textMuted border(decorative) borderStrong(≥3:1) primary onPrimary header onHeader onHeaderMuted danger dangerTint warning warningTint success successTint onStatus.
light: bg #F4F8F7 surface #FFF tint #E3F0ED text #1F2328 muted #4F5B66 border #D7E4E1 borderStrong #7C8C89 primary/header #0B6E64 onPrimary/onHeader #FFF onHeaderMuted #D3ECE8 danger #B42318/#FDECEA warning #8A5300/#FFF3D6 success #1E6B3A/#E5F3E9 onStatus #FFF.
dark: bg #0E1615 surface #17211F tint #1F302D text #E8EEED muted #A9B7B4 border #2A3835 borderStrong #71837F primary #5CC4B6 onPrimary #062320 header #0B4F48 onHeader #FFF onHeaderMuted #BFE0DB danger #FF8A7A/#3A1714 warning #F2C14E/#33280C success #6FD58F/#12301D onStatus #121212.
All text pairs ≥4.5:1 both schemes (verified).
- `ColorScheme` "light"|"dark"; `SchemeContext` (createContext "light"); `useColors()` → Palette via context.
- `makeStyles(factory(c) => styles)` → hook; both schemes' StyleSheets built at module load, hook picks via context. Pattern: `const useStyles = makeStyles((c) => ({...}))` at file bottom, `const styles = useStyles()` in component.
- spacing xs4 sm8 md16 lg24 xl32 · `typography` (TextStyle presets, `TypographyVariant`): largeTitle 32/38/800 · title 26/32/700 · headline 22/28/700 · body 20/28/400 · bodyStrong 20/28/600 · callout 18/25 · label 16/20/700 +0.8 uppercase · radius {control 12, card 16} · minTouchTarget 56.

## components (named exports)
- `SchemeProvider` (scheme-provider.tsx): provides useColorScheme → SchemeContext; on web holds "light" until mounted (static prerender hydration mismatch), native immediate. Wraps root Stack.
- `AppText({variant?="body", tone?="text"} & TextProps)` only text component; tones text textMuted primary danger warning success onHeader onHeaderMuted onStatus (precomputed tone styles). Raw Text only inside AppButton.
- `AppButton({title,onPress,disabled?,variant?="filled"|"tonal",icon?,fullWidth?})` role button+state; minHeight 56, radius control, row gap sm, borderWidth 2 transparent (reserved); hug (flex-start) unless fullWidth; filled bg primary/onPrimary, tonal bg surfaceTint/primary; disabled = transparent bg + borderColor border, textMuted (no opacity); pressed .75. Icon 24.
- `Card(ViewProps)` gap md p lg surface, border 1 border, radius card. Never nest.
- `InstructionStrip({tone:"danger"|"warning"|"success", label?="What to do", children:string})` SIGNATURE: solid status band (label variant, onStatus) over tinted body (body text). Export `StatusTone`.
- `ListGroup({children})` inset grouped list (surface, border, radius card, hairline separators inset md). `ListRow({href,title,detail})` Link asChild Pressable role link; bodyStrong title + callout muted detail + chevron; pressed bg surfaceTint; minHeight 72.
- `Meter({value 0-1, label})` 8px track surfaceTint, fill primary; role progressbar.
- `Screen({header?, children})` ScrollView bg background, keyboardShouldPersistTaps handled, web hides scroll indicator; `header` renders full-bleed above inner content View (p md, pb xl, gap lg).
- `ScreenIntro({title,subtitle})` title variant (role header) + muted body; gap xs.
- `Icon({name, color (required), size?=24})` SymbolView map (ios SF / android+web Material), a11y-hidden. Keys: home search quiz sparkles addPhoto check chevron arrow refresh play flag.
