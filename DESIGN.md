---
name: Porch Watch
description: Know the signs before they reach your door.
colors:
  primary: "#0B6E64"
  on-primary: "#FFFFFF"
  header: "#0B6E64"
  on-header: "#FFFFFF"
  on-header-muted: "#D3ECE8"
  background: "#F4F8F7"
  surface: "#FFFFFF"
  surface-tint: "#E3F0ED"
  text: "#1F2328"
  text-muted: "#4F5B66"
  border: "#D7E4E1"
  border-strong: "#7C8C89"
  danger: "#B42318"
  danger-tint: "#FDECEA"
  warning: "#8A5300"
  warning-tint: "#FFF3D6"
  success: "#1E6B3A"
  success-tint: "#E5F3E9"
  on-status: "#FFFFFF"
  primary-dark: "#5CC4B6"
  on-primary-dark: "#062320"
  header-dark: "#0B4F48"
  on-header-dark: "#FFFFFF"
  on-header-muted-dark: "#BFE0DB"
  background-dark: "#0E1615"
  surface-dark: "#17211F"
  surface-tint-dark: "#1F302D"
  text-dark: "#E8EEED"
  text-muted-dark: "#A9B7B4"
  border-dark: "#2A3835"
  border-strong-dark: "#71837F"
  danger-dark: "#FF8A7A"
  danger-tint-dark: "#3A1714"
  warning-dark: "#F2C14E"
  warning-tint-dark: "#33280C"
  success-dark: "#6FD58F"
  success-tint-dark: "#12301D"
  on-status-dark: "#121212"
typography:
  largeTitle:
    fontFamily: "-apple-system, Roboto, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: "38px"
  title:
    fontFamily: "-apple-system, Roboto, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: "32px"
  headline:
    fontFamily: "-apple-system, Roboto, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "28px"
  body:
    fontFamily: "-apple-system, Roboto, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "28px"
  bodyStrong:
    fontFamily: "-apple-system, Roboto, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
  callout:
    fontFamily: "-apple-system, Roboto, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "25px"
  label:
    fontFamily: "-apple-system, Roboto, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "20px"
    letterSpacing: "0.8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-filled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.bodyStrong}"
    padding: "8px 24px"
    height: "56px"
  button-tonal:
    backgroundColor: "{colors.surface-tint}"
    textColor: "{colors.primary}"
    typography: "{typography.bodyStrong}"
    padding: "8px 24px"
    height: "56px"
  button-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    typography: "{typography.bodyStrong}"
    padding: "8px 24px"
    height: "56px"
  card:
    backgroundColor: "{colors.surface}"
    padding: "24px 16px"
    width: "100%"
  instruction-strip-band-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-status}"
    typography: "{typography.label}"
    padding: "8px 16px"
  instruction-strip-body-danger:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    padding: "16px"
  instruction-strip-band-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.on-status}"
  instruction-strip-body-warning:
    backgroundColor: "{colors.warning-tint}"
    textColor: "{colors.text}"
  instruction-strip-band-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-status}"
  instruction-strip-body-success:
    backgroundColor: "{colors.success-tint}"
    textColor: "{colors.text}"
  input-message:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    padding: "16px"
    height: "160px"
  list-group:
    backgroundColor: "{colors.surface}"
    width: "100%"
  list-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.bodyStrong}"
    padding: "16px"
    height: "72px"
  list-row-pressed:
    backgroundColor: "{colors.surface-tint}"
  app-bar:
    backgroundColor: "{colors.header}"
    textColor: "{colors.on-header}"
    typography: "{typography.headline}"
  tab-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    height: "68px"
  tab-bar-active:
    textColor: "{colors.primary}"
---

# Design System: Porch Watch

## Overview

**Creative North Star: "The Friendly Neighborhood Pharmacist"**

Kind, expert, calm. The app looks like a well-run pharmacy counter: a deep green-teal shell, a cool white-green ground, and plain white sections that run edge to edge, ruled above and below by hairlines. Every corner is square. Nothing is decorated; everything is labeled. Every answer ends in a plain instruction, and the instruction is always presented the same way, as a pharmacy-style label with a colored "WHAT TO DO" band over one sentence.

