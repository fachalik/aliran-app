---
name: Aliran
description: Shared household finance tracker — quiet, clear, together.
colors:
  forest-950: "oklch(0.22 0.04 155)"
  forest-900: "oklch(0.28 0.05 155)"
  forest-800: "oklch(0.34 0.06 155)"
  forest-700: "oklch(0.42 0.07 155)"
  forest-200: "oklch(0.88 0.04 155)"
  forest-100: "oklch(0.94 0.025 155)"
  cream-50: "oklch(0.985 0.008 85)"
  cream-100: "oklch(0.97 0.012 85)"
  cream-200: "oklch(0.945 0.014 82)"
  cream-400: "oklch(0.86 0.022 78)"
  line: "oklch(0.89 0.015 80)"
  ink-900: "oklch(0.18 0.012 60)"
  ink-700: "oklch(0.32 0.012 60)"
  ink-500: "oklch(0.50 0.012 60)"
  ink-400: "oklch(0.62 0.010 60)"
  amber-600: "oklch(0.70 0.14 75)"
  clay-600: "oklch(0.65 0.14 35)"
  indigo-600: "oklch(0.55 0.14 260)"
typography:
  display:
    fontFamily: "'Instrument Serif', 'Times New Roman', serif"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  body:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "28px"
  full: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.forest-900}"
    textColor: "{colors.cream-50}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.forest-950}"
    textColor: "{colors.cream-50}"
  button-outline:
    backgroundColor: "{colors.cream-100}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-700}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
  card:
    backgroundColor: "{colors.cream-50}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.sm}"
    padding: "0 10px"
---

# Design System: Aliran

## 1. Overview

**Creative North Star: "The Family Ledger"**

Aliran is a shared household finance tracker used by families who want a single, honest view of where money flows. The design system takes its metaphor from a well-kept physical ledger: authoritative but domestic, precise without being cold. Every surface serves the record. Every element earns its place on the page.

The aesthetic is light, warm, and fixed — a deliberate choice made for a couple at the kitchen table, laptop open, reviewing what's due this month. The cream-parchment background is not decoration; it is the paper. The forest green is not a brand color applied for marketing — it is the ink of authority. The serif display face appears only where the record needs a name (service names, account titles, currency amounts) and falls away entirely for the operational UI that surrounds it.

Aliran explicitly rejects: the widget-heavy dashboard congestion of Mint and YNAB, where everything competes for attention; the dark-mode hype of trading and crypto apps, where neon glows on black makes finance feel like entertainment; and the generic SaaS layout language of sidebar-plus-identical-card-grids, where every product looks like every other product.

**Key Characteristics:**
- Warm parchment light surface, forest green as the single authority accent
- Three-font system with strict role separation: display (Instrument Serif, for named entities and currency), sans (Inter, for all UI text), mono (JetBrains Mono, for codes, labels, and tabular data)
- Full-palette semantic color for financial categories — income, expense, scheduled, receivable — used exclusively for data meaning, never for decoration or UI states
- Tonal layering (cream-50 cards on cream-100 ground) for content; structural shadow for interactive controls
- Tabular numerals throughout all monetary values via `font-variant-numeric: tabular-nums`

## 2. Colors: The Parchment Palette

Four named color families, each with a clear role. Color is not accent — it is meaning.

### Primary

- **Shaded Canopy (oklch(0.28 0.05 155) / forest-900):** The primary action color. Used for primary buttons, active navigation rings, and the sidebar logo. At rest it is dark and settled; it does not shout.
- **Forest Mid (oklch(0.42 0.07 155) / forest-700):** Income indicator and chart primary. In semantic contexts, it means money arrived.
- **Canopy Mist (oklch(0.94 0.025 155) / forest-100):** Active navigation background tint. The forest hue read at near-white lightness — present without weight.
- **Canopy Veil (oklch(0.88 0.04 155) / forest-200):** Avatar backgrounds and subtle forest-tinted surfaces.

### Secondary (semantic: finance categories)

These four colors carry meaning. They must never be used decoratively.

