---
name: MonNan365 — มนต์น่าน 365 Pitch Deck
description: Slide-pitch deck for the Nan Beyond Seasons Challenge 2026 hackathon, in the Nan forest/gold identity
colors:
  forest: "#2D6A4F"
  leaf: "#52B788"
  mist: "#95D5B2"
  gold: "#D4A017"
  amber: "#E9C46A"
  earth: "#8B4513"
  sky: "#4ECDC4"
  river: "#2A9D8F"
  cream: "#FDF8EF"
  ink: "#3D2B1F"
typography:
  display:
    fontFamily: "'Google Sans Display', 'Google Sans', 'IBM Plex Sans Thai', sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "'Google Sans', 'IBM Plex Sans Thai', sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.2rem)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "'IBM Plex Sans Thai', 'Sarabun', 'Noto Sans Thai', sans-serif"
    fontSize: "clamp(0.9rem, 1.6vw, 1.15rem)"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "20px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "1.2em"
  badge-green:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.forest}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  badge-gold:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.earth}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
---

# Design System: MonNan365 Pitch Deck

## 1. Overview

**Creative North Star: "The Nan Forest Ledger"**

A calm, editorial nature identity for a civic tourism pitch: the visual language of a well-kept field journal from Nan's forested hills, not a startup keynote. Deep forest green and warm gold carry the authority; cream paper and soft mist greens give it air. The deck argues its case the way a good ledger does, with clear structure and quiet confidence, not spectacle.

This system explicitly rejects the bold/energetic startup-pitch look, generic flat SaaS templates (gradient text, hero-metric blocks, side-stripe accent cards), and sterile minimalism that would flatten Nan's natural warmth out of the deck.

**Key Characteristics:**
- Forest green + gold as the identity anchor; cream as the resting surface, never stark white
- Editorial calm over kinetic energy: motion and decoration support legibility, never compete with it
- Every slide must survive a dim projector: contrast is non-negotiable
- Nature-derived texture (mist, canopy, terraced hillside) as atmosphere, applied as background, not decoration on top of text

## 2. Colors

The palette is Nan's own forest-to-gold gradient: deep greens for authority, gold and amber for warmth and highlight, one warm earth brown and one cool teal as supporting notes, all resting on warm cream paper.