Density is low and type is large, because the reader is a senior who may be stressed, may have low vision, and may tap with a tremor. Sizes are in points and scale with the phone's text-size setting; nothing drops below 16. The world follows the phone into light or dark, and both schemes are first-class: every text color clears 4.5:1 on the surfaces it sits on. The visual rejections are confirmed by the direction: not the shield-and-navy security app, and not the cream-and-serif "cozy" app.

The platform is adaptive. Fonts are the platform's own (SF on iOS, Roboto on Android), icons are SF Symbols on iOS and Material Symbols elsewhere, and navigation is the native bottom tab bar with each platform's own selected-state idiom.

**Key Characteristics:**
- Teal shell, cool white-green ground, full-width white sections ruled by hairlines, no shadows.
- Square everywhere: no corner radius except the Android tab-indicator pill.
- Senior type scale: body 20, headings 22 to 32 at heavy weights, floor 16.
- Touch targets at least 56 tall; every control carries a text label.
- Red, amber, and green speak only inside instruction strips and verdicts.
- One signature component: the instruction strip.

## Colors

A single green-teal voice over cool neutrals, with three status hues held in reserve for verdicts. Each role has a light and a dark value (dark keys carry the `-dark` suffix); `useColors()` and `makeStyles()` pick the scheme from `SchemeContext`.

### Primary
- **Pharmacy Teal** (`primary`; `primary-dark` in dark): filled buttons, the active tab tint, tonal-button labels, text-field selection, the quiz meter fill. In dark it lifts to a bright mint-teal and its foreground (`on-primary-dark`) flips to near-black.
- **Counter Teal Band** (`header`; `header-dark`): the app bar on Checker, Quiz, and AI Scams, and the taller welcome band on Home. Same hue as primary in light; a deeper, quieter teal in dark so the band never glows. Text on it is `on-header`, secondary lines `on-header-muted`.

### Tertiary (status, reserved)
- **Prescription Red** (`danger` / `danger-tint`): "likely scam" verdict strip and the "Stop if you see" red-flag strip.
- **Caution Amber** (`warning` / `warning-tint`): "hard to say" verdicts, quiz load errors, and the Home "Before you reply" rule.
- **Safe Green** (`success` / `success-tint`): "likely safe" verdicts and the per-topic advice strips on AI Scams.
- **On-status** (`on-status`): the label text on a solid status band (white in light, near-black in dark against the lighter dark-scheme bands).

### Neutral
- **Cool Ground** (`background`): the screen ground behind everything, also the inset well of the message field and quiz message.
- **Clean White Panel** (`surface`): full-width sections (cards, grouped lists, the AI Scams article), the tab bar.
- **Mint Wash** (`surface-tint`): tonal-button fill, list-row press, the Android tab indicator pill, the meter track.
- **Ink** (`text`) and **Slate** (`text-muted`): body and secondary text; muted also marks inactive tabs, placeholders, chevrons, and disabled labels.
- **Hairline** (`border`): the top and bottom rules of sections, separators, the tab-bar top rule, the disabled-button outline. Decorative only; never the sole boundary of an input.
- **Field Edge** (`border-strong`): the 2px stroke around text inputs; at least 3:1 against its ground.

### Named Rules
**The Verdict-Only Color Rule.** Red, amber, and green appear only inside an instruction strip or as verdict text. They never tint a card, a button, an icon, or a heading on their own.

**The Words-First Rule.** Color repeats what the words say, never replaces them. A strip always carries its label text; a verdict always carries its sentence.

**The Two-Scheme Rule.** Every new color is added to both `light` and `dark` in `Palette`, and every text pairing is checked at 4.5:1 in both.

## Typography

**Display Font:** Platform system face (SF Pro on iOS, Roboto on Android)
**Body Font:** Same system face
**Label Font:** Same system face, uppercase and tracked

**Character:** One family, carried by weight rather than by contrast of faces. Heavy headings (700 to 800) give the voice its confidence; regular 20pt body keeps it calm and readable.

### Hierarchy
- **largeTitle** (800, 32/38): the Home welcome line in the teal band only.
- **title** (700, 26/32): the question-style heading at the top of each tab (`ScreenIntro`) and the verdict heading.
- **headline** (700, 22/28): section headings inside cards and articles; the app-bar title.
- **body** (400, 20/28): all reading text, message text, strip sentences, the text field.
- **bodyStrong** (600, 20/28): button labels, list-row titles, small in-card labels such as "The message".
- **callout** (400, 18/25): secondary lines: list-row details, confidence, helper text, the Home tagline.
- **label** (700, 16/20, 0.8 tracking, uppercase): the instruction-strip band and nowhere else.