- **Warm Amber (oklch(0.70 0.14 75) / amber-600):** Receivable. Something owed to you, not yet collected.
- **Terracotta Ledger (oklch(0.65 0.14 35) / clay-600):** Expense and destructive states. Money that left.
- **Deep Register (oklch(0.55 0.14 260) / indigo-600):** Scheduled. An obligation locked in, not yet settled.

### Neutral

- **Warm Parchment (oklch(0.985 0.008 85) / cream-50):** Card surface and sidebar background. The "paper" of the ledger.
- **Page Ground (oklch(0.97 0.012 85) / cream-100):** Default page background. One step cooler than the card.
- **Ruled Line (oklch(0.89 0.015 80) / line):** All borders, dividers, and input outlines. Named after the line ruled across a paper ledger.
- **Ink Deep (oklch(0.18 0.012 60) / ink-900):** Primary text. Warm-brown black — the ink itself.
- **Ink Mid (oklch(0.32 0.012 60) / ink-700):** Secondary text, sub-labels.
- **Ink Faded (oklch(0.50 0.012 60) / ink-500):** Placeholder text, muted foreground.
- **Ink Pale (oklch(0.62 0.010 60) / ink-400):** Tertiary metadata, timestamps.

**The Semantic Seal Rule.** The four finance-category colors (income/expense/scheduled/receivable) are sealed to their semantic roles. A receivable badge is amber. An expense row is clay. No other element in the UI uses these colors — not hover states, not section accents, not call-to-action styling. Crossing the seal makes the vocabulary meaningless.

**The OKLCH Doctrine.** All color tokens are defined in OKLCH. The project does not use hex as a source-of-truth. When a Stitch linter warning appears, accept it — the doctrine takes precedence over Stitch compliance.

## 3. Typography

**Display Font:** Instrument Serif (with Times New Roman, serif fallback)
**Body Font:** Inter (with system-ui, -apple-system, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace fallback)

**Character:** A serif-and-sans pairing where the roles are absolute. Instrument Serif is a contemporary editorial face — slightly condensed, fluid at display sizes, confident in italic. It appears for named entities (service names, account titles, currency amounts, the logo) and nowhere else. Inter carries every piece of operational UI without calling attention to itself. JetBrains Mono handles codes, identifiers, date strings, status labels, and all tabular financial data.

### Hierarchy

- **Display** (Instrument Serif, weight 400, clamp(48px–88px), line-height 1.0, letter-spacing -0.025em): Hero headings and marketing surfaces only. Often italic for emphasis. Never in the product app UI.
- **Headline** (Inter, weight 700, 24px, line-height 1.2): Page titles in the product app. Sans only — the serif does not headline operational screens.
- **Title** (Inter, weight 600, 16px, line-height 1.3): Card headers, section labels, modal headings.
- **Body** (Inter, weight 400, 16px, line-height 1.55): Prose and descriptions. Maximum 65ch line length.
- **Label** (JetBrains Mono, weight 500, 10–11px, letter-spacing 0.08–0.12em, uppercase): Transaction metadata, timestamps, status badges, card identifiers, column headers in tables. Mono only — never Inter for these roles.

**The Instrument Rule.** Instrument Serif appears for: service names in commitment cards and the hero, currency amounts in feature cards, the sidebar logo "Aliran", the hero h1, and italic emphasis in marketing copy. It is prohibited in buttons, form labels, navigation items, table headers, and status indicators.

**The Tabular Number Rule.** All monetary values must carry `font-variant-numeric: tabular-nums` and `font-feature-settings: "tnum"`. Amounts in tables must align on the decimal point. The `.money` utility class on the project enforces this globally.

## 4. Elevation

Aliran uses a hybrid elevation model: **content surfaces are flat; interactive controls receive structural shadow.**

The page sits at cream-100. Cards and panels are cream-50 — one tonal step lighter, no shadow. The visual separation between background and card comes entirely from the tonal delta and a 1px `ring-foreground/10` hairline outline. No shadow needed. This keeps information surfaces calm and neutral. The eye goes to the data, not the container.

