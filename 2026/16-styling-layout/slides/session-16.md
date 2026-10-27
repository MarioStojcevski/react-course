---
theme: default
title: "Session 16 - Styling & Layout"
info: |
  Global styles, design tokens, Flexbox, CSS Grid, responsive
  media queries and the layout patterns your capstone needs.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Styling & Layout

Make it look like a product, not a prototype.

<br>

### React SPA Course - Session 16

---

# Today's Goals

<br>

- `index.css` — reset, base styles, and where global CSS belongs
- Design tokens — colors, spacing, type, radius, shadow in one place
- Flexbox — one-dimensional alignment (navbars, rows, sidebars)
- CSS Grid — two-dimensional layout (cards, dashboards)
- Mobile-first responsive design with media queries
- Sticky footer, centering, and the "no horizontal scroll" rule

---

# Where We Left Off

Session 05 gave you CSS Modules per component:

```css
/* src/components/ProductCard.module.css */
.card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}
```

It works. Two problems appear later:

```text
#fff, #fff, #ffffff, white     ← four names for the same colour
16px, 20px, 1.25rem, 18px      ← spacing drifts per component
```

- Component styles stay scoped — today we add the **system** underneath
- Tokens live in global CSS, components stay in modules

> 💡 Modules scope your selectors. Tokens unify your values.

---

layout: center
---

# 1. Global Styles

One file for everything that is not component-specific.

---

# `src/index.css`

```css
/* src/index.css — global styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-bg);
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
}
```

- Vite imports it once from `main.jsx` — it applies everywhere

---

# What Belongs Where

| Put it in `index.css` | Put it in a module |
|---|---|
| Reset / normalize | Component layout |
| `body`, `html` defaults | Card, button, nav styles |
| Design tokens (`:root`) | Anything with a class name |
| Typography element styles | Page-specific arrangement |
| Utility classes (`.sr-only`) | Animations used in one place |

```jsx
import './index.css';           // main.jsx, once
import styles from './Card.module.css';  // per component
```

> 💡 If you can't name the component it belongs to, it's global.

---

# 2. Design Tokens

Values defined once, consumed everywhere.

---

# The Token Block

```css
/* src/index.css */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-danger: #ef4444;
  --color-text: #333;
  --color-text-light: #666;
  --color-bg: #f5f5f5;
  --color-surface: #fff;
  --color-border: #e5e7eb;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Type */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;

  /* Shape */
  --radius-sm: 4px;
  --radius-md: 8px;
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

# Using Tokens

```css
.card {
  background: var(--color-surface);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.button {
  background: var(--color-primary);
  color: white;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-base);
}
```

- `var(--token)` works in any CSS property, in any module
- Change the token → the whole app updates

```css
/* a theme swap is now one line */
[data-theme='dark'] {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-text: #e2e8f0;
}
```

> 💡 Never hardcode a colour or pixel again. Token first.

---

# Scale Rules

Good systems are small and boring:

```text
colors      5-8 total   primary, danger, text, text-light, bg, surface, border
spacing     6 steps     xs sm md lg xl 2xl   (4, 8, 16, 24, 32, 48px)
type        4-5 sizes   sm base lg xl
radius      3           sm md lg
shadows     2-3         sm md lg
```

- Pick numbers once, write them down, reuse them
- Two spacings that are 1px apart are one spacing

> 💡 More tokens ≠ better system. Add a token only when you need it a third time.

---

layout: center
---

# 3. Flexbox

One row or one column. Align things inside it.

---

# The Mental Model

```text
main axis      →  the direction you set with flex-direction
cross axis     →  the other one

justify-content  =  distribute along the main axis
align-items      =  align on the cross axis
gap              =  space between items (replaces margins)
```

```css
.container {
  display: flex;
  justify-content: space-between; /* horizontal spacing */
  align-items: center;            /* vertical alignment */
  gap: 16px;                      /* space between items */
}
```

- Default `flex-direction: row` — main axis is horizontal
- `flex-direction: column` flips both axes

---

# The Navbar Pattern

```css
/* src/components/Header.module.css */
.header {
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md) var(--space-lg);
}

.navLinks {
  display: flex;
  gap: var(--space-md);
}
```

```text
|  Store            Home  Cart  Login  |   space-between
 ^brand                                ^links
                 gap: 16px →  between each link
