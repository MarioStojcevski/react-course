---
theme: default
title: "Session 18 - Style / Polish Capstone"
info: |
  A design audit, a small component library, loading and empty
  states, responsive navigation, and a final polish pass.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Style / Polish Capstone

Today you build the version you'd ship.

<br>

### React SPA Course - Session 18

---

# Today's Goals

<br>

- Audit what you have — before changing anything
- Typography and spacing scales, applied everywhere
- Shared `Button`, `Card`, `Loading`, `EmptyState` components
- Responsive navigation with a mobile menu
- Hover / focus / active states that feel intentional
- Skeletons, empty states, and a dark mode option

---

# Where We Left Off

```text
Session 16  →  tokens, flex, grid, responsive layout
Session 17  →  semantic HTML, keyboard, memo, lazy routes
Session 18  →  all of it, applied consistently
```

- You know the techniques; today is about **consistency**
- Most "looks unprofessional" comes from 6 slightly different
  paddings, 3 font sizes for the same role, and missing empty states

> 💡 Polish is not decoration. It's removing the inconsistencies.

---

# The Format Today

```text
audit  →  system  →  components  →  states  →  responsive  →  verify
 10m      20m        45m           30m        30m           15m
```

- Session 16 and 17 improvements were spread across the app
- Today: one pass, in order, so nothing gets re-done twice
- Every change goes into tokens or a shared component — nothing one-off

---

layout: center
---

# 1. Design Audit

You can't fix what you haven't listed.

---

# Audit Checklist

Run this on every screen of your capstone:

```text
Spacing      □ padding/margin from var(--space-*) only
Typography   □ one size per role (h1, h2, body, small)
Colors       □ tokens only — no raw hex in modules
Responsive   □ 320px / 768px / 1280px, no horizontal scroll
Loading      □ every fetch shows a loading state
Error        □ every failure shows a message + retry
Empty        □ zero results has its own screen
Interactive  □ hover + focus + active on every control
Images       □ alt text, no layout shift, `object-fit: cover`
Forms        □ labels, hints, errors announced
```

- Write your hits in a list — `Header: 3 paddings`, `ProductCard: raw #eee`
- Fix by category, not by screen: tokens first, then components

> 💡 The audit list is the deliverable. Screens get shorter after it.

---

layout: center
---

# 2. Type & Spacing Scales

Two systems that carry most of the polish.

---

# Typography Scale

```css
/* src/index.css */
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}

h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); }
h2 { font-size: var(--text-3xl); font-weight: var(--font-semibold); }
h3 { font-size: var(--text-2xl); font-weight: var(--font-semibold); }
```

- Sizes get a role: `--text-sm` is "secondary text", not "the small one"
- Line-height `1.6` for body, `1.2` for headings

---

# Spacing Scale

```css
:root {
  --space-1: 0.25rem;  /* 4px  */
  --space-2: 0.5rem;   /* 8px  */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

```css
.card     { padding: var(--space-6); margin-bottom: var(--space-4); }
.section  { padding: var(--space-12) var(--space-4); }
.listGap  { gap: var(--space-3); }
```

```text
inside a component   →  4 / 8 / 12 / 16
between components   →  24 / 32
between sections     →  48 / 64

bigger gap = bigger relationship
```

---

layout: center
---

# 3. Shared Components

One button, one card — everywhere.

---

# Button with Variants

```jsx
// src/components/Button.jsx
import styles from './Button.module.css';

export function Button({ variant = 'primary', children, ...props }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
}
```

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}
.button:disabled { opacity: 0.5; cursor: not-allowed; }

.primary { background: var(--color-primary); color: #fff; }
.primary:hover:not(:disabled) { background: var(--color-primary-dark); }

.secondary { background: transparent; color: var(--color-primary);
             border: 2px solid var(--color-primary); }

.danger { background: var(--color-danger); color: #fff; }
```

