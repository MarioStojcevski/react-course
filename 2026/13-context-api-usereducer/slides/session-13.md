---
theme: default
title: "Session 13 - Context API & useReducer"
info: |
  Share state across the tree without prop drilling, and update it
  predictably with reducers. Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Context API & useReducer

State that outlives one page.

<br>

### React SPA Course - Session 13

---

# Today's Goals

<br>

- Feel the pain of **prop drilling** — then fix it
- `createContext` → Provider → `useContext`
- Where the Provider goes, and why it matters
- `useReducer` for predictable state updates
- Context + `useReducer` = a mini Redux
- When to reach for which tool
- Two anti-patterns that bite everyone

---

# Where We Left Off

Session 12 gave every page its own URL. But some state is not page state:

```text
theme  cart  user  sidebar open   → belong to the whole app
```

Today you lift it out of components and put it somewhere shared:

```text
Session 11:  api/        one place for fetch
Session 12:  routes      one place for URLs
Session 13:  context     one place for shared state
```

> 💡 Each session adds one "single place" so `App.jsx` stops growing.

---
layout: center
---

# 1. The Problem

Before the fix, feel the drilling.

---

# Prop Drilling

Pass a prop through components that do not need it:

```text
App → Layout → Sidebar → UserMenu → Avatar
  theme      theme      theme        theme
  user       user       user         user
  logout     logout     logout       logout
```

- `Layout` and `Sidebar` forward props they never use
- Add one new value → edit every link in the chain
- Forget one link → silent `undefined`

> 💡 The middle components become mail carriers.

---

# The Code Version

```jsx
function App() {
  const [theme, setTheme] = useState('light');
  return <Layout theme={theme} setTheme={setTheme} />;
}

function Layout({ theme, setTheme }) {   // doesn't use them
  return <Sidebar theme={theme} setTheme={setTheme} />;
}

function Sidebar({ theme, setTheme }) {  // doesn't use them
  return <UserMenu theme={theme} setTheme={setTheme} />;
}

function UserMenu({ theme, setTheme }) { // actually needs them
  return <Avatar theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />;
}
```

- Three components carry props they never read
- Rename a prop → three files break

---
layout: center
---

# 2. Context API

Skip the chain. Read it anywhere.

---

# Three Steps

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Create the context (module level, once)
const ThemeContext = createContext();

// 2. Provider — owns the state, passes it down
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

- `value` is a plain object — put state **and** callbacks on it

---

# ...Then Use It Anywhere

```jsx
// 3. Consume — no matter how deep
function Avatar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      {theme} mode
    </button>
  );
}
```

- `Avatar` imports the context directly — no props
- Depth stops mattering: `App → Layout → Sidebar → ... → Avatar`

> 💡 Context is a broadcast channel, not a prop.

---

# Guard With a Custom Hook

Bare `useContext` returns `undefined` if the Provider is missing:

```jsx
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context;
}
```

```jsx
function Avatar() {
  const { theme, toggleTheme } = useTheme(); // fails loudly, early
  // ...
}
```

- Turns a confusing runtime crash into a clear message
- One `useX()` per context — always the same import shape

---

# Where the Provider Goes

```jsx
// src/main.jsx
import { ThemeProvider } from './context/ThemeContext';

function Main() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

- **Above** everything that needs the value
- Inside `BrowserRouter` if it uses router state, outside if not
- Too low → components above it can't read it

> 💡 If `useTheme` throws, your Provider is missing or too low.

---
layout: center
---

# 3. useReducer

Predictable updates for messy state.

---

# The Shape

```jsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}
```

---

# Why Not Just useState?

```jsx
// three related values, three setters, easy to desync
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

```jsx
// one state, one dispatch, one place that decides what happens next
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'FETCH_START' });
dispatch({ type: 'FETCH_SUCCESS', payload: data });
dispatch({ type: 'FETCH_ERROR', payload: err.message });
```

| | `useState` | `useReducer` |
|---|---|---|
| Best for | one value | several related values |
| Updates | anywhere | only in the reducer |
| Test | needs React | pure function |

---

# The Rules

- Return a **new** object — never mutate `state`
- Handle every action type, or throw on unknown
- `action.payload` carries the data (naming convention)

```jsx
// ❌ mutation — React may not re-render
state.items.push(item);
return state;

// ✅ new object every time
return { ...state, items: [...state.items, action.payload] };
```

> 💡 The reducer is a pure function: same state + action → same result.

---
layout: center
---

# 4. Context + useReducer

The combination that replaces Redux.

---

# One Cart Example

```jsx
import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload.id),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}
```

---

# Provider With an Action Surface

```jsx
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = item => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = item => dispatch({ type: 'REMOVE_ITEM', payload: item });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
```

- Consumers never see `dispatch` — just named functions

---

# Consumers Stay Dumb

```jsx
// header, anywhere in the tree
function CartSummary() {
  const { items, clearCart } = useCart();
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <div>
      <span>{items.length} items · ${total}</span>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}
```