```

---

# Wrapping Without Media Queries

```css
.cardGrid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
}

.cardGrid > * {
  flex: 1 1 300px; /* grow, shrink, basis — responsive cards */
}
```

```text
flex: grow shrink basis

basis 300px  →  "I want to start at 300px"
shrink 1     →  "I'll shrink if there's no room"
grow 1       →  "I'll take leftover space"

narrow screen: 1 card per row
wide screen:   3-4 cards per row     ← no @media needed
```

---

# Sidebar Layout

```css
.sidebarLayout {
  display: flex;
  gap: var(--space-xl);
}

.sidebar {
  flex: 0 0 250px; /* fixed width, no grow */
}

.content {
  flex: 1; /* take all remaining space */
}
```

```text
| 250px sidebar |      flexible content      |
| 250px sidebar |      flexible content      |
```

- `flex: 0 0 250px` = don't grow, don't shrink, start at 250
- `flex: 1` = the vacuum cleaner, takes what's left

---

layout: center
---

# 4. CSS Grid

Rows **and** columns. Page-level layout.

---

# The Responsive Card Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
}
```

```text
repeat      →  as many columns as fit
auto-fill    →  pack them automatically
minmax(280px, 1fr)  →  each column at least 280px, share leftover equally

320px screen  →  1 column
900px screen  →  3 columns
1400px screen →  4 columns          ← no @media needed
```

- The single most useful line in this lesson

---

# Named Areas

```css
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  min-height: 100vh;
}

.sidebar { grid-area: sidebar; }
.header  { grid-area: header; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

```text
┌──────────┬──────────────┐
│          │   header     │
│ sidebar  ├──────────────┤
│          │    main      │
│          ├──────────────┤
│          │   footer     │
└──────────┴──────────────┘
```

- The grid reads like a diagram of your page

---

# Grid or Flexbox?

| Use **Grid** when | Use **Flexbox** when |
|---|---|
| You're laying out the **page** | You're aligning items **in a row** |
| Rows and columns both matter | One dimension is enough |
| Card grids, dashboards, footers | Navbars, toolbars, button groups |
| You know the structure upfront | You're reacting to content size |

```text
page skeleton   →  Grid
everything else →  Flexbox
they live together: a Grid page full of Flexbox components
```

> 💡 Not a rivalry. Grid is the frame, Flexbox is the furniture.

---

layout: center
---

# 5. Responsive Design

Mobile first, breakpoints second.

---

# Mobile First

```css
/* base styles = the smallest screen */
.container {
  padding: var(--space-md);
}

/* tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--space-xl);
    max-width: 900px;
    margin: 0 auto;
  }
}

/* desktop and up */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}
```

```text
1. write the phone version
2. add min-width rules as the screen grows
3. never write max-width rules to "undo" desktop
```

---

# Standard Breakpoints

```css
/* use the same three everywhere */
@media (min-width: 640px)  { /* large phone  */ }
@media (min-width: 768px)  { /* tablet       */ }
@media (min-width: 1024px) { /* laptop       */ }
@media (min-width: 1280px) { /* desktop      */ }
```

- Content decides breakpoints, not device names
- If a layout breaks at 830px, that's your breakpoint
- Keep them in one place so components agree

```css
/* scale type and space with the screen */
@media (min-width: 768px) {
  .title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-lg);
  }
}
```

---

# Testing It

```text
Ctrl+Shift+M     DevTools device toolbar
```

| Check | How |
|---|---|
| iPhone SE (320px) | Smallest common width — overflow shows here first |
| iPad (768px) | Your tablet breakpoint in action |
| Desktop | Full layout, no max-width gaps |
| Rotate | Portrait ↔ landscape without breakage |

- Drag the responsive handle to find the exact width where it breaks
- Horizontal scrollbar = something has a fixed width

> 💡 Test the small screen first. Desktop almost always survives.

---

layout: center
---

# 6. Layout Patterns

The four you will use all capstone long.

---

# Sticky Footer

```css
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1; /* pushes the footer down on short pages */
}
```

```text
short page:                 long page:
┌────────────┐              ┌────────────┐
│ header     │              │ header     │
│ main       │              │ main       │
│            │              │ ...        │
│            │              │ ...        │
│ footer     │              │ footer     │
└────────────┘              └────────────┘
 footer sits at the bottom, always
