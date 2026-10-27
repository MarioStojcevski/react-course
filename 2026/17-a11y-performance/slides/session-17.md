---
theme: default
title: "Session 17 - Accessibility & Performance"
info: |
  Semantic HTML, forms and ARIA, keyboard navigation,
  React render behaviour, memoization and lazy loading.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Accessibility & Performance

Works for everyone. Fast for everyone.

<br>

### React SPA Course - Session 17

---

# Today's Goals

<br>

- Why a11y matters — and who it affects
- Semantic HTML: landmarks, headings, real buttons
- Labels, focus, and ARIA when HTML isn't enough
- Keyboard navigation for custom components
- Why React re-renders — and when to actually optimize
- `memo`, `useMemo`, `useCallback`, lazy routes

---

# Where We Left Off

Session 16 gave you a styled, responsive capstone:

```text
✅ layout works on mobile        ✅ consistent tokens
✅ cards reflow                  ✅ sticky footer
```

Two gaps remain:

```text
1. a student can't tab to your buttons   → the app is unusable
2. the list re-renders on every keystroke → the app feels slow
```

- Both are invisible in a mouse-only, empty-state demo
- Both show up the moment a real person (or Lighthouse) tries it

> 💡 Style makes it look finished. a11y and speed make it finished.

---

layout: center
---

# 1. Semantic HTML

The browser already knows what things are. Tell it.

---

# divs vs Elements

```jsx
// ❌ Bad — divs everywhere
<div className="header">
  <div onClick={handleClick}>Menu</div>
  <div className="nav">
    <div onClick={() => navigate('/')}>Home</div>
  </div>
</div>

// ✅ Good — semantic elements
<header>
  <button onClick={handleClick}>Menu</button>
  <nav>
    <button onClick={() => navigate('/')}>Home</button>
  </nav>
</header>
```

- `<div onClick>` is invisible to screen readers and unreachable by Tab
- `<button>` gives you focus, Enter/Space, roles, for free

---

# The Landmark Map

```jsx
<div className="app">
  <header>...</header>
  <nav>...</nav>
  <main>
    <h1>Store</h1>
    <section>
      <h2>Products</h2>
      <article>...</article>
    </section>
  </main>
  <footer>...</footer>
</div>
```

| Element | Screen reader hears |
|---|---|
| `<header>` | banner |
| `<nav>` | navigation |
| `<main>` | main (skip-link target) |
| `<footer>` | contentinfo |

- One `<main>` per page, one `<h1>` per page
- Route change → focus moves to the new `<h1>` (SPA gotcha)

---

# Heading Hierarchy

```jsx
// ❌ skipped levels, styles driving semantics
<h1>Store</h1>
<h4>Featured</h4>     {/* h4 because it looked smaller */}

// ✅ one h1, levels in order
<h1>Store</h1>
  <h2>Categories</h2>
  <h2>Products</h2>
    <h3>Wireless headphones</h3>
```

- Heading **level** = structure. Heading **size** = CSS
- Screen reader users navigate by headings — a skip breaks the map

```css
h3 {
  font-size: var(--font-size-base); /* look small, stay an h3 */
}
```

---

layout: center
---

# 2. Forms

Labels, hints, errors — announced correctly.

---

# Label Every Input

```jsx
// ❌ placeholder is not a label — it disappears on typing
<input type="email" placeholder="Email" />

// ✅ real association
<div>
  <label htmlFor="email">Email address</label>
  <input
    id="email"
    type="email"
    aria-describedby="email-hint"
    aria-invalid={hasError}
  />
  <span id="email-hint">We'll never share your email</span>
  {hasError && <span role="alert">Please enter a valid email</span>}
</div>
```

- Clicking the label focuses the input
- Screen reader reads label **and** hint **and** error
- `htmlFor` ↔ `id` is the link — mismatched ids break it

---

# Feedback That Gets Announced

```jsx
// errors
{error && <span role="alert">{error}</span>}
// role="alert" = interrupt, read immediately

// loading / async updates
<div role="status" aria-live="polite">
  {loading ? 'Loading results…' : `${count} products found`}
</div>
// aria-live="polite" = wait for a pause, then announce
```

```text
alert    →  urgent, breaks in       (form errors, failed save)
status   →  polite, waits           (search results, loading)
```

- The container must exist in the DOM; only its content changes
- Silent UI = "nothing happened" for screen reader users

---

layout: center
---

# 3. ARIA

When HTML has no tag for it.

---

# Three Rules of ARIA

```text
1. don't use ARIA if a native element does the job
2. the first rule of ARIA: don't use ARIA
3. ARIA you add must match behaviour you implement
```

```jsx
// screen-reader-only text
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

<button>
  <span aria-hidden="true">🗑</span>
  <span className="sr-only">Delete product</span>
</button>
```

- `aria-hidden` on the icon, real words for the ears
- An icon-only button with no label is the most common a11y bug in this course

---

# The Modal Contract

```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Confirm delete</h2>
  <p>This can't be undone.</p>
  <button onClick={close}>Cancel</button>
</div>
```

