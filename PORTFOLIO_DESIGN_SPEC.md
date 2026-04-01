# Portfolio website — design & layout specification

Use this document to **reproduce the same visual design and layout** in another codebase, framework (React/Vue/etc.), or static site. Values below match the current **plain HTML + CSS** implementation.

---

## How to use this with another AI

Paste this file (or its sections) and ask for something like:

> “Build a portfolio using this exact design system: colors, typography, spacing, sidebar + top bar layout, card styles, and breakpoints. Use [your stack].”

---

## Tech stack (reference site)

- **HTML5**, **vanilla CSS** split across four files, **vanilla JS** for nav + animations.
- **Fonts:** Google Fonts — Inter (body), Plus Jakarta Sans (headings). Weights loaded: 400–800.
- **Icons:** Font Awesome 6 (CSS from CDN).

### CSS load order (required for cascade)

1. `base.css` — tokens, reset, `body` background, typography base, utilities (`.no-underline`, `.icon`), scrollbar, selection.
2. `layout.css` — top bar, sidebar, main column, section wrappers, responsive.
3. `components.css` — section titles, timeline, score cards, reveal animation classes.
4. `sections.css` — grids, expertise cards, research/project cards, certifications, previews.

---

## File structure (reference)

```
index.html          ← main page; body has class `has-topbar` when top bar is present
css/
  base.css
  layout.css
  components.css
  sections.css
js/
  main.js           ← smooth scroll, active nav, tutorials dropdown, scroll reveal
  certificate-preview.js
pages/              ← subpages reuse ../css/* and same sidebar pattern (no has-topbar)
assets/
```

---

## Design tokens (`:root` in `base.css`)

Copy these exactly for visual parity:

| Token | Value |
|-------|--------|
| `--bg` | `#f3f7fc` |
| `--surface` | `#ffffff` |
| `--surface-soft` | `#f8fbff` |
| `--text` | `#1f2937` |
| `--text-muted` | `#6b7280` |
| `--primary-color` | `#1f3a5f` |
| `--secondary-color` | `#2563eb` |
| `--accent-color` | `#0ea5a4` |
| `--border` | `#dbe7f5` |
| `--ring` | `rgba(37, 99, 235, 0.2)` |
| `--shadow-sm` | `0 4px 10px rgba(18, 39, 73, 0.06)` |
| `--shadow-md` | `0 10px 30px rgba(18, 39, 73, 0.1)` |
| `--shadow-lg` | `0 20px 40px rgba(18, 39, 73, 0.14)` |
| `--radius-sm` | `10px` |
| `--radius-md` | `16px` |
| `--radius-lg` | `22px` |
| `--heading-font` | `"Plus Jakarta Sans", "Inter", "Segoe UI", sans-serif` |
| `--body-font` | `"Inter", "Segoe UI", sans-serif` |
| `--topbar-height` | `52px` |

### Body background (layered)

Not a flat color. Use:

- Base: `var(--bg)`.
- Plus two **radial gradients** (very soft, large fades):
  - Top-right area: `#d9e9ff` fading to transparent.
  - Lower-left area: `#e1f9f9` fading to transparent.

### Typography

- **Body:** `font-family: var(--body-font)`, `line-height: 1.7`, `color: var(--text)`.
- **Headings h1–h4:** `font-family: var(--heading-font)`, `letter-spacing: about -0.01em`.
- **Section titles (`.section-title`):** `font-weight: 800`, responsive size `clamp(1.45rem, 2.1vw, 2rem)`, color `var(--primary-color)`.
- **Accent under title:** pseudo-element bar — width `76px`, height `4px`, pill radius, gradient `linear-gradient(90deg, var(--secondary-color), var(--accent-color))`.

### Global utilities

- **Links:** inherit color by default.
- **`.no-underline`:** no underline; on hover: underline with `2px` thickness, `3px` offset.
- **Selection:** background `#cfe0ff`, text `#0f2f57`.
- **Custom scrollbar (WebKit):** track `#e8eff8`, thumb `#9eb5d9`, rounded pill.

---

## Page layout architecture