```jsx
<Button onClick={add}>Add to cart</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger" disabled={busy}>Delete</Button>
```

- Grep for `<button` — every one becomes this component

---

# Card

```css
/* src/components/Card.module.css */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.cardImage { width: 100%; height: 200px; object-fit: cover; }
.cardContent { padding: var(--space-4); }
.cardTitle { font-size: var(--text-lg); font-weight: var(--font-semibold);
             margin-bottom: var(--space-2); }
.cardDescription { color: var(--color-text-light); font-size: var(--text-sm); }
```

- `overflow: hidden` keeps the image inside the radius
- `object-fit: cover` crops instead of squashing
- Wrap the whole card in a `<Link>` so it's keyboard-reachable

---

layout: center
---

# 4. Loading & Empty States

Every screen needs three versions.

---

# Skeleton Beats Spinner

```jsx
// src/components/Loading.jsx
export function CardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonText} />
      </div>
    </div>
  );
}
```

```css
.skeletonImage,
.skeletonTitle,
.skeletonText {
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: var(--radius-sm);
}
@keyframes shimmer {
  to { background-position: -200% 0; }
}
```

- Skeleton mirrors the real layout → no jump when data lands
- Render as many skeleton cards as the real list usually shows

---

# Empty Is Not an Error

```jsx
// src/components/EmptyState.jsx
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon} aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
```

```jsx
// the four branches, in order
if (loading) return <CardSkeleton />;
if (error) return <ErrorMessage error={error} onRetry={retry} />;
if (!items.length) {
  return (
    <EmptyState
      icon="🛒"
      title="No products found"
      description="Try a different search or category."
      action={<Button variant="secondary" onClick={clear}>Clear filters</Button>}
    />
  );
}
return <ProductGrid products={items} />;
```

- Empty state offers the next action, not an apology

---

layout: center
---

# 5. Responsive Navigation

The most-seen component in your app.

---

# Sticky Header + Hamburger

```css
/* src/components/Header.module.css */
.header {
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-4);
}
.navLinks { display: flex; gap: var(--space-4); }

.menuButton { display: none; background: none; border: none;
              font-size: var(--text-xl); cursor: pointer; }

@media (max-width: 768px) {
  .menuButton { display: block; }
  .navLinks {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--color-surface);
    padding: var(--space-4);
    box-shadow: var(--shadow-md);
  }
  .navLinks.open { display: flex; }
}
```

---

# The Menu Button, Done Properly

```jsx
const [open, setOpen] = useState(false);

<button
  className={styles.menuButton}
  aria-expanded={open}
  aria-controls="nav-links"
  aria-label={open ? 'Close menu' : 'Open menu'}
  onClick={() => setOpen(o => !o)}
>
  ☰
</button>

<ul id="nav-links" className={`${styles.navLinks} ${open ? styles.open : ''}`}>
  <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
  <li><Link to="/cart" onClick={() => setOpen(false)}>Cart</Link></li>
</ul>
```

- `aria-expanded` tells screen readers the state — it's one attribute
- Close on route change: a link click sets `open = false`
- Close on Escape while focus is in the menu

---

layout: center
---

# 6. Interaction & Theme

The last 10%.

---

# Focus, Hover, Active

```css
/* every interactive element, without exception */
.button:hover { background: var(--color-primary-dark); }

.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.button:active { transform: translateY(1px); }

/* links and cards too */
a:focus-visible,
.card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

```text
:focus          fires on click too — noisy
:focus-visible  keyboard only — what you actually want
transition      150-200ms; 300ms is the ceiling
```

- `outline: none` with no replacement = Session 17 regression

---

# Dark Mode with Tokens

```css
/* only the tokens change — components don't know */
[data-theme='dark'] {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-text: #e2e8f0;
  --color-text-light: #94a3b8;
  --color-border: #334155;
}
```

```jsx
// toggle writes the attribute + remembers the choice
useEffect(() => {
  const saved = localStorage.getItem('theme') ?? 'light';
  document.body.dataset.theme = saved;
}, []);