To actually be a modal, you must:

1. Move focus into it on open
2. Keep Tab cycling inside it (focus trap)
3. Close on Escape
4. Return focus to the element that opened it

- `role="dialog"` without those four is a promise you didn't keep

> 💡 Announce what it is, then do what you announced.

---

layout: center
---

# 4. Keyboard

If it works with a mouse only, it isn't done.

---

# The Keyboard Test

```text
Tab          move forward — can you reach every control?
Shift+Tab    move back
Enter/Space  activate buttons and links
Esc          close modals, menus, dropdowns
Arrows       move within widgets (menus, tabs, lists)
```

| Usually broken | Why |
|---|---|
| `<div onClick>` | Not focusable, no Enter/Space |
| Custom dropdown | No arrow keys, no Escape |
| Modal | Focus escapes to the page behind |
| Route change | Focus stays on the old page |
| Icon-only button | No accessible name |

- Unplug your mouse for five minutes and use your capstone

---

# Keyboard-Ready Dropdown

```jsx
function Dropdown({ items, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  function handleKeyDown(e) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0) onSelect(items[activeIndex]);
        setIsOpen(!isOpen);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }

  return (
    <div role="listbox" tabIndex={0} aria-expanded={isOpen}
         onKeyDown={handleKeyDown}>
      {/* items, active one gets aria-selected */}
    </div>
  );
}
```

---

# The Audit Loop

```text
1. Lighthouse tab (DevTools → Lighthouse) → Accessibility score
2. axe DevTools extension → lists violations with fixes
3. Tab-only pass → reachability of every control
4. Fix, re-run, compare
```

- Lighthouse catches missing labels, alt text, contrast, landmarks
- It can't judge "does this make sense" — you still read the page
- Aim to fix every automated finding; treat the score as a floor

> 💡 Automated tools find 30% of problems. The other 70% need a keyboard.

---

layout: center
---

# 5. Performance

First: understand what React is doing.

---

# Why Re-renders Happen

```text
state changes              →  that component re-renders
parent re-renders          →  children re-render too
context value changes      →  every consumer re-renders
```

```jsx
function ProductList({ products }) {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

```text
every keystroke  →  setQuery  →  ProductList re-renders
                  →  all 50 ProductCards re-render
```

- This is usually **fine** — React is fast at it
- Optimize when you can *measure* jank, not before

---

# Measure First

```text
React DevTools → Profiler → ⏺ record → interact → stop
```

| What you see | What it means |
|---|---|
| One component, many commits | A state update firing too often |
| 50 identical child renders | Children could be memoized |
| Render is < 2ms total | Not your problem — stop optimizing |
| Long bar while typing | Filter/sort running on every keystroke |

- Flamegraph shows *who* rendered and *how long*
- No profiler data, no optimization — that's the rule

---

# `React.memo` — Skip Unchanged Props

```jsx
import { memo } from 'react';

// only re-renders when props actually change (shallow compare)
const ProductCard = memo(function ProductCard({ product, onSelect }) {
  console.log('Rendering:', product.title);
  return (
    <div onClick={() => onSelect(product)}>
      <img src={product.thumbnail} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{product.price}</p>
    </div>
  );
});
```

```text
parent re-renders, product prop identical  →  card skips render ✅
```

- `memo` compares props — if the parent passes a **new object or
  function every render, memo does nothing** ❌
- That's why `memo` and `useCallback` travel together

---

# `useMemo` — Cache a Calculation

```jsx
import { useMemo } from 'react';

