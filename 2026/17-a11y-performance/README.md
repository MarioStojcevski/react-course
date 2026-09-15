# Session 17 — Accessibility & Performance

## What We're Learning Today

An app that works but isn't accessible excludes users. An app that's slow frustrates everyone. Today covers a11y basics, React performance optimization, and lazy loading.

## Prerequisites

- Sessions 01-16 completed
- Capstone project with styling applied

## Concepts

### 1. Why Accessibility (a11y)?

- **Legal requirement** in many countries
- **15% of the world** has some form of disability
- **Benefits everyone** — keyboard navigation helps power users, good contrast helps in sunlight

### 2. Semantic HTML — Use the Right Tags

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

**Key semantic elements:**
- `<header>`, `<nav>`, `<main>`, `<footer>` — page landmarks
- `<article>`, `<section>`, `<aside>` — content structure
- `<button>` — interactive elements (not `<div onClick>`)
- `<h1>`-`<h6>` — heading hierarchy (don't skip levels)

### 3. Forms — Labels and Focus

```jsx
// ❌ Bad — no label, no focus management
<input type="email" placeholder="Email" />

// ✅ Good — proper label association
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

### 4. ARIA — When HTML Isn't Enough

```jsx
// Screen reader only text
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

// Loading state
<div role="status" aria-live="polite">
  {loading && <p>Loading results...</p>}
</div>

// Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Confirm Delete</h2>
  <p>Are you sure?</p>
</div>
```

### 5. Keyboard Navigation

Every interactive element must be keyboard accessible:

```jsx
// Custom keyboard handling
function Dropdown({ items, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  function handleKeyDown(e) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0) {
          onSelect(items[activeIndex]);
        }
        setIsOpen(!isOpen);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }

  return (
    <div
      role="listbox"
      tabIndex={0}
      aria-expanded={isOpen}
      onKeyDown={handleKeyDown}
    >
      {/* ... */}
    </div>
  );
}
```

### 6. Performance — Why Re-renders Happen

React re-renders a component when:
- Its state changes
- Its parent re-renders (even if props didn't change!)
- The context it consumes changes

### 7. React.memo — Skip Unnecessary Re-renders

```jsx
import { memo } from 'react';

// Only re-renders when props actually change
const MovieCard = memo(function MovieCard({ movie, onSelect }) {
  console.log('Rendering:', movie.title);
  return (
    <div onClick={() => onSelect(movie)}>
      <img src={movie.poster} alt={movie.title} />
      <h3>{movie.title}</h3>
    </div>
  );
});
```

### 8. useMemo — Cache Expensive Calculations

```jsx
import { useMemo } from 'react';

function MovieList({ movies, filter }) {
  // Only recalculates when movies or filter changes
  const filteredMovies = useMemo(() => {
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [movies, filter]);

  return (
    <ul>
      {filteredMovies.map(movie => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  );
}
```

### 9. useCallback — Stable Function References

```jsx
import { useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // This function reference stays the same between renders
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

// Only re-renders when onClick reference changes
const ExpensiveChild = memo(function ExpensiveChild({ onClick }) {
  return <button onClick={onClick}>Click me</button>;
});
```

### 10. React Compiler (Mention)

Since October 2025, the React Compiler is stable and automatically:
- Memoizes components and hooks
- Skips unnecessary re-renders
- Optimizes dependency arrays

**In modern projects:** The compiler handles most of this automatically. You still need to understand the concepts, but you write less manual optimization.

### 11. Lazy Loading — Code Splitting

Load components only when needed:

```jsx
import { lazy, Suspense } from 'react';

// Only loads when the route is visited
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/movie/:id"
        element={
          <Suspense fallback={<p>Loading...</p>}>
            <MovieDetail />
          </Suspense>
        }
      />
    </Routes>
  );
}
```

**Benefits:**
- Smaller initial bundle = faster page load
- Components load on demand
- Users only download code they actually use

## Step-by-Step Walkthrough

1. Run Lighthouse audit on your capstone (DevTools → Lighthouse tab)

2. Fix the easiest a11y issues:
   - Add `alt` text to all images
   - Add `htmlFor` to all form labels
   - Use `<button>` instead of `<div onClick>`
   - Add heading hierarchy (h1 → h2 → h3)

3. Add keyboard support:
   - Test with Tab key — can you reach all interactive elements?
   - Test with Enter/Space — do buttons and links work?
   - Test with Escape — do modals close?

4. Optimize performance:
   - Wrap child components in `memo()` where appropriate
   - Use `useMemo` for expensive calculations
   - Use `useCallback` for event handlers passed as props

5. Add lazy loading for your detail page:
   ```jsx
   const MovieDetail = lazy(() => import('./pages/MovieDetail'));
   ```

## Try It Yourself

1. **Easy:** Add proper `alt` text to all images and `htmlFor` to all labels in your capstone.

2. **Medium:** Make a custom dropdown component fully keyboard-navigable (Tab, Enter, Arrow keys, Escape).

3. **Challenge:** Add React.memo to all your card components. Measure the performance improvement in React DevTools Profiler.

## Common Mistakes & How to Fix Them

- **"Focus is trapped"** — You created a modal but didn't add focus management. Use a focus trap library or manage focus manually
- **Over-memoizing** — Don't memoize everything. Only memoize components that actually re-render frequently with the same props
- **`useMemo` with wrong deps** — Every variable from outside the calculation must be in the dependency array
- **Lazy loading causes jank** — Add a Suspense fallback so users see a loading state, not nothing

## Recap / Checklist

After today, you should be able to:

- [ ] Use semantic HTML for accessibility
- [ ] Add proper labels, ARIA attributes, and keyboard support
- [ ] Explain why React re-renders
- [ ] Use React.memo, useMemo, and useCallback
- [ ] Implement lazy loading with Suspense
- [ ] Run a Lighthouse audit and fix basic issues

## Useful Links

- [React Accessibility Guide](https://react.dev/learn/accessibility)
- [MDN: ARIA Attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes)
- [React: Optimizing Performance](https://react.dev/learn/rendering-lists#reacting-to-updates)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/overview)