function toggleTheme() {
  const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = next;
  localStorage.setItem('theme', next);
}
```

- Zero component changes — that's what tokens buy you
- Respect `prefers-color-scheme` for the default value

---

layout: center
---

# Build It

Six steps, in order. The audit comes first.

---

# Step 1: Audit

- Run the checklist on every screen, write the list
- Group hits by category: tokens, type, states, responsive
- Don't fix anything yet — finish the list

---

# Step 2: Scales

- Add type + spacing scales to `:root`
- Element defaults for `h1`-`h3`, body `line-height: 1.6`
- Replace the audited raw values with tokens

---

# Step 3: Components

- `Button` with `primary` / `secondary` / `danger`
- `Card` with image, title, description, hover lift
- Grep `<button` and per-screen card CSS → both shrink

---

# Step 4: The Three States

- `Loading` skeleton shaped like your real cards
- `EmptyState` with an action button
- Error view with a retry — from Session 14's pattern
- All four branches render on every data screen

---

# Step 5: Navigation + Interaction

- Sticky header, hamburger under 768px, `aria-expanded`
- `:focus-visible` on every control, hover on every clickable
- Verify: Tab pass still clean after the menu work

---

# Step 6: Verify

- `npm run dev` + `Ctrl+Shift+M`
- ✅ 320px: no horizontal scroll, menu opens, links close it
- ✅ 768px / 1280px: grid and nav behave
- ✅ Skeleton → content → empty → error all reachable
- ✅ Keyboard: reach everything, visible focus at every stop
- ✅ `grep -r "#[0-9a-f]\{3,6\}" src/` → only `index.css` tokens
- ✅ Dark mode: all screens readable, choice survives refresh

<br>

> 💡 The grep in step 6 is the audit proving itself. Run it.

---

layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Loading skeleton for your main data view + an empty state with an action. |
| 🟡 Medium | Responsive navbar: sticky, hamburger under 768px, closes on route change. |
| 🔴 Challenge | Dark mode toggle: tokens swapped via `data-theme`, saved in `localStorage`. |

<br>

**Bonus:** record a 60-second screen share of your app at 320px → 1280px for Demo Day.

> 💡 Easy first. The skeleton belongs in `components/`, not in the page.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| Inconsistent spacing survives | Tokens in step 2, then grep the raw values |
| Ugly on mobile | Device toolbar from 320px, fix overflow as you go |
| No hover/focus states | `:hover` + `:focus-visible` on every control |
| Skeleton flashes, then jumps | Match skeleton size to the real card |
| Hamburger works, Tab doesn't | `aria-expanded`, Escape close, focus visible |
| Dark mode breaks one screen | That screen has a hardcoded colour — grep it |
| Transitions feel sluggish | Keep them 150-200ms, `300ms` max |
| Dark mode resets on reload | Persist the attribute in `localStorage` |

---

layout: center
---

# Recap

---

# What We Covered Today

- [ ] Ran a written design audit across every screen
- [ ] Applied typography and spacing scales from tokens
- [ ] Built shared `Button` and `Card` components
- [ ] Added skeleton, empty, and error states to every data view
- [ ] Made navigation sticky and mobile-ready with correct ARIA
- [ ] Added hover, focus-visible, and active states everywhere
- [ ] Shipped dark mode by swapping tokens only

<br>

### Next Session

**Session 19 — Git Workflow + GH Pages Deploy** — commit the polish, then put it online.

---

layout: center
---

# Questions?

### Useful Links

- [Refactoring UI](https://www.refactoringui.com/) — practical design tips
- [Design Systems Repo](https://designsystemsrepo.com/)
- [Headless UI](https://headlessui.com/) — accessible component primitives
- [MDN: :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [Web.dev: Skeletons](https://web.dev/articles/skeletons)
