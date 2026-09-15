# Session 13 — Context API & useReducer

## What We're Learning Today

When state needs to be shared across many components (not just parent-child), prop drilling becomes painful. Context API lets you share state globally. `useReducer` gives you predictable state updates for complex logic.

## Prerequisites

- Sessions 01-12 completed
- Capstone project with routing

## Concepts

### 1. The Problem — Prop Drilling

When you pass props through multiple layers just to reach a deeply nested component:

```
App → Layout → Sidebar → UserMenu → Avatar → { theme, user, logout }
```

Every component in the chain has to pass `theme`, `user`, and `logout` even if it doesn't use them. That's prop drilling.

**Context solves this:** any component can read from the context directly, no matter how deep it is.

### 2. Creating Context

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Create the context
const ThemeContext = createContext();

// 2. Create a provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Use it anywhere in the tree
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### 3. Where to Put the Provider

Wrap your app (or part of it) in the provider:

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

### 4. useReducer — Predictable State Updates

For complex state logic, `useReducer` is cleaner than multiple `useState` calls:

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
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

**Why useReducer over useState?**
- State updates are centralized and predictable
- Easier to test (pure function)
- Better for complex state with multiple sub-values

### 5. Context + useReducer = Global State Management

This combination replaces Redux for many apps:

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
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }

  function removeItem(item) {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  }

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' });
  }

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for using the cart
function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

### 6. When to Use What

| Situation | Solution |
|-----------|----------|
| State for one component | `useState` |
| State shared between parent/child | Lift state up |
| State shared across many components | Context API |
| Complex state logic (multiple transitions) | `useReducer` |
| Global app state (theme, auth, cart) | Context + `useReducer` |
| Server state (data from API) | `useEffect` + `useState` (or React Query) |

### 7. Context Anti-Patterns

**Don't put everything in one context:**
```jsx
// ❌ Bad — any change re-renders all consumers
<AppContext.Provider value={{ theme, user, cart, todos, settings }}>

// ✅ Good — separate concerns
<ThemeProvider>
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
</ThemeProvider>
```

**Don't create context in a component:**
```jsx
// ❌ Bad — new context every render
function App() {
  const ThemeContext = createContext(); // Creates a NEW context each time
  return <ThemeProvider value={theme}>{children}</ThemeProvider>;
}

// ✅ Good — create at module level
const ThemeContext = createContext(); // Created once
function App() {
  return <ThemeProvider value={theme}>{children}</ThemeProvider>;
}
```

## Step-by-Step Walkthrough

1. Create a context folder:
   ```bash
   mkdir src/context
   ```

2. Create `src/context/CartContext.jsx`:
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
           items: state.items.filter(item => item.id !== action.payload.id),
         };
       case 'CLEAR_CART':
         return { ...state, items: [] };
       default:
         return state;
     }
   }

   export function CartProvider({ children }) {
     const [state, dispatch] = useReducer(cartReducer, { items: [] });

     function addItem(item) {
       dispatch({ type: 'ADD_ITEM', payload: item });
     }

     function removeItem(item) {
       dispatch({ type: 'REMOVE_ITEM', payload: item });
     }

     function clearCart() {
       dispatch({ type: 'CLEAR_CART' });
     }

     return (
       <CartContext.Provider value={{ items: state.items, addItem, removeItem, clearCart }}>
         {children}
       </CartContext.Provider>
     );
   }

   export function useCart() {
     const context = useContext(CartContext);
     if (!context) {
       throw new Error('useCart must be used within a CartProvider');
     }
     return context;
   }
   ```

3. Wrap your app in the provider:
   ```jsx
   // src/main.jsx
   import { CartProvider } from './context/CartContext';

   function Main() {
     return (
       <CartProvider>
         <BrowserRouter>
           <App />
         </BrowserRouter>
       </CartProvider>
     );
   }
   ```

4. Use the cart in any component:
   ```jsx
   import { useCart } from '../context/CartContext';

   function AddToCartButton({ item }) {
     const { addItem } = useCart();
     return <button onClick={() => addItem(item)}>Add to Cart</button>;
   }

   function CartSummary() {
     const { items } = useCart();
     return <p>Cart: {items.length} items</p>;
   }
   ```

5. Test — add items from any page, verify they appear in the cart summary in the header.

## Try It Yourself

1. **Easy:** Create a `ThemeContext` that toggles between light and dark themes. Apply different background colors based on the theme.

2. **Medium:** Build a complete cart system: add items, remove items, clear cart, show total price.

3. **Challenge:** Create an `AuthContext` with login/logout functionality. Conditionally show "Login" or "Logout" in the header based on auth state.

## Common Mistakes & How to Fix Them

- **"Cannot read property of useContext"** — You forgot to wrap the component in the Provider
- **Too many re-renders** — Split your context into smaller pieces. Don't put unrelated state in the same context
- **State not updating** — In useReducer, you must return a new state object, never mutate the existing one
- **Confusing useState and useReducer** — Use useState for simple values, useReducer for complex state with multiple actions

## Recap / Checklist

After today, you should be able to:

- [ ] Create and provide context with `createContext` and `useReducer`
- [ ] Consume context with `useContext`
- [ ] Build a global state management system (cart, auth, theme)
- [ ] Know when to use useState vs useReducer vs Context
- [ ] Avoid context anti-patterns

## Useful Links

- [React: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React: Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [React: useReducer API Reference](https://react.dev/reference/react/useReducer)
