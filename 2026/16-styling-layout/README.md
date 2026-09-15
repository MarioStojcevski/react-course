# Session 16 — Styling & Layout

## What We're Learning Today

A functional app that looks ugly won't impress anyone. Today covers responsive layouts with Flexbox and Grid, consistent design systems, and making your capstone look professional.

## Prerequisites

- Sessions 01-15 completed
- Capstone project with full data flow

## Concepts

### 1. CSS Modules Recap + Global Styles

You've used CSS Modules for component-level styles. Now let's add global styles:

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
  color: #333;
  background-color: #f5f5f5;
}

a {
  color: #3b82f6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

### 2. Flexbox — One-Dimensional Layouts

Flexbox arranges items in a row or column:

```css
.container {
  display: flex;
  justify-content: space-between; /* horizontal spacing */
  align-items: center;            /* vertical alignment */
  gap: 16px;                      /* space between items */
}

/* Common patterns */
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-grid > * {
  flex: 1 1 300px; /* grow, shrink, basis — responsive cards */
}

.sidebar-layout {
  display: flex;
  gap: 2rem;
}

.sidebar {
  flex: 0 0 250px; /* fixed width */
}

.content {
  flex: 1; /* take remaining space */
}
```

**Key properties:**
- `justify-content` — horizontal alignment (main axis)
- `align-items` — vertical alignment (cross axis)
- `gap` — space between items (replaces margins)
- `flex-wrap` — allow items to wrap to next line

### 3. CSS Grid — Two-Dimensional Layouts

Grid handles rows AND columns:

```css
/* Responsive card grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Dashboard layout */
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
.header { grid-area: header; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

**Grid vs Flexbox:**
- Use **Grid** for page layouts and complex 2D arrangements
- Use **Flexbox** for navbars, card rows, and simple 1D alignment
- They work great together!

### 4. Responsive Design — Media Queries

```css
/* Mobile first — base styles for small screens */
.container {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}
```

**Mobile-first approach:**
1. Start with styles for the smallest screen
2. Add breakpoints for larger screens
3. Keep adding complexity as screen grows

### 5. Design Consistency — CSS Variables

Define your design tokens once, use them everywhere:

```css
/* src/index.css */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-secondary: #10b981;
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
  --space-2xl: 3rem;

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

**Use in components:**
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
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
}
```

### 6. Common Layout Patterns

**Sticky footer (content pushes footer down):**
```css
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1; /* takes up remaining space */
}
```

**Centering content:**
```css
.centered {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}
```

**Responsive images:**
```css
img {
  max-width: 100%;
  height: auto;
}
```

## Step-by-Step Walkthrough

1. Set up global styles in `src/index.css` with CSS variables (see section 5)

2. Create a responsive navbar:
   ```css
   /* src/components/Header.module.css */
   .header {
     background: var(--color-surface);
     box-shadow: var(--shadow-sm);
     padding: var(--space-md) var(--space-lg);
   }

   .nav {
     display: flex;
     justify-content: space-between;
     align-items: center;
     max-width: 1200px;
     margin: 0 auto;
   }

   .navLinks {
     display: flex;
     gap: var(--space-md);
   }
   ```

3. Create a responsive card grid:
   ```css
   /* src/components/CardGrid.module.css */
   .grid {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
     gap: var(--space-lg);
     padding: var(--space-lg);
   }
   ```

4. Test on different screen sizes (use DevTools device toolbar — Ctrl+Shift+M)

5. Apply your CSS variables throughout your components for consistency

## Try It Yourself

1. **Easy:** Make your card grid responsive — 1 column on mobile, 2 on tablet, 3 on desktop.

2. **Medium:** Create a dashboard layout with a sidebar and main content area using CSS Grid.

3. **Challenge:** Add a dark mode toggle that swaps CSS variables using a `data-theme` attribute on the body.

## Common Mistakes & How to Fix Them

- **Layout breaks on mobile** — You're using fixed widths. Use `max-width` + percentages + flex/grid instead
- **Horizontal scrollbar on mobile** — Something is wider than the viewport. Check for fixed widths or padding on body
- **Inconsistent spacing** — Use your CSS variables instead of hardcoded pixel values
- **Footer sticks to middle of page** — Use the sticky footer pattern (flex column with min-height: 100vh)

## Recap / Checklist

After today, you should be able to:

- [ ] Use Flexbox for one-dimensional layouts
- [ ] Use CSS Grid for two-dimensional layouts
- [ ] Make layouts responsive with media queries
- [ ] Create consistent designs with CSS variables
- [ ] Build common patterns (sticky footer, centered content, card grids)

## Useful Links

- [CSS Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Every Layout](https://every-layout.dev/) (common layout patterns)