### Overview

- **Optional fixed top bar** (full viewport width, height `--topbar-height`, `z-index: 100`).
- **Fixed left sidebar** (320px desktop; 280px narrow desktop; full-width sticky stack on mobile).
- **Main content** to the right of sidebar with `margin-left` matching sidebar width.
- **Each primary block** in main column is a **card-like `<section>`**: white surface, border, radius, soft shadow, subtle hover lift.

### `body.has-topbar` (homepage only)

When the top bar exists:

- `body` gets `padding-top: var(--topbar-height)` so content does not sit under the bar.
- `.sidebar` gets `top: var(--topbar-height)` and `height: calc(100vh - var(--topbar-height))`.
- In-page anchor scroll offset: `section` uses larger `scroll-margin-top` so headings clear the fixed bar (approx `var(--topbar-height) + 12px`).

Subpages without a top bar **must not** use `has-topbar` (sidebar aligns to `top: 0`, full height).

---

## Top bar (`.top-bar`)

- **Position:** `fixed`, full width, height `--topbar-height`.
- **Background:** `linear-gradient(135deg, #0f2744 0%, #1f3a5f 100%)`.
- **Border bottom:** `1px solid rgba(255,255,255,0.12)`.
- **Shadow:** soft, ~`0 4px 14px rgba(0,0,0,0.12)`.
- **Inner row:** max-width ~1400px, horizontal padding, flex space-between.

### Tutorials dropdown

- Wrapper: `.tutorials-dropdown` (`position: relative`).
- Toggle: `.dropdown-toggle` — pill button, semi-transparent white on navy, white text, chevron rotates when `.is-open`.
- Menu: `.dropdown-menu` — light surface card, border, large shadow, appears below toggle with fade + slight translate.
- **Behavior (JS):** toggle on button click; close on outside click and `Escape`; set `aria-expanded`.

---

## Sidebar (`.sidebar`)

- **Width:** 320px (280px at max-width 1100px).
- **Position:** `fixed`, `left: 0`, full vertical extent (adjusted if `has-topbar`).
- **Background:** `linear-gradient(160deg, #102a49 0%, #1f3a5f 50%, #1b496f 100%)`.
- **Shadow:** `var(--shadow-lg)`.
- **Layout:** column flex, gap ~1.25rem, padding ~1.4rem, `overflow-y: auto`.
- **Text:** white / light blue tints.

### Profile block (`.profile`)

- Frosted card on dark: semi-transparent white fill, light border, `backdrop-filter: blur(8px)`, radius `--radius-md`.
- **Photo:** circular ~190px (smaller on narrower breakpoints), thick `#7ab7ff` ring, `object-fit: cover`, depth shadow.
- Decorative soft glow under avatar via `::after` (radial blue, no pointer events); avatar/text **above** glow (`z-index`).

### Sidebar nav (`.nav-links`)

- Vertical list as CSS grid, gap ~0.65rem.
- Each link: flex row, icon + label, rounded ~12px, subtle translucent background, hover brightens.
- **Active link (`.active`):** solid blue-tinted background `rgba(37,99,235,0.62)`, light blue border; **no** layered shadows that could cause banding on mobile.
- **Focus:** visible ring-style focus (outline alternative).

### Social icons (`.social-links`)

- Row of circular buttons, brand-colored fills (email, Facebook, LinkedIn, ResearchGate), hover lift.

---

## Main column (`.main-content`)

- `margin-left: 320px` (280px when sidebar narrows).
- Padding ~`2.4rem 2rem 4rem` (tighter on smaller screens).

### Section cards (`.main-content > section`)

- Max-width ~1180px, centered.
- White `var(--surface)`, `1px solid var(--border)`, radius `--radius-lg`, padding ~1.65rem, `var(--shadow-sm)`.
- **Hover:** `translateY(-2px)` + `var(--shadow-md)`.

---

## Content patterns (inside sections)

### Section title

- Class: `.section-title` + gradient underline bar (see components.css).

### Timeline (`.timeline`, `.timeline-item`)

