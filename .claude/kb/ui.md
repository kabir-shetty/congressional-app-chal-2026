# ui
Design concept: "neighborhood watch" — warm paper/ink, amber accent, teal secondary. All colors ≥4.5:1 contrast vs intended bg. Senior-friendly: big text, big targets. Light only (no dark palette despite userInterfaceStyle automatic).

## constants/theme.ts
colors: background #FBF7EF(paper) | surface #F1E8D8(card) | text #2B2420(ink) | border #8C7B63 | primary #9C5518(amber) primaryText #FFF | secondary #1E3A3F(teal) secondaryText #FFF | danger #8F3324 dangerText #FFF | success #355E3B
spacing: sm8 md16 lg24 xl32
fontSize: caption16 body20 button20 header22 title24 display32(home hero only)
fontFamily: display "Arvo_700Bold"(headlines only) | body "PublicSans_400Regular" | bodyMedium "PublicSans_600SemiBold"
radius 12 (number) · minTouchTarget 56

## components (named exports)
- `AppButton({title, onPress, disabled?, variant?="primary"|"secondary"|"danger"})` Pressable; minHeight 56, radius, pxlg, centered; text bodyMedium/button; disabled opacity .5, pressed .8; variantStyles map → bg colors.<v>, text colors.<v>Text.
- `AppLinkButton({href: Href, title})` Link asChild+Pressable, primary look. UNUSED.
- `BodyText(TextProps)` body font/size, text color; style merges after.
- `HeadingText(TextProps)` display font, title size, text color; style merges after.
- `InfoPage({children})` ScrollView contentContainer flexGrow1 p lg gap md bg background.