Interactive controls — buttons, inputs, popovers, dropdowns, form panels — receive shadow-1 at rest. This is not decoration; it communicates that the element can be pressed. Popovers and dropdowns use shadow-2. Modals and dialogs use shadow-3.

### Shadow Vocabulary

- **Whisper (shadow-1 / `0 1px 0 oklch(0.18 0.012 60 / 0.04), 0 1px 2px oklch(0.18 0.012 60 / 0.04)`):** Resting state of interactive controls. Just enough to signal affordance without distraction.
- **Structural (shadow-2 / `0 1px 0 oklch(0.18 0.012 60 / 0.04), 0 8px 24px -8px oklch(0.18 0.012 60 / 0.12)`):** Hover state on controls, dropdowns at rest, focus panels.
- **Prominent (shadow-3 / `0 1px 0 oklch(0.18 0.012 60 / 0.04), 0 24px 60px -20px oklch(0.18 0.012 60 / 0.18)`):** Modals, command palettes, popovers that break the z-layer significantly.

**The Flat Content Rule.** Cards, data tables, section containers, and dashboard tiles are flat at rest. Shadow on a card makes it feel like a button. Never add shadow-1 to a card.

## 5. Components

### Buttons

Confident and grounded. Clear affordances, solid weight. Not small or tentative.

- **Shape:** Softly rounded corners (18px / `--r-lg` = `--radius`). Not pill-shaped at default — that is reserved for marketing CTAs and hero rows.
- **Height:** 32px (h-8) at default. Transition: 150ms all.
- **Primary:** forest-900 background, cream-50 text. Hover: forest-950. Whisper shadow at rest.
- **Focus / Focus-Visible:** 3px ring at 50% opacity in forest-900. Border-color shifts to ring value.
- **Disabled:** 50% opacity, pointer-events none. Same color, faded — no special treatment.
- **Outline:** cream-100 background, ink-900 text, 1px border in `--line`. Hover: cream-200 background.
- **Ghost:** Transparent background, ink-700 text. Hover: cream-200 background, ink-900 text.
- **Destructive:** clay-600 at 10% opacity background, clay-600 text. Hover: clay-600 at 20%.

### Cards / Containers

- **Corner Style:** Gently rounded (18px / `--radius` mapped to `rounded-xl` in shadcn). Enough curve to feel domestic, not so much it looks bubbly.
- **Background:** cream-50 (`--card`).
- **Depth:** Tonal only. `ring-1 ring-foreground/10` — a hairline outline that reads as a boundary without visual weight. No shadow.
- **Internal Padding:** 16px (py-4, px-4). Small variant: 12px (py-3, px-3).
- **Footer:** cream-200 at 50% opacity background with top border-t divider. Internal padding matches card size.

### Inputs / Fields

- **Style:** Transparent background, 1px border in `--line`, 8px radius (tighter than buttons — field sits inside a form, not floating above it), 32px tall (h-8).
- **Focus:** Border shifts to forest-900, 3px ring at 50% opacity.
- **Error / Invalid:** Border shifts to clay-600, 3px ring in clay at 20% opacity.
- **Disabled:** 50% background tint, cursor not-allowed, 50% opacity.
- **Placeholder:** ink-500 text.

### Navigation (Sidebar)

- **Structure:** 224px fixed sidebar (w-56), cream-50 background, right border in `--line`. Hidden below md breakpoint.
- **Logo:** "Aliran" in Instrument Serif, 20px, forest-800. The one place the display font appears in the product shell.
- **Nav Item:** 36px rows (py-2.5 px-3), 8px radius, Inter 500 14px, ink-500 by default.
- **Active State:** forest-100 background, forest-800 text. Tonal shift only — no border, no underline, no icon color change.
- **Hover:** cream-200 background, ink-900 text.
- **User Row:** Avatar initials (32px, forest-200 bg, forest-800 text). Name in ink-700 Inter 14px 500. Email in ink-400 Inter 12px.