The tab-bar label is a fixed 16 at weight 600 and does not scale with system text size, matching native tab bars; the screens themselves do scale.

### Named Rules
**The Sixteen Floor Rule.** No text below 16. Body is 20.

**The One Text Component Rule.** All text goes through `AppText` with a `variant` from the scale and a `tone` from the palette; no ad-hoc font sizes in screens.

**The Band-Only Label Rule.** The uppercase `label` style names an instruction strip. It is never placed above a heading as an eyebrow or kicker.

## Layout

A single scrolling column per tab inside `Screen`. The ground fills the view; the content column has no side padding, 16 at the top, 32 at the bottom, and blocks stack with a 24 gap. A full-bleed header band (Home's welcome band) may sit above the content and scrolls with it, so a tall header never squeezes content at large text sizes.

Sections are full-bleed: a Card, a grouped list, or the AI Scams article touches both screen edges and carries its own 16 side padding inside. Between sections the cool ground shows as a 24 band, so the screen reads as a stack of ruled white sheets rather than floating panels.

Spacing follows a 4-based scale (`xs` 4, `sm` 8, `md` 16, `lg` 24, `xl` 32). Inside a section, children stack at 16 with 24 above and below and 16 at the sides. A heading and its one-line subtitle sit 4 apart. Answer buttons that a shaky tap could confuse are separated by 24 rather than the usual 8 to 16.

Full-width buttons (`align="stretch"`) carry the screen's main action and binary answers; hugging buttons sit at the leading edge (`align="start"`, default) for secondary in-section actions, or centered (`align="center"`) where the user asked (the checker's "Add a screenshot"). The tab bar is 68 plus the bottom safe-area inset.

### Named Rules
**The Edge-to-Edge Section Rule.** Containers span the full screen width and are ruled by a 1px hairline above and below, never on the sides. Their content keeps the `gutter` side margin (16, `gutter` in theme.ts) from within.

**The Inset Rule.** Anything placed directly in the screen column that is not a section (progress rows, button rows between sections, status lines, notes) is wrapped in `Inset` (`gutter` side padding). `ScreenIntro` renders inside an `Inset`.

**The Strip Bleed Rule.** An instruction strip placed inside a 16-padded section takes `bleed` (a negative `gutter` side margin) so its band and tint run to both screen edges, matching the section's own width; the strip's own side padding is also `gutter`, so its text lines up with the section text above. Horizontal scrollers inside a section (checker thumbnails) bleed the same way.

## Elevation & Depth

Flat. There are no shadows anywhere, including the app bar (`headerShadowVisible: false`). Depth is tonal: cool ground, white full-width sections separated from it by 1px hairlines above and below, and inset wells (message field, quiz message) that drop back to the ground color inside a white card.

### Named Rules
**The Hairline-Not-Shadow Rule.** A container is distinguished by 1px `border` rules and a surface change, never by a shadow or elevation.

## Shapes

Square, everywhere. There is no corner radius and no radius token: sections, buttons, the text input, thumbnails, inset wells, instruction strips, and the meter all have square corners. The modern read comes from full-width rectangles and hairline rules, not from soft edges. Section borders are 1px hairlines on the top and bottom only; the text input takes a 2px stroke on all four sides, thumbnails a 1px hairline, and the disabled button a 2px hairline outline. No colored side borders.

The single exception is the Android-only Material tab indicator, a 64x32 pill (radius 16) behind the active tab icon. It is the platform's own convention and is not a shape to reuse elsewhere.

### Named Rules
**The Square Corner Rule.** New surfaces and controls take no border radius. Two exceptions only: the Android tab pill (inside the tab bar), and the checker's "Add a screenshot" tonal button, a squircle by user request (`rounded`: radius 16 with iOS `borderCurve: "continuous"`; plain rounded on Android). Don't extend `rounded` to other controls without a request.

## Components