```jsx
function ProductCard({ product }) {
  const { addItem } = useCart();
  return <button onClick={() => addItem(product)}>Add to cart</button>;
}
```

- No prop connects these two components
- Add an item on `/products`, see it in the header on `/cart`

---
layout: center
---

# 5. When to Use What

The most common question of the session.

---

# The Decision Table

| Situation | Solution |
|---|---|
| State for one component | `useState` |
| State shared parent ↔ child | lift state up |
| State read by many, unrelated components | Context |
| Several values updating together | `useReducer` |
| Global app state (theme, auth, cart) | Context + `useReducer` |
| Server data from an API | `useEffect` + `useApi` (Session 14) |

<br>

- Context is for **low-frequency** shared state
- Data that refetches belongs in the API layer, not in a reducer

> 💡 Ask: "Who reads it?" If the answer is "everyone", it's context.

---

# Two Anti-Patterns

```jsx
// ❌ one giant context — every change re-renders everyone
<AppContext.Provider value={{ theme, user, cart, todos, settings }}>

// ✅ split concerns, nest providers
<ThemeProvider>
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
</ThemeProvider>
```

```jsx
// ❌ context created inside a component — new context every render
function App() {
  const ThemeContext = createContext();
}

// ✅ created once at module level
const ThemeContext = createContext();
```

---

# Re-render Reality Check

```jsx
// ❌ new object every render, even if nothing changed
<ThemeContext.Provider value={{ theme, toggleTheme }}>

// ✅ split the value, or memoize it
const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
<ThemeContext.Provider value={value}>
```

- Every consumer re-renders when `value` changes
- Cheap for theme/auth/cart (changes rarely)
- Never put per-keystroke search results in context

> 💡 Context is a broadcast. Broadcasting often = rendering often.

---
layout: center
---

# Build It

Six steps on your capstone.

---

# Step 1: Pick Your Global State

Look at your app and choose **one**:

```text
theme      ← easy win, visible immediately
auth       ← user + login/logout
cart       ← if your capstone has items
filters    ← shared search/sort across pages
```

```bash
mkdir -p src/context
```

- One context today. Splitting is easy, merging is not.

---

# Step 2: The Reducer

```jsx
// src/context/ThemeContext.jsx
const initialState = { theme: 'light' };

function themeReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return { theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET':
      return { theme: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
```

- State shape first, then actions
- Name actions like events: `TOGGLE`, `ADD_ITEM`, `LOGIN`

---

# Step 3: Provider + Hook

```jsx
import { createContext, useContext, useReducer } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  const toggle = () => dispatch({ type: 'TOGGLE' });
  const set = theme => dispatch({ type: 'SET', payload: theme });

  return (
    <ThemeContext.Provider value={{ ...state, toggle, set }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
```

---

# Step 4: Wrap the App

```jsx
// src/main.jsx
import { ThemeProvider } from './context/ThemeContext';

function Main() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

- Provider outside the router so every page can read it
- Nest more providers as you add contexts

---

# Step 5: Consume It

```jsx
// src/components/Header.jsx
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle}>{theme === 'light' ? '🌙' : '☀️'}</button>;
}
```

- Delete the props you were drilling
- Search for the old prop names — they should be gone

---

# Step 6: Verify

- `npm run dev`
- ✅ Toggle works from a deeply nested component
- ✅ State survives route changes (navigate, come back)
- ✅ Refresh resets it — expected, context is in-memory
- ✅ No `Cannot read properties of undefined` from `useContext`
- ✅ Old drilled props removed from the chain

<br>

> 💡 Refresh resetting state is correct. Persistence is a later problem.

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | `ThemeContext` with a toggle, applied to your layout colors. |
| 🟡 Medium | Cart: add, remove, clear, live count + total in the header. |
| 🔴 Challenge | `AuthContext`: login form, protected route, logout from the nav. |

<br>

**Bonus:** guard each hook with its own `useX()` error check.

> 💡 Easy first. The header count is your proof that drilling is gone.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| `useContext` returns `undefined` | Provider missing, or nested too low |
| Updates don't re-render | You mutated `state` instead of returning a new object |
| Every keystroke re-renders the app | High-frequency state doesn't belong in context |
| `Unknown action: X` thrown | Typo in `action.type`, or unhandled case |
| Context value changes every render | `useMemo` the value, or split into two contexts |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Diagnosed prop drilling in my own component tree
- [ ] Created a context, provider, and guarded `useX()` hook
- [ ] Mounted the provider at the right height in `main.jsx`
- [ ] Moved complex updates into a `useReducer`
- [ ] Built Context + `useReducer` for one global state
- [ ] Chose between `useState`, lifting, and Context
- [ ] Avoided the two context anti-patterns

<br>

### Next Session

**Session 14 — API Layer Patterns** — one place for every fetch.

---
layout: center
---

# Questions?

### Useful Links

- [React: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React: Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [React: useReducer Reference](https://react.dev/reference/react/useReducer)
