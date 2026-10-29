---
theme: default
title: "Session 23 - Testing Basics & Error Handling"
info: |
  React Testing Library basics with Vitest: render tests,
  interaction tests, async tests with mocked APIs, and
  error boundaries for graceful crashes.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Testing Basics & Error Handling

Tests catch bugs before your users do.

<br>

### React SPA Course - Session 23

---

# Today's Goals

<br>

- Set up React Testing Library with Vitest
- Write a **render** test for a real component
- Write an **interaction** test with `userEvent`
- Mock an API so async tests don't hit the network
- Add an **ErrorBoundary** so a crash isn't a blank screen
- Ship the 2 tests your capstone requires

---

# Where We Left Off

```text
Session 22  →  found bugs by hand: DevTools, console, opencode
Session 23  →  make the machine find them for you
```

- Your capstone checklist requires **at least 2 tests**
- Today: the setup, the two tests you'll actually write, and the crash net

> 💡 Tests are a safety net for the refactors you still want to make.

---

# Why Test?

```text
catches regressions    you break something, red tells you first
documents behavior     the test says what the code is supposed to do
enables refactoring    change code with confidence
required for capstone  2 tests minimum — rubric line item
```

- A test is executable documentation — it never goes stale quietly
- The goal isn't coverage percentage. The goal is **confidence**

> 💡 Write the test for the bug you just fixed. It never comes back.

---

# The Philosophy

React Testing Library tests from the **user's perspective**:

```text
❌ "does this component have state X?"
✅ "when I click this button, does the text change?"
```

```text
test what the user sees and does
  render → find by role/text/label → assert → interact → assert again
```

- You don't test that `useState` exists — you test what the user observes
- Tests written this way survive refactors; implementation tests don't

---
layout: center
---

# 1. Setup

Two minutes, once per project.

---

# Install & Configure

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

```js
// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
```

```js
// src/test/setup.js
import '@testing-library/jest-dom';
```

- `jsdom` = a fake DOM so components can render without a browser
- `globals: true` → `test`, `expect`, `describe` without imports

---

# Run Them

```bash
npm run test        # watch mode — reruns as you save
npm run test -- run # single pass, good for CI
```

```text
 ✓ src/components/__tests__/Greeting.test.jsx (1)
 ✓ src/components/__tests__/Counter.test.jsx (2)

 Test Files  2 passed (2)
      Tests  3 passed (3)
```

- Watch mode is the feedback loop — save, see red/green instantly

---
layout: center
---

# 2. Your First Tests

Render, then interact.

---

# A Render Test

```jsx
// src/components/__tests__/Greeting.test.jsx
import { render, screen } from '@testing-library/react';
import Greeting from '../Greeting';

test('renders hello message', () => {
  render(<Greeting name="Mario" />);
  expect(screen.getByText('Hello, Mario!')).toBeInTheDocument();
});
```

```text
render()           mounts the component into a virtual DOM
screen.getByText() finds the element by its text
expect(...).toBeInTheDocument()   the matcher from jest-dom
```

- `screen` = the whole rendered document — prefer it over container queries
- If `getByText` throws, the test fails with the list of everything it **did** find

---

# An Interaction Test

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from '../Counter';