### Buttons
Large, labeled, and unmistakable.
- **Shape:** square corners (except the `rounded` squircle; see the Square Corner Rule), at least 56 tall, 24 horizontal padding, optional 24 icon leading the label at 8 gap. With an icon the leading padding drops to 21 (24 minus the ~3 of whitespace a glyph carries inside its 24 box, measured), so the gap before the icon equals the gap after the label.
- **Filled:** primary background, on-primary label in bodyStrong. The one main action on a screen ("Check for Scam", "Start quiz").
- **Tonal:** mint-wash background, teal label. Everything else, including quiz answers and "Check another".
- **Pressed:** opacity drops to 0.75.
- **Disabled:** its own look, transparent with a 2px hairline outline and muted label, so it never reads as available or as a secondary action.
- An icon never appears without its text label.

### Cards / Containers
- **Corner Style:** square; the card is a full-width section touching both screen edges.
- **Background:** surface, with 1px `border` hairlines on the top and bottom edges only.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Internal Padding:** 24 above and below, 16 at the sides; children stacked at 16.
- Cards group a heading, its copy, and its actions. Cards are never nested. A long-form article (AI Scams) uses the same full-width surface and top/bottom hairlines, its topics each padded 24 by 16 and divided by edge-to-edge 1px top rules; the article's closing section is a Card.

### Inputs / Fields
- **Style:** inset to the ground color inside a white card, 2px `border-strong` stroke, square corners, 16 padding, body type, minimum 160 tall for the message field.
- **Placeholder / Selection:** placeholder in text-muted; selection and caret in primary.
- A visible text label ("The message") sits above the field.

### Navigation
- **App bar:** teal `header` band, headline-weight title in on-header, no shadow. Home replaces it with its own taller band carrying the largeTitle welcome and the tagline.
- **Tab bar:** surface background, 1px top hairline, 26 icons with 16/600 labels; active tint primary, inactive text-muted. On Android the active icon sits in a 64x32 mint-wash pill; iOS uses tint alone.

### Grouped List
Full-width grouped list for a short set of destinations, ruled like a Card section: surface, square, 1px hairlines on the top and bottom edges only. Rows are at least 72 tall (56 + 16) with 16 padding, a bodyStrong title over a callout detail, and a muted trailing chevron. Separators are 1px hairlines inset 16 from the leading edge. Pressed rows fill with mint wash edge to edge.

### Meter
Quiz progress: 8 tall track in mint wash, primary fill, square ends. The value is always also written out in nearby text.

### Instruction Strip (signature)
A pharmacy-label panel and the app's one recurring signature. A solid status-colored band carries a short `label` naming the panel ("WHAT TO DO" by default; screens also use labels such as "Stop if you see", "This was a scam", or a connection-error label) in on-status, padded 8 by 16. Below it, the matching tint holds the plain-language content in body type, usually one imperative sentence, padded 16. Square corners. Inside a 16-padded section it takes `bleed` so it spans the full screen width (see the Strip Bleed Rule). Used for verdicts, quiz feedback, red flags, connection errors, and per-topic advice. Tone is `danger`, `warning`, or `success`, chosen by meaning, never by decoration.

## Do's and Don'ts

### Do:
- **Do** take every color from `useColors()` or `makeStyles()`, and define new roles in both light and dark.
- **Do** end every answer with an instruction strip holding one plain imperative sentence.
- **Do** keep controls at least 56 tall (`minTouchTarget`) with a visible text label.
- **Do** use `AppText` variants for all text; body at 20, nothing below 16.
- **Do** build containers as full-width `surface` sections ruled by 1px `border` hairlines above and below, with square corners.
- **Do** wrap loose content between sections in `Inset`, and give a strip inside a padded section `bleed`.
- **Do** keep one filled button per screen; use tonal for the rest.

### Don't:
- **Don't** add shadows or elevation to cards, bars, or buttons.
- **Don't** use red, amber, or green outside instruction strips and verdict text.
- **Don't** put an uppercase label above a heading as an eyebrow or kicker; the `label` style belongs to the strip band.
- **Don't** add colored side borders to cards or strips.
- **Don't** round corners on any surface or control; the Android tab pill and the "Add a screenshot" squircle are the only radii.
- **Don't** float a section with side margins or side borders; sections touch both screen edges.
- **Don't** ship an icon-only control.
- **Don't** nest cards.
- **Don't** use `border` (the decorative hairline) as the only edge of an input; inputs take `border-strong` at 2px.
