# Session 18 — Style/Polish Capstone

## What We're Learning Today

Today is dedicated to making your capstone look professional. Apply your styling knowledge, fix inconsistencies, and do a final polish pass.

## Prerequisites

- Sessions 01-17 completed
- Capstone project with all features implemented

## Concepts

### 1. Design Audit Checklist

Before polishing, audit your current state:

- [ ] Consistent spacing (use CSS variables)
- [ ] Consistent typography (font sizes, weights, line heights)
- [ ] Consistent colors (use your design tokens)
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Loading states for all data fetching
- [ ] Error states with clear messages
- [ ] Empty states (no data yet)
- [ ] Hover/focus states for interactive elements
- [ ] No horizontal scroll on mobile
- [ ] Images have alt text

### 2. Typography Scale

Create a consistent type system:

```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */

  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}

h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); }
h2 { font-size: var(--text-3xl); font-weight: var(--font-semibold); }
h3 { font-size: var(--text-2xl); font-weight: var(--font-semibold); }
```

### 3. Spacing System

Use consistent spacing with CSS variables:

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}

/* Usage */
.card {
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

.section {
  padding: var(--space-12) var(--space-4);
}
```

### 4. Button Styles

Create a button component with variants:

```css
/* src/components/Button.module.css */
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
  transition: all 0.2s ease;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary {
  background: var(--color-primary);
  color: white;
}

.primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.secondary:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
}

.danger {
  background: var(--color-danger);
  color: white;
}

.danger:hover:not(:disabled) {
  background: #dc2626;
}
```

### 5. Card Component

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

.cardImage {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.cardContent {
  padding: var(--space-4);
}

.cardTitle {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-2);
}

.cardDescription {
  color: var(--color-text-light);
  font-size: var(--text-sm);
}
```

### 6. Loading and Empty States

```jsx
// Skeleton loading — looks better than a spinner
function CardSkeleton() {
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

// Empty state
function EmptyState({ icon, title, description }) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// Usage
if (loading) return <CardSkeleton />;
if (items.length === 0) {
  return <EmptyState icon="🎬" title="No movies found" description="Try a different search" />;
}
```

### 7. Responsive Navigation

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

.navLinks {
  display: flex;
  gap: var(--space-4);
}

/* Mobile hamburger */
.menuButton {
  display: none;
  background: none;
  border: none;
  font-size: var(--text-xl);
  cursor: pointer;
}

@media (max-width: 768px) {
  .menuButton {
    display: block;
  }

  .navLinks {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-surface);
    flex-direction: column;
    padding: var(--space-4);
    box-shadow: var(--shadow-md);
  }

  .navLinks.open {
    display: flex;
  }
}
```

## Step-by-Step Walkthrough

1. Run the design audit checklist on your capstone

2. Add CSS variables to `index.css` (if not already done):
   - Colors, spacing, typography, shadows, border-radius

3. Create reusable components:
   - `Button.jsx` with primary/secondary/danger variants
   - `Card.jsx` with image, title, description
   - `Loading.jsx` skeleton or spinner
   - `EmptyState.jsx` for empty results

4. Apply consistent spacing throughout:
   - Replace all hardcoded pixels with CSS variables
   - Ensure consistent padding and margins

5. Test responsiveness:
   - Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
   - Test on iPhone SE, iPad, and desktop
   - Fix any overflow or layout issues

6. Polish interactive states:
   - Add hover effects to buttons and cards
   - Add focus outlines for keyboard navigation
   - Smooth transitions for state changes

## Try It Yourself

1. **Easy:** Create a consistent loading skeleton for your main data view.

2. **Medium:** Build a responsive navbar that collapses into a hamburger menu on mobile.

3. **Challenge:** Create a dark mode toggle using CSS variables and a `data-theme` attribute.

## Common Mistakes & How to Fix Them

- **Inconsistent spacing** — Use your CSS variables, never hardcode pixel values
- **Ugly on mobile** — Test with the device toolbar, fix overflow and sizing issues
- **No hover states** — Every interactive element needs hover, focus, and active states
- **Slow transitions** — Keep transitions under 300ms for snappy feel

## Recap / Checklist

After today, you should be able to:

- [ ] Run a design audit on your app
- [ ] Create consistent typography and spacing systems
- [ ] Build reusable UI components (Button, Card, Loading)
- [ ] Implement responsive navigation
- [ ] Polish hover/focus/active states
- [ ] Create skeleton loading states

## Useful Links

- [Design Systems Resources](https://designsystemsrepo.com/)
- [Refactoring UI](https://www.refactoringui.com/) (practical design tips)
- [Headless UI](https://headlessui.com/) (accessible component primitives)
