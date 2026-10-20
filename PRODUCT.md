# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Primary: older adults (seniors) who receive texts, calls, emails, and social messages and are targeted by scams, including AI-powered ones. Two equally primary situations:

- **In the moment:** a suspicious message has just arrived; they open the app to check it before replying, clicking, or paying.
- **Learning ahead:** a calm moment; they practice spotting scams and read how AI has changed them, so they're ready when one arrives.

Secondary: Congressional App Challenge 2026 judges evaluating the app. The app must demo clearly and quickly to them.

## Product Purpose

Porch Watch helps seniors recognize scams, especially AI-powered ones (cloned voices, fabricated photos/video, fluent AI-written messages), before they lose money or information. Success: a senior can get a plain-language answer about a specific message, and over time recognizes the warning signs on their own.

## Positioning

Built for seniors specifically, and for the AI era specifically: it pairs an on-demand checker for a real message with practice and plain explanation, so the user builds lasting judgment rather than only getting a one-off verdict. Tone is a neighbor looking out for you ("Know the signs before they reach your door"), not a security product.

## Operating Context

- Used on the senior's own phone (iOS and Android), often right after receiving a message in another app; content arrives by pasting text or attaching screenshots from the photo library.
- Sessions are short and possibly stressful (in the moment) or relaxed and repeated (learning ahead).
- Judges see it in a demo setting.

## Capabilities and Constraints

- Four tabs: Home; Scam Checker (paste text and/or screenshots → verdict likely scam / likely safe / uncertain, confidence, plain explanation); Spot the Scam quiz (5 AI-generated messages, scam vs. not, explanation after each guess, score); AI Scams (static explainer of AI scam types and lasting red flags).
- AI answers come from a Gemini-backed server (`server/`); the app's `callAI` connection is not wired yet. Quiz items are text-only for now; image items are planned from a hand-made/licensed set.
- Expo SDK 57 / React Native, Expo Router; one codebase for iOS, Android (and web as a by-product).
- **No accounts or sign-in.**
- **Free, no ads, no payments or upsells.**
- **Privacy promise:** pasted messages and screenshots are used only to perform the check and are not stored or shared. (Commitment; server behavior must be verified to match before it's stated in the UI.)
- Terminology in UI: "scam", "not a scam", "Check for Scam", "Spot the Scam", "AI Scams". Button labels are sentence case ("It's not a scam", "Try again"); "Check for Scam" keeps its casing.

## Brand Commitments

- Name: **Porch Watch**. Tagline: "Know the signs before they reach your door."
- Voice: plain, warm, short sentences, no jargon; never alarmist or condescending; explanations describe the signs rather than lecture.

## Evidence on Hand

- Real copy: AI Scams topics (voice cloning, fake photos/videos, fluent AI writing, red flags: urgency, secrecy, gift card/wire/crypto) in `src/app/(tabs)/ai-scams.tsx`.
- No user testimonials, usage data, partnerships, endorsements, or accuracy benchmarks exist. Do not fabricate them, and do not claim a detection accuracy.

## Product Principles

1. Plain answers first: every result states what it is and what to do, in everyday words.
2. Build judgment, not dependence: explanations teach the sign so the user needs the app less over time.
3. Calm under pressure: in-the-moment use must slow the user down and reassure, never panic them.
4. Nothing asked of the user beyond the message: no accounts, no personal data, no cost.
5. Honest about uncertainty: "can't tell" is a valid answer, and the app never overstates its confidence.

## Accessibility & Inclusion

Audience is seniors: large type (body 20pt, nothing below 16pt), touch targets ≥56pt, text contrast ≥4.5:1, text labels on every control (icons never alone), screen reader support (headings, announced results). Must respect system font scaling and assume possible low vision, tremor, and low tech confidence.
