# ui
Direction "Calm blue": minimal, professional, trust. White + pale blue surfaces, one trust blue for everything interactive/key, navy text, hairline-bordered cards, flat buttons, no shadows/shape art/glow; Atkinson Hyperlegible only. Two minimal charts (one color). Dark = same blue on deep navy. Supersedes Porch geometry / Dark Luxury (`claude-design/`, root DESIGN.md, `.impeccable/` stale).
Seniors/a11y (PRODUCT.md): body 20, min 16, touch 56, text ≥4.5:1 (verified both schemes), icons beside text, charts always described in text.

## constants/theme.ts
`Palette`: background surface card text textMuted border borderStrong(≥3:1 on card) primary onPrimary primaryTint track danger/dangerTint warning/warningTint success/successTint.
light: bg #FFF surface #F3F8FD card #FFF text #0F2744 muted #475A73 border #DCE7F3 borderStrong #7B93B0 primary #1D5FB8 onPrimary #FFF primaryTint #E3EEFB track #DCE7F3 danger #B42318/#FDECEA warning #8A5300/#FFF4DC success #1B7048/#E6F4EC.
dark: bg #0B1626 surface #10203A card #12233C text #EAF1FA muted #A9BBD2 border #223A59 borderStrong #6F89AB primary #74B2F5 onPrimary #08203F primaryTint #1B3556 track #27415F danger #FF8D7B/#3A1D1B warning #F5C25B/#33290F success #5ED69A/#143325.
- `SchemeContext` default "light"; `useColors()`; `makeStyles(c=>styles)` both-scheme sheets at load.
- spacing xs4 sm8 md16 lg24 xl32 xxl48 · `gutter`24 · `radius` sm8 md12 lg16 pill999 · `minTouchTarget`56.
- `fonts` regular AtkinsonHyperlegible_400Regular, bold _700Bold (loaded in app/_layout). `typography`: largeTitle 38/44 bold · title 28/34 · headline 22/28 · body 20/30 · bodyStrong 20/28 bold · callout 18/26 · label 16/20 bold +1 uppercase.

## components (named exports)
- `SchemeProvider`/`useSchemeControl()` {scheme,toggle}: scheme = override ?? system (in-memory, NOT persisted); web holds "light" until mounted.
- `SchemeToggle`: pill (primaryTint bg, height 40 + hitSlop→56) Icon sun/moon + callout "Light"/"Dark" (scale cap 1.3); a11y "Switch to light/dark mode".
- `AppText({variant?="body", tone?})` default tone body/callout→textMuted else text; tones text textMuted primary danger warning success. `Headline({variant?="title"|"largeTitle", lead, accent})` role header; accent in primary. Note: pass tone="text" for primary content text (message, explanation).
- `SectionLabel({children})` label variant primary.
- `AppButton({title,onPress,disabled?,variant?="primary"|"secondary",icon?,align?})` Pressable role button; radius 12, minH 56, border 1.5; primary solid primary/onPrimary; secondary card bg + borderStrong border + primary text; disabled surface bg/border, textMuted; pressed opacity .8; align on the Pressable.
- `Card({index?=0}&ViewProps)` FadeInDown 400ms delay index*80; margin gutter, padding 24, gap 16, radius 16, 1px border, card bg, no shadow. Never nest.
- `FeatureCard({href,icon,title,detail,index?})` Card padding0; link row: 52 primaryTint chip + Icon 26, headline + callout, chevron; pressed bg surface; a11y label "title. detail".
- `Inset` px gutter. `InstructionStrip({tone,label?="What to do",children})` SIGNATURE: tinted panel radius 12, uppercase label in tone color + sentence (text tone). `StatusTone`.
- `ConfidenceBar({value 0-1,label})` (charts.tsx): "{label}: N%" + 12px pill track/fill primary + "Not sure"/"Very sure" ends; accessible label "{label}: N%".
- `StepChart({results:boolean[],total,current:number|null})`: one column per question, height encodes: unanswered 16 (surface, borderStrong outline) < missed 28 (primary outline) < right 48 (solid primary) < current 56 (primaryTint, only while asking); text summary "{right} right[, {missed} missed]" + "{total} questions"; a11y label summary.
- `Screen({children})` bg background: fixed top bar (safe-area top; Icon shield + "Porch Watch" headline (1 line, scale cap 1.15) left, SchemeToggle right; hairline when scrolled >8) above ScrollView (content pt md, pb xxl, gap lg; no side padding).
- `ScreenIntro({label,lead,accent,subtitle})` SectionLabel + Headline + body.
- `Icon({name,color,size?=24})` SymbolView map. Keys: home search quiz sparkles addPhoto check chevron shield arrow refresh play flag moon sun.
