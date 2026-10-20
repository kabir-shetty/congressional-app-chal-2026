---
version: 1
slug: "src-app-tabs-index-tsx"
primary_target: "src/app/(tabs)/index.tsx"
related_targets: ["src/app/(tabs)/check.tsx","src/app/(tabs)/quiz.tsx","src/app/(tabs)/ai-scams.tsx","src/app/(tabs)/_layout.tsx"]
---

# Porch Watch app shell (all four tabs)

Scope: whole app, all tabs + shared components; mode Operate (native, adaptive iOS/Android). Audience: seniors, in-the-moment checking and learning-ahead equally; judges secondary. Constraints: PRODUCT.md (no accounts, free/no ads, privacy promise not yet stated in UI, a11y floor: body 20, nothing <16, targets ≥56, 4.5:1, labels on every control). User asked: professional, open to seniors; less themed, warmer/friendlier; not childish, not techy/cold; light+dark following the phone. Chosen from safer lineup after two re-rolls.

## Direction contract
THESIS: The friendly neighborhood pharmacist: kind, expert, calm. Every answer ends in plain instructions. Refuses both the shield-and-navy security app and the cream-and-serif "cozy" app.
OWN-WORLD: Deep green-teal shell (#0B6E64 light / dark-teal header in dark) over a cool white-green ground; white cards with hairline borders, no shadows; system faces only (SF / Roboto) at senior sizes, heavy weights for headings; status hues (red, amber, green) appear only inside instruction strips and verdicts.
STORY: The user sees they're welcomed, knows the one thing to do (check a message), gets a verdict they can act on, and learns the sign for next time.
FIRST VIEWPORT: Home: teal header band from the status bar down: "Hello. How can we help today?" large, then "Porch Watch · Know the signs before they reach your door." Below (no eyebrow; "Porch Watch" sits in the tagline line): "Check a message" card with full-width filled button; a "Before you reply" card whose WHAT TO DO strip carries the gift-card/wire/crypto rule; a native grouped list linking Spot the Scam and AI Scams. Native tab bar.
FORM: Grounded "The Pharmacist" (my list #3 of the safer lineup; ranking: Morning Light, Ratings Guide, Pharmacist). Signature move: the instruction strip, a pharmacy-label panel: a solid state-colored band reading "WHAT TO DO" over a tinted body holding one plain imperative sentence; used for verdicts, quiz feedback, and red flags. No colored side borders, no eyebrows. seed:951a6db78ab3d587
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