### Commitment Card (Signature Component)

The visual identity piece. A physical card metaphor — letterhead-style top accent bar, mono identifiers, serif service name, serif per-person amount.

- **Shape:** 6px radius. Tighter than the component default — deliberately evokes a physical printed card, not a UI widget.
- **Background:** cream-50. Single deep shadow for significant lift: `0 24px 60px -16px oklch(0.18 0.012 60 / 0.32), 0 0 0 1px oklch(0.18 0.012 60 / 0.06)`.
- **Top Accent:** 6px solid bar at the full top edge in the semantic category color (forest-700 for active, clay-600 for due/paid variants, ink-900 for settled). This is a full-width top bar — not a side-stripe. The side-stripe ban does not apply.
- **Identifiers:** JetBrains Mono, 9–10px, ink-500, uppercase, letter-spacing 0.1em. "Tagihan" label and invoice number.
- **Service Name:** Instrument Serif, 20px, ink-900, line-height 1.05.
- **Amount:** Instrument Serif, 24px, ink-900, letter-spacing -0.015em.
- **Data Rows:** Mono 10.5px, ink-700, separated by dashed cream-400 dividers.
- **Status Badge:** Mono 9px uppercase, letter-spacing 0.12em, pill shape (999px radius), category-color background, white text.

## 6. Do's and Don'ts

### Do:

- **Do** use Instrument Serif for service names, currency amounts, the sidebar logo, and hero headlines — and only those. Its presence signals "this is a named entity."
- **Do** apply JetBrains Mono to all codes, identifiers, timestamps, table column headers, and status labels. Tabular data reads as data when it's in mono.
- **Do** apply `font-variant-numeric: tabular-nums` to every monetary value. Amounts must align on the decimal point.
- **Do** use the four semantic colors (income/expense/scheduled/receivable) exclusively for their financial category. These are a vocabulary; mixing them into UI states breaks the language.
- **Do** keep content surfaces flat: cream-50 cards on cream-100 ground, ring hairline outline only. Reserve shadow for interactive controls and elevated overlays.
- **Do** render negative numbers, zero balances, and overdue commitments clearly and without alarm. The interface is a record, not a coach. The user brings the emotion.
- **Do** vary spacing for rhythm: 8px, 12px, 16px, 24px are different notes. Use them intentionally — same padding everywhere is monotony.
- **Do** use the `--line` token (oklch(0.89 0.015 80)) for all borders and dividers. It is the color of a ruled line — warm, not cold.

### Don't:

- **Don't** create widget-heavy layouts in the style of Mint or YNAB, where multiple panels compete for attention on the same screen. Every piece of data on screen should have a reason to be there. If the eye has to scan for priority, the layout has failed.
- **Don't** use dark-mode hype aesthetics: neon accents, gamified UI, animated score counters, glowing elements. Aliran is not entertainment.
- **Don't** default to generic SaaS layout: sidebar plus identical card grids. Cards are the lazy answer. Use tables, lists, or inline layouts when they serve the data better. Nested cards are always wrong.
- **Don't** use side-stripe borders — `border-left` or `border-right` greater than 1px as a colored accent on list items, cards, or alerts. The Commitment Card's top bar is a full-width accent, not a side-stripe. That exception is documented; it is not a pattern.
- **Don't** use gradient text (`background-clip: text` with a gradient fill). A single solid color, weight, or size handles emphasis without the decoration.
- **Don't** use the four semantic category colors (amber-600, clay-600, indigo-600, forest-700) for hover states, focus rings, section backgrounds, or decorative accents. They are sealed to their financial meaning.
- **Don't** add shadow to flat content cards. Shadow on a card makes it feel like a button.
- **Don't** use Instrument Serif in buttons, form labels, navigation items, table headers, or status indicators.
- **Don't** animate layout properties (width, height, padding, margin). Transitions touch opacity, transform, color, background, and shadow only.
- **Don't** use `#000` or `#fff`. Every neutral is tinted toward the brand hue — even at near-white and near-black lightness.