test('increments counter on click', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const button = screen.getByRole('button', { name: /increment/i });
  await user.click(button);

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

```text
getByRole('button', { name })   accessibility-first — the label IS the name
await user.click(...)           real event timing, not fireEvent
```

- Query by **role** first, then label, then text — mirrors how users find things
- Always `await` userEvent — it waits for the same things a browser does

---

# Async: Mock the API

```jsx
import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ProductList from '../ProductList';

const server = setupServer(
  rest.get('*/products', (req, res, ctx) =>
    res(ctx.json([
      { id: 1, title: 'Laptop' },
      { id: 2, title: 'Phone' },
    ]))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays products after loading', async () => {
  render(<ProductList />);
  expect(await screen.findByText('Laptop')).toBeInTheDocument();
  expect(screen.getByText('Phone')).toBeInTheDocument();
});
```

- `findBy*` = wait for it (the async sibling of `getBy*`)
- The test never touches the real network — hermetic and fast

---

# Testing a Form

```jsx
test('submits login form', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /log in/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
```

- `vi.fn()` — a spy: records calls so you can assert on them
- `getByLabelText` works when inputs are labeled **correctly** — bad a11y fails tests

---
layout: center
---

# 3. Error Boundaries

A crash shouldn't be a blank screen.

---

# What an Error Boundary Catches

```text
component throws during render
  ├─ no boundary  →  white screen, React unmounts the tree
  └─ boundary     →  fallback UI, the rest of the app survives
```

- Catches **render-phase** errors in children — not event handlers, not async
- One boundary per risky region: the router outlet, each data view

> 💡 Think of it as a `try/catch` around a chunk of your UI.

---

# The Boundary

```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.fallback}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

- Class component — still the only way to implement a boundary
- "Try again" resets the state and re-renders the children

---

# Where to Put It

```jsx
// src/main.jsx — around the whole app
<ErrorBoundary>
  <App />
</ErrorBoundary>

// src/pages/ItemList.jsx — around one risky view
<ErrorBoundary>
  <ProductList />
</ErrorBoundary>
```

```text
outer boundary   last resort — "Something went wrong" + reload
inner boundary   one broken list doesn't kill the header and nav
```

- Boundaries nest: the inner one gets the first chance
- Pair with your Session 14 error state — a **failed fetch** is a normal state, not a crash

> 💡 Fetch errors → error state in the component. Render bugs → boundary.

---
layout: center
---

# 4. Two Tests for Your Capstone

The rubric minimum, done right.

---

# What to Cover

```text
1. a component renders correctly
   → title, price, description visible

2. a user interaction works
   → click "Add to cart", count or list changes
```

```jsx
test('renders product title and price', () => {
  render(<ProductCard product={{ title: 'Laptop', price: 999 }} />);
  expect(screen.getByText('Laptop')).toBeInTheDocument();
  expect(screen.getByText(/999/)).toBeInTheDocument();
});
```

```jsx
test('adds item to cart on click', async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();
  render(<ProductCard product={product} onAddToCart={onAdd} />);

  await user.click(screen.getByRole('button', { name: /add to cart/i }));
  expect(onAdd).toHaveBeenCalledWith(product);
});
```

- Bonus third test: loading state shows while the list fetches
- Tests live next to the component: `src/components/__tests__/`

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Write a render test for your main component — assert the title shows. |
| 🟡 Medium | Interaction test: click a button, assert the result changes. |
| 🔴 Challenge | Async test with a mocked API — data appears after loading. |

<br>

**Bonus:** wrap your router outlet in an `ErrorBoundary` with a "Try again" button.

> 💡 Easy first. Run `npm run test -- run` before you push.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| "Unable to find role='button'" | `screen.debug()` — look at what actually rendered; check the accessible name |
| Test hits the real API | Mock it with MSW — tests must be hermetic |
| "Not wrapped in act()" | State updates async — use `findBy*` or `waitFor` |
| Flaky pass/fail | Missing `await` on userEvent, or racing timers |
| Boundary doesn't catch | It doesn't catch its own errors, event handlers, or async code |
| Tests pass, app broken | You tested implementation — test what the user sees |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Set up React Testing Library with Vitest and jsdom
- [ ] Wrote a render test using role and text queries
- [ ] Wrote an interaction test with `userEvent`
- [ ] Mocked an API so async tests stay hermetic
- [ ] Added an ErrorBoundary with a fallback UI
- [ ] Shipped the 2 tests my capstone requires

<br>

### Next Session

**Session 24 — Free Build / Office Hours** — your buffer: finish, fix, polish, prepare for Demo Day.

---
layout: center
---

# Questions?

### Useful Links

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Which Query Should I Use?](https://testing-library.com/docs/queries/about#priority)
- [Vitest](https://vitest.dev/)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Mocking API Requests with MSW](https://mswjs.io/docs/)
