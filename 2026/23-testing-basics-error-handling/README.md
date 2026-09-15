# Session 23 — Testing Basics & Error Handling

## What We're Learning Today

Tests catch bugs before your users do. Today we learn React Testing Library basics, write meaningful tests, and add error boundaries to handle crashes gracefully.

## Prerequisites

- Sessions 01-22 completed
- Capstone project stable

## Concepts

### 1. Why Test?

- **Catches regressions** — you break something, tests tell you
- **Documents behavior** — tests show how your code is supposed to work
- **Enables refactoring** — change code confidently, tests verify it still works
- **Required for capstone** — at least 2 tests minimum

### 2. React Testing Library — Philosophy

React Testing Library tests from the **user's perspective**:
- Not: "does this component have state X?"
- But: "when I click this button, does the text change?"

**It tests behavior, not implementation.**

### 3. Setting Up Tests

```bash
# Vite + React comes with Vitest pre-configured
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

```javascript
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

```javascript
// src/test/setup.js
import '@testing-library/jest-dom';
```

### 4. Your First Test

```jsx
// src/components/__tests__/Greeting.test.jsx
import { render, screen } from '@testing-library/react';
import Greeting from '../Greeting';

test('renders hello message', () => {
  render(<Greeting name="Mario" />);
  expect(screen.getByText('Hello, Mario!')).toBeInTheDocument();
});
```

**What's happening:**
- `render()` — puts the component in a virtual DOM
- `screen.getByText()` — finds an element by its text content
- `expect().toBeInTheDocument()` — asserts the element exists

### 5. Testing User Interactions

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

### 6. Testing Async Data Fetching

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import MovieList from '../MovieList';

// Mock API server
const server = setupServer(
  rest.get('/api/movies', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, title: 'Inception' },
      { id: 2, title: 'The Matrix' },
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays movies after loading', async () => {
  render(<MovieList />);

  // Wait for movies to load
  expect(await screen.findByText('Inception')).toBeInTheDocument();
  expect(screen.getByText('The Matrix')).toBeInTheDocument();
});
```

### 7. Testing Forms

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

### 8. Error Boundaries — Graceful Crashes

When a component throws, React shows a blank screen. Error boundaries catch errors and show fallback UI:

```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
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

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MovieList />
    </ErrorBoundary>
  );
}
```

### 9. Meaningful Tests for Your Capstone

Aim for 2-3 tests that cover:

1. **Component renders correctly**
   ```jsx
   test('renders movie title and description', () => {
     render(<MovieCard movie={{ title: 'Inception', overview: 'A dream within a dream' }} />);
     expect(screen.getByText('Inception')).toBeInTheDocument();
     expect(screen.getByText('A dream within a dream')).toBeInTheDocument();
   });
   ```

2. **User interaction works**
   ```jsx
   test('adds item to cart when button is clicked', async () => {
     const user = userEvent.setup();
     const addToCart = vi.fn();
     render(<ProductCard product={product} onAddToCart={addToCart} />);
     
     await user.click(screen.getByRole('button', { name: /add to cart/i }));
     expect(addToCart).toHaveBeenCalledWith(product);
   });
   ```

3. **Loading/error states**
   ```jsx
   test('shows loading state while fetching', () => {
     render(<MovieList />);
     expect(screen.getByText(/loading/i)).toBeInTheDocument();
   });
   ```

## Step-by-Step Walkthrough

1. Make sure testing libraries are installed:
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
   ```

2. Create a test setup file:
   ```bash
   mkdir src/test
   ```

3. Create `src/test/setup.js`:
   ```javascript
   import '@testing-library/jest-dom';
   ```

4. Create your first test:
   ```bash
   mkdir src/components/__tests__
   ```

5. Write a simple render test for one of your components

6. Run the tests:
   ```bash
   npm run test
   ```

7. Write an interaction test using userEvent

8. Add an ErrorBoundary to your app

## Try It Yourself

1. **Easy:** Write a test that renders your main component and checks for the title.

2. **Medium:** Write a test that clicks a button and verifies the result changes.

3. **Challenge:** Write an async test that mocks an API call and verifies the data displays.

## Common Mistakes & How to Fix Them

- **"Unable to find role='button'"** — Use `screen.debug()` to see what's rendered. Check the accessible name
- **Tests fail in CI but pass locally** — Check for async issues. Use `waitFor` or `findBy` queries
- **"Not wrapped in act()"** — You're updating state asynchronously. Wrap in `waitFor` or use `findBy`
- **Error boundary not catching** — It only catches errors in child components, not in itself or event handlers

## Recap / Checklist

After today, you should be able to:

- [ ] Set up React Testing Library with Vitest
- [ ] Write render tests
- [ ] Write interaction tests with userEvent
- [ ] Mock API calls for async tests
- [ ] Add an ErrorBoundary component
- [ ] Write at least 2 meaningful tests for your capstone

## Useful Links

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library: Which Query Should I Use?](https://testing-library.com/docs/queries/about#priority)
- [Error Boundaries in React](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