```

---

# Centering and Overflow

```css
/* centered content column */
.centered {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

/* images never blow out the layout */
img {
  max-width: 100%;
  height: auto;
}
```

```text
horizontal scrollbar on mobile?

1. DevTools → hover elements, find the wide one
2. usually: fixed width, wide table, or unbreakable text
3. fixes: max-width: 100%, overflow-x: auto on that element,
   or flex-wrap / min-width: 0 on the flex child
```

---

# Design Review of What You Have

```text
open your capstone, look at each screen:

□ navbar     flex row, space-between, gap
□ card list  grid auto-fill minmax, or flex-wrap
□ detail     centered column, max-width
□ forms      labels above inputs, consistent spacing
□ footer     sticky footer pattern
□ mobile     no horizontal scroll, tap targets ≥ 44px
```

- No new components today — existing ones get a layout
- Screens should share one max-width and one spacing scale

---

layout: center
---

# Build It

Six steps on your capstone.

---

# Step 1: Tokens

Add the `:root` block to `src/index.css`.

- Colours, spacing, type, radius, shadows
- Keep it under ~30 declarations
- Body uses `var(--color-bg)` and `var(--color-text)`

---

# Step 2: Hunt Down Hardcoded Values

```text
Ctrl+Shift+F   search:   #fff
Ctrl+Shift+F   search:   16px
```

- Every hit in a `.module.css` becomes a token
- Different components, same value → one token

---

# Step 3: Navbar

- Flex row, `justify-content: space-between`
- Links in a nested flex row with `gap`
- Center it with `max-width` + `margin: 0 auto`

---

# Step 4: Card Grid

```css
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
```

- One line replaces your fixed-width or float hacks
- Resize the window: columns appear and disappear

---

# Step 5: Responsive Pass

- `Ctrl+Shift+M`, start at iPhone SE
- Mobile-first padding, then `min-width: 768px` and `1024px`
- Fix anything wider than the viewport

---

# Step 6: Verify

- `npm run dev`
- ✅ No horizontal scrollbar at 320px
- ✅ Footer sits at the bottom on a short page
- ✅ Cards reflow: 1 → 2 → 3 columns as you widen
- ✅ No raw hex or pixel values left in module files
- ✅ Every screen uses the same spacing rhythm

<br>

> 💡 The horizontal-scroll check is the one students skip. Do it.

---

layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Responsive card grid: 1 column mobile, 2 tablet, 3 desktop. |
| 🟡 Medium | Dashboard layout with sidebar + main using `grid-template-areas`. |
| 🔴 Challenge | Dark mode toggle that swaps tokens via `data-theme` on `<body>`. |

<br>

**Bonus:** sticky header (`position: sticky; top: 0`) that stays while you scroll the list.

> 💡 Easy first. The dark mode challenge is one `:root` block and one attribute selector.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| Layout breaks on mobile | Fixed widths → `max-width` + `%` + flex/grid |
| Horizontal scrollbar | Find the wide element, add `max-width: 100%` or `min-width: 0` |
| Inconsistent spacing | Replace raw px with `var(--space-*)` |
| Footer in the middle of the page | Sticky footer: flex column, `min-height: 100vh`, `main { flex: 1 }` |
| `gap` ignored | Parent needs `display: flex` or `display: grid` |
| Media query fights | You wrote `max-width` undo rules — go mobile-first instead |
| Centering doesn't work | `margin: 0 auto` needs a `max-width` (or `display: flex; justify-content: center`) |

---

layout: center
---

# Recap

---

# What We Covered Today

- [ ] Added global styles in `src/index.css` (reset + base)
- [ ] Defined design tokens and used them everywhere
- [ ] Aligned rows and navbars with Flexbox
- [ ] Built card grids and page frames with CSS Grid
- [ ] Went mobile-first with three breakpoints
- [ ] Applied sticky footer, centering, and responsive images
- [ ] Verified: no horizontal scroll at 320px

<br>

### Next Session

**Session 17 — Accessibility & Performance** — the styled app, usable by everyone and fast.

---

layout: center
---

# Questions?

### Useful Links

- [CSS-Tricks: A Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS-Tricks: The Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Every Layout](https://every-layout.dev/) — durable layout patterns