### Primary
- **Nan Forest** (#2D6A4F): headings, primary UI chrome (nav bar), the anchor color of the whole deck.
- **Nan Gold** (#D4A017): the one accent that says "look here" — underlines on h2, CTA button, key highlight borders. Used sparingly by design.

### Secondary
- **Nan Leaf** (#52B788): supporting green, timeline rail, secondary emphasis.
- **Nan Mist** (#95D5B2): pale green for badges and soft tints, never for body text (fails contrast).

### Tertiary
- **Nan Amber** (#E9C46A): warm badge fill, paired with earth-brown text.
- **Nan Earth** (#8B4513): the "grounded" note — earth-toned card accents, brown-adjacent text on amber.
- **Nan Sky** (#4ECDC4): the one cool counterpoint, reserved for "AI Reason" badges and sky-accented cards so it reads as a deliberate third voice, not overuse.

### Neutral
- **Nan Cream** (#FDF8EF): the resting background for content slides. Warm, paper-like, never pure white.
- **Nan Ink** (#3D2B1F): body text and default ink color. Warm near-black, not gray — this is what keeps body copy legible.

### Named Rules
**The Paper Rule.** Content slides rest on Nan Cream or a textured variant of it, never stark white and never a saturated color as the full-bleed body background — saturated color is reserved for the cover slide and section dividers only.

**The One Gold Rule.** Gold is the single "attention" color per slide. If a slide already uses gold for its h2 underline, don't also add a gold CTA or gold badge competing for the same glance.

## 3. Typography

**Display Font:** 'Google Sans Display', 'Google Sans' (fallback: 'IBM Plex Sans Thai', sans-serif)
**Body Font:** 'IBM Plex Sans Thai' (fallback: 'Sarabun', 'Noto Sans Thai', sans-serif)

**Character:** A clean geometric sans for structure (Google Sans) paired with IBM Plex Sans Thai for full Thai-script body copy — both humanist-leaning and legible at small sizes, so the pairing reads as one coherent voice rather than two competing systems.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3.5rem), 1.1): cover slide title only (สไลด์ 1).
- **Headline** (700, clamp(1.5rem, 3vw, 2.2rem), 1.2): per-slide `h2` section titles, gold underline.
- **Title** (600, clamp(1.1rem, 2vw, 1.4rem), 1.3): `h3` sub-headers within a slide.
- **Body** (400, clamp(0.9rem, 1.6vw, 1.15rem), 1.7): paragraph and list copy; cap at ~70ch per line where the layout allows.
- **Label** (600, 0.8rem, uppercase avoided): badges and table headers use weight + color, not uppercase tracking, to stay within the no-uppercase-body rule.

### Named Rules
**The Warm Ink Rule.** Body text is always Nan Ink (#3D2B1F) or darker, never a light gray "for elegance" — gray-on-cream is the single biggest legibility risk on a projector.

## 4. Elevation

Mostly flat with soft ambient shadows for cards and metrics (`0 2px 8px rgba(0,0,0,0.06)`), conveying a light lift off the paper background rather than a hard layered UI. The nav bar and speaker-note strip use translucency + blur (`backdrop-filter: blur(8px)`) as a deliberate, purposeful exception — chrome that floats above the content, not decoration on the content itself.

### Shadow Vocabulary
- **card-ambient** (`box-shadow: 0 2px 8px rgba(0,0,0,0.06)`): default lift for `.card` and `.metric`.
- **chrome-glass** (`backdrop-filter: blur(8px)`, translucent forest fill): reserved for the fixed nav bar and speaker-note panel only — the deck's one purposeful glass usage.

### Named Rules
**The Flat-Paper Rule.** Slide backgrounds themselves never carry a shadow or elevation; only foreground UI (cards, metrics, chrome) lifts off the paper.

## 5. Components

### Cards
- **Corner Style:** 12px radius (`{rounded.lg}`).
- **Background:** white, resting on the cream slide background so cards read as "paper on paper," one shade lighter.
- **Shadow Strategy:** `card-ambient` (see Elevation).
- **Border:** none by default; color-coded variants (`.gold`, `.sky`, `.earth`) currently use a left border stripe — **flagged for removal**, see Do's and Don'ts.
- **Internal Padding:** 1.2em.

### Badges
- **Style:** pill radius (20px), solid tint background, no border.
- **Palette:** green (mist bg / forest text), gold (amber bg / earth text), sky (pale teal bg / dark teal text).

### Tables
- **Header:** forest green fill, white text, no uppercase.
- **Rows:** subtle forest-tinted zebra striping (`rgba(45,106,79,0.04)`), 1px warm-neutral divider between rows.

### Navigation (deck chrome)
- **Style:** fixed bottom bar, translucent forest fill + blur, white text and buttons with a soft outline; the one place glass/blur is used.

### Highlight Box (signature component)
- Gradient-tinted (forest→gold, both at 8% opacity) background with a gold left border, used for pull-quotes and key claims. This is the deck's one intentional "stripe" accent, distinct from the card left-borders flagged for removal below — it's a single always-italic callout, not a repeated card pattern.

## 6. Do's and Don'ts

### Do:
- **Do** keep every slide's body background on Nan Cream (or a textured variant built from the same hue family) — never stark white, per the Paper Rule.
- **Do** reserve Nan Gold for exactly one focal point per slide (the One Gold Rule).
- **Do** keep body text at Nan Ink or darker; verify contrast against any new background texture before shipping.
- **Do** keep the deck's existing keyboard/touch nav, speaker notes, and `@media print` rules working through any visual changes — this is presented live and exported to PDF.
- **Do** use editorial/nature texture (soft gradients, organic shapes, topographic or leaf motifs) at low opacity behind content, evoking Nan's forest and terraced hills.

### Don't:
- **Don't** use `.card.gold` / `.card.sky` / `.card.earth`'s current `border-left: 4px` colored stripe pattern going forward — it's the banned side-stripe accent; replace with full borders, tinted backgrounds, or icon-led headers instead.
- **Don't** introduce gradient text (`background-clip: text`) anywhere — emphasis comes from weight, size, or the One Gold Rule, not gradient fills.
- **Don't** make the deck feel like a bold/energetic startup pitch (PRODUCT.md anti-reference) — no neon, no oversized hero-metric blocks, no SaaS-cliché card grids repeated identically slide after slide.
- **Don't** let decorative background texture reduce body-text contrast below 4.5:1; test every slide background against Nan Ink body copy.
- **Don't** rely on effects (backdrop-filter, animated gradients, box-shadow glows) that disappear or break under `@media print` — the deck must still print/export cleanly.