- Vertical guide line on the left (gradient secondary → transparent).
- Dots on the line (small filled circles with soft outer ring).

### Research / project cards (`.research-item`)

- White card, border, radius `--radius-md`, soft shadow.
- **Hover:** lift + stronger shadow.
- **Top accent:** 3px gradient bar appears on hover (`::before`).
- Title: `.research-title` (primary navy).
- Meta chips: `.research-details` + `span` pills (soft background, border).
- Body: `.research-description` (muted text).

### Project category headers (`.project-category` / `.category-title`)

- Subheader strip: left accent bar secondary color, soft background `--surface-soft`.

### Interest grid (`.interest-grid` / `.interest-item`)

- Responsive auto-fit grid, min column ~250px.
- Cards with left color accent by category class (`.technical`, `.security`, etc.).

### Expertise grid (`.expertise-grid` / `.expertise-category`)

- Responsive grid, min ~260px columns.
- Each category card: white body; **header band** is full-width with **category-specific gradient** (classes like `.robotics-control`, `.mlops-ai`, `.development`, etc.).
- Skills list: two columns on desktop, one column on mobile; muted list items with hover slide + color shift.

### Certifications

- List links use `.certificate-link` pill styling and optional Font Awesome cue.
- **Hover preview panels:** `#certificate-preview` and `#skills-preview` fixed on wide screens; **hidden** below max-width ~1200px to avoid overlap (see `sections.css`).

### Test scores

- `.score-card`, `.overall-score` pill, `.sub-scores` chips.

### Contact

- `.contact-info` as vertical stack of pill rows with icon + text.

---

## Motion & accessibility

- **Scroll reveal:** elements get `.reveal-ready`; when visible, `.is-visible` (fade + translate). Respect `prefers-reduced-motion: reduce` (no animation; show immediately).
- **Smooth scroll:** `html { scroll-behavior: smooth; }` plus JS for in-page `#` links in sidebar.
- **IntersectionObserver:** optional fallback if unsupported — show content without animation.

---

## Responsive breakpoints (summary)

| Breakpoint | Behavior |
|------------|----------|
| `≤ 1100px` | Sidebar 280px; main `margin-left` 280px; tighter padding. |
| `≤ 900px` | Sidebar full width, **sticky** top, rounded bottom corners; main `margin-left: 0`. |
| `≤ 600px` | Top bar may hide brand label; dropdown min-width uses `min(92vw, 300px)`. |

---

## JavaScript behaviors to replicate

1. **Tutorials dropdown:** open/close, outside click, Escape, `aria-expanded`.
2. **Sidebar smooth scroll** to `section[id]` for `href^="#"`.
3. **Active section highlighting:** on scroll, match current section id to sidebar link `href`.
4. **Reveal on scroll:** IntersectionObserver on main sections + key inner cards.

---

## External URLs (reference site)

```text
Google Fonts:
  https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap

Font Awesome 6:
  https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css
```

---

## Design intent (non-negotiable feel)

- **Tone:** professional academic/engineering portfolio — calm navy sidebar, airy light main area, **cards not flat blocks**.
- **Contrast:** high readability; muted gray for supporting text, navy for titles, blue/teal accents.
- **Depth:** subtle shadows + hover lift; avoid heavy skeuomorphism.
- **Consistency:** one radius scale, one shadow scale, one accent gradient language (secondary → teal).

---

## Optional one-shot prompt (for another AI)

> Implement a responsive portfolio layout: fixed 320px left sidebar with navy vertical gradient, profile avatar in a frosted glass card, stacked nav links with icon+label and solid blue active state. Main column has soft blue-gray page background with two faint radial gradients; each content section is a white rounded card with light border and shadow, section titles in Plus Jakarta Sans with a short blue-to-teal gradient underline. Add optional 52px top bar with tutorials dropdown (light dropdown panel). Use CSS variables exactly as in PORTFOLIO_DESIGN_SPEC.md. Add smooth scrolling, scroll-spy active nav, and optional scroll-reveal. Match breakpoints at 1100px and 900px.

---

*End of specification — update this file if tokens or layout change.*