function ProductList({ products, category }) {
  // recomputed only when products or category change
  const visible = useMemo(() => {
    return products.filter(p => p.category === category);
  }, [products, category]);

  return (
    <ul>
      {visible.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

- Use it for: filtering, sorting, reducing a large list,
  anything you'd cache if it cost real time
- Don't use it for `a + b` — the memo costs more than the math
- Every value read inside must appear in the deps array

---

# `useCallback` — Stable Function References

```jsx
import { useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // same function reference between renders
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <ExpensiveChild onClick={handleClick} />
    </div>
  );
}

// memoized child → only re-renders when the reference changes
const ExpensiveChild = memo(function ExpensiveChild({ onClick }) {
  return <button onClick={onClick}>Click me</button>;
});
```

- Only useful for a prop passed to a `memo`ized child or a dep of an effect
- An inline arrow in a non-memoized child costs nothing

---

# When NOT to Memoize

```text
✅ memo:      big list items, expensive render, re-renders constantly
✅ useMemo:   1000+ items, real computation cost, measured jank
✅ useCallback: passed to memoized children, effect deps, event buses

❌ memo:      a card that renders in 0.1ms
❌ useMemo:   filtering 12 items
❌ useCallback: nothing — you just wrapped it for style
```

| Anti-pattern | Cost |
|---|---|
| Memoizing everything | Complexity + stale-dep bugs |
| Memo with unstable props | Zero benefit, all cost |
| Optimizing before profiling | You fixed a problem you don't have |

> 💡 Every `memo` is a promise that props stay stable. Keep it or drop it.

---

# The React Compiler

Since October 2025 the React Compiler is stable:

```text
you write:      plain components and handlers
compiler does:  automatic memoization, stable refs, dep analysis
```

- It inserts the `memo` / `useCallback` work for you
- You still need to understand the concepts — you write less of them
- Check your Vite config: the Babel plugin enables it
- Rules still apply: unstable props and needless state are your job

> 💡 Know why memo exists, so you can read what the compiler wrote.

---

layout: center
---

# 6. Lazy Loading

Ship less JavaScript up front.

---

# Route-Level Code Splitting

```jsx
import { lazy, Suspense } from 'react';

// a separate chunk — downloaded when the route is visited
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/product/:id"
        element={
          <Suspense fallback={<p>Loading…</p>}>
            <ProductDetail />
          </Suspense>
        }
      />
    </Routes>
  );
}
```

- Each `import()` becomes its own file in `dist/assets/`
- Home page no longer downloads the detail page's code

---

# What It Buys You

```text
before:  main.js  480 KB   ← every route, every visit
after:   main.js  210 KB   ← home only
         ProductDetail.js   90 KB  ← on first visit to a detail
         Settings.js        40 KB  ← only if opened
```

- Smaller first paint, faster Lighthouse score
- Users download what they actually use

```text
rule of thumb: lazy-load routes and heavy panels (charts, editors),
not every button component — the chunk overhead isn't worth it
```

- Always give `<Suspense>` a fallback — never a blank screen

---

layout: center
---

# Build It

Six steps on your capstone.

---

# Step 1: Semantic Pass

- `<header> <nav> <main> <footer>` around your layout
- `<div onClick>` → `<button onClick>`
- One `<h1>` per page, no skipped heading levels
- `<article>` for product cards if they stand alone

---

# Step 2: Forms

- Every input has a `<label htmlFor>` matching its `id`
- Errors use `role="alert"`, results count uses `role="status"`
- Placeholder is a hint, never the label

---

# Step 3: Keyboard Pass

```text
Tab through the whole app. Unplug the mouse.
```

- Reach: nav, search, every card action, forms, modal
- Esc closes your menu/modal and returns focus
- Focus outline visible on every stop (don't `outline: none`)

---

# Step 4: Measure

- React DevTools Profiler → record a filter/typing interaction
- Note which component re-renders and how long it takes
- No jank → skip the memo step and say why

---

# Step 5: Optimize the Hot Spot

- Heavy list item → `memo`
- Expensive filter/sort → `useMemo`
- Handler passed to a memoized child → `useCallback`
- Re-run the profiler and compare before/after

---

# Step 6: Lazy + Verify

- `lazy()` your two heaviest routes, wrap in `<Suspense>`
- `npm run build` → confirm extra chunks in `dist/assets/`

<br>

- ✅ Lighthouse accessibility ≥ 90
- ✅ Full keyboard pass, visible focus
- ✅ No route downloads code it doesn't use
- ✅ Profiler shows no multi-frame renders while typing

<br>

> 💡 If step 4 shows nothing slow, steps 5's memoization is optional. Say so out loud.

---

layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | `alt` on every image, `htmlFor` on every label, real `<button>`s. |
| 🟡 Medium | Custom dropdown fully keyboard-driven: Tab, Arrows, Enter, Escape. |
| 🔴 Challenge | Profiler before/after: `memo` + `useMemo` on your product list, with numbers. |

<br>

**Bonus:** `lazy()` your detail route and check `npm run build` output for the new chunk.

> 💡 Easy first. The challenge needs recorded profiler numbers, not vibes.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| `outline: none` kills focus | Style `:focus-visible`, never remove it |
| Icon button is silent | Accessible name: `aria-label` or `.sr-only` text |
| `memo` never helps | Props are new objects/functions every render |
| `useMemo` deps warning | Every value used inside must be in the array |
| Modal focus escapes | Trap focus in, return focus on close |
| Lazy route flashes blank | Wrap in `<Suspense fallback>` |
| Route change: SR silent | Move focus to the new page's `<h1>` |
| Everything memoized | Profile first, memo what's actually slow |

---

layout: center
---

# Recap

---

# What We Covered Today

- [ ] Replaced divs with semantic landmarks and real buttons
- [ ] Fixed heading hierarchy (one h1, no skipped levels)
- [ ] Linked labels, hints, and errors with `htmlFor` / `aria-*`
- [ ] Gave every interactive element a keyboard path
- [ ] Explained when React re-renders and measured with the Profiler
- [ ] Applied `memo`, `useMemo`, `useCallback` only where measured
- [ ] Split heavy routes with `lazy` + `Suspense`

<br>

### Next Session

**Session 18 — Style/Polish Capstone** — a full design audit and polish pass, all session long.

---

layout: center
---

# Questions?

### Useful Links

- [React: Accessibility](https://react.dev/learn/accessibility)
- [MDN: ARIA Attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [React: Optimizing Performance](https://react.dev/learn/rendering-lists)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)
