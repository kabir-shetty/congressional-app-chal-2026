# Porch Watch — Design

Source of truth: `Porch Watch.dc.html` (HTML prototype). This file translates it for the Expo / React Native app.

## Principles

- Plain, calm, civic. Navy base with one color per section.
- Soft shapes: pills, circles, gentle arches. No standard rounded-rect "squircle" cards.
- Seniors first: body 20pt, nothing below 16pt, touch targets ≥56pt, contrast ≥4.5:1, every control has a text label.
- Color is never the only signal. Verdicts always state the result in words.

## Color tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| bg | #F4F6F9 | #0F1621 | Screen background |
| surface | #FFFFFF | #18212F | Cards, inputs, tab bar |
| ink | #142033 | #EEF2F7 | Primary text |
| muted | #46536A | #AEB9CA | Secondary text |
| line | #D5DCE6 | #2C3747 | Borders, dividers |
| lineStrong | #8C99AD | #5B687C | Input borders |
| soft | #E9EDF3 | #222C3B | Message header strip |
| accent | #1F3A5F | #9DBCEB | Home / general accent (navy) |
| onAccent | #FFFFFF | #0F1621 | Text on accent |
| band | #1F3A5F | #1A2B42 | Home header band |
| onBand | #FFFFFF | #EEF2F7 | Text on band |
| onBandMuted | #D6E0EE | #C3CEDD | Secondary text on band |
| sun | #F2C14E | #E8B940 | Decorative yellow (icons, fills) |
| check | #F2C14E | #E8B940 | Scam Checker buttons (fill only) |
| onCheck | #142033 | #0F1621 | Text on check yellow |
| quiz | #1C7472 | #7FD3CF | Spot the Scam accent (teal) |
| quizTint | #D6EFEC | #14302F | Spot the Scam card background |
| learn | #77479C | #CDAAEE | AI Scams accent (violet) |
| learnTint | #EEE4F6 | #271D35 | AI Scams card background |
| scamInk / scamTint | #A12C1C / #FBE3DE | #F2A595 / #3A1E1A | "Likely a scam" |
| safeInk / safeTint | #1F6440 / #DDF0E4 | #8FD3A8 / #16301F | "Likely not a scam" |
| unsureInk / unsureTint | #7A5300 / #F7EBCB | #E8C46E / #33290F | "Can't tell" |
| disabledBg / disabledFg | #DCE2EA / #4F5B6E | #2C3747 / #AEB9CA | Disabled Check for Scam |

Rules:
- Yellow is a fill behind dark text only. Never yellow text on white.
- Verdict red/green/amber are reserved for results and quiz feedback. Don't use them as decoration.
- Section accents: Home = navy, Scam Checker = yellow, Spot the Scam = teal, AI Scams = violet.

## Typography

- Headings: **Public Sans 700**. Body and buttons: **Atkinson Hyperlegible 400/700** (`@expo-google-fonts/public-sans`, `@expo-google-fonts/atkinson-hyperlegible`).
- Respect system font scaling (`allowFontScaling` stays on).

| Role | Size (pt) | Line height |
|---|---|---|
| Home headline | 29 | 1.15 |
| Screen title (h1) | 32 | 1.15 |
| Result headline | 30 | 1.15 |
| Card / section title | 22 | 1.2 |
| Body | 20 | 1.45 |
| Button | 18–22 | — |
| Small / caption / tab label | 16 | — |

Home headline breaks as: "Know the signs / before they / reach your door."

## Shape

- Buttons: full pill (`borderRadius: 999`).
- Cards and panels: leaf shape, `borderTopLeftRadius: 28, borderTopRightRadius: 28, borderBottomRightRadius: 28, borderBottomLeftRadius: 8`.
- Small markers: circles (step numbers, verdict dot), pills (quiz progress, 16×10).
- Home band: bottom edge is a shallow arch (≈36pt deep). In RN use an SVG path or a wide ellipse under the band.
- Primary button shadow: offset 0/6, blur 16, `rgba(20,32,51,0.18)` (Android `elevation: 4`).

## Interaction

- Every pressable: opacity 0.6 while pressed (`Pressable` style `({pressed}) => ({opacity: pressed ? 0.6 : 1})`), ~100ms.
- Disabled Check for Scam: grey, no press feedback.
- Screen changes scroll to top. Content fades/slides in 8pt over ~300ms; honor Reduce Motion.

## Theme

- Default follows the phone (`useColorScheme`), live.
- One button on the Home band toggles it. It shows the mode you'd switch to: moon icon + "Dark" when light, sunny icon + "Light" when dark. Once tapped, the user's choice overrides the phone setting (persist with AsyncStorage).

## Icons

Ionicons (`@expo/vector-icons/Ionicons`). Always paired with text, except decorative ones (`accessibilityElementsHidden`).
- `shield-checkmark` — Home band, yellow, about 2 headline lines tall, vertically centered on line 2, horizontally centered under the theme button.
- `moon` / `sunny` — theme button, 22pt.

## Screens

**Tab bar** — 4 equal tabs, text labels: Home, Scam Checker, Spot the Scam, AI Scams. Active tab: 5pt pill bar on top in the section color (Scam Checker bar is yellow with ink label), bold label. Min height 68pt.

**Home**
- Navy band (status bar area matches): logo mark + "PORCH WATCH" · theme button; headline + shield; "Got a message that worries you? Check it before you reply, click, or pay."; yellow pill "Check for Scam".
- Card "Spot the Scam" (quizTint, three teal circles mark, "Start practice →").
- Card "How AI changed scams" (learnTint, violet half-circle + circle mark, "Read about AI Scams →").
- Footer: "Free. No sign-in. Nothing to set up."

**Scam Checker** (plain header like the other tabs)
- Title + "Take your time. Paste the message or add a screenshot of it."
- Labeled text area; yellow pill "Add screenshot" (full width); thumbnails with "Remove".
- Yellow pill "Check for Scam" (disabled until text or screenshot).
- "Or try an example" list.
- Checking state: three pulsing yellow dots, "Reading the message…", "While you wait: you don't have to reply to anyone right now." Announce via live region.
- Result: tinted verdict panel (dot + label, headline, bold action line, "How sure: …" in words — never a percentage), "What we noticed" cards, "What to do now" numbered steps (yellow circles), "Check another message", link to matching AI Scams topic, disclaimer line.

**Spot the Scam** (teal)
- "Message N of 5" + 5 pill progress markers (green right / red wrong / teal outline current).
- Message card: soft header strip with type + sender, body.
- "It's a scam" (filled teal) / "It's not a scam" (outlined teal).
- Feedback panel ("You got it." / "Not quite.") + "The sign to remember" + Next / "See my score".
- Score screen: "N of 5", encouraging line, "Try again", "Read about AI Scams".

**AI Scams** (violet)
- Intro line, then expandable sections (Read/Close): Cloned voices, Fake photos and videos, Messages that sound perfect, Signs that never change. Open section gets a violet border.

## Accessibility checklist

- Headings marked (`accessibilityRole="header"`).
- Verdicts and quiz feedback announced (`AccessibilityInfo.announceForAccessibility` or live region).
- Theme button: `accessibilityLabel` "Switch to dark mode" / "Switch to light mode".
- Tabs: `accessibilityRole="tab"`, selected state.
- No claims about accuracy; no privacy statement in UI until the server is verified.
