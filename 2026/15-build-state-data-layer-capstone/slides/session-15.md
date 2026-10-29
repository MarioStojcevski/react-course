---
theme: default
title: "Session 15 - Build State/Data Layer into Capstone"
info: |
  Practice day: plan global vs local state, wire the API layer
  into Context, and verify data flows end to end in your capstone.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Build State/Data Layer into Capstone

API → context → components. One working pipeline.

<br>

### React SPA Course - Session 15

---

# Today's Goals

<br>

- Plan which state is **global** and which stays **local**
- Wire the Session 14 API layer into a Context
- `useReducer` actions that carry loading / error / success
- Stack multiple providers in the right order
- Keep local state local — resist the context-everything trap
- Verify the full flow in **your** capstone

---

# Where We Left Off

- Session 13: Context + `useReducer` — in a throwaway demo
- Session 14: `apiClient`, resource modules, `useApi` — in a throwaway demo

Today both land in the app you keep:

```text
Session 13:  <MoviesProvider> around the app
Session 14:  products.getPopular() in src/api/
Session 15:  provider calls api, components call the hook
```

> 💡 Nothing new. The hard part is wiring **your** pieces together.

---

# What "Done" Looks Like

Verify each one in the browser:

1. App loads data from the API — not from a hardcoded array
2. Loading state shows while fetching
3. Error state shows when the API fails
4. Cart (or shared state) survives navigating between pages
5. No component calls raw `fetch` anymore
6. Local inputs (search box, form fields) still work

<br>

> 💡 Six checks. Don't move on until each passes.

---
layout: center
---

# 1. Plan Your State

Global is a decision, not a default.

---

# Global vs Local

| Global (Context) | Local (useState) |
|------------------|-------------------|
| User / auth state | Form inputs |
| Shopping cart | Search query |
| Theme (light/dark) | Modal open/close |
| Favorites list | Dropdown expanded |

<br>

- Ask: **how many components need this?**
- One component → local. Siblings or distant cousins → global
- Wrong global state is the #1 cause of tangled apps

> 💡 If you can't name three consumers, keep it local.

---

# Draw the Flow First

```text
src/api/          products.getPopular()      Session 14 ✅
    ↓
src/hooks/        useProducts() / useApi()   Session 14 ✅
    ↓
src/context/      ProductsProvider           today
    ↓
src/pages/        Home, List, Detail         Session 12 ✅
    ↓
UI
```

- Write this diagram for **your** capstone before coding
- One arrow = one import — if an arrow points backwards, stop

> 💡 The plan takes five minutes. Debugging a wrong arrow takes an hour.

---
layout: center
---

# 2. Context + API

The provider owns fetching. Components own rendering.

---

# The Reducer

```jsx
// src/context/productsReducer.js
export function productsReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SELECTED':
      return { ...state, selected: action.payload };
    default:
      return state;
  }
}
```

- Every async call follows the same three outcomes: loading → success or error
- One reducer file per context — not inline in the provider

---

# The Provider

```jsx
// src/context/ProductsContext.jsx
import { createContext, useContext, useReducer } from 'react';
import { products } from '../api/products';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [state, dispatch] = useReducer(productsReducer, {
    products: [], selected: null, loading: false, error: null,
  });

  async function fetchProducts() {
    dispatch({ type: 'SET_LOADING' });
    try {
      const data = await products.list();
      dispatch({ type: 'SET_PRODUCTS', payload: data.products });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }

  return (
    <ProductsContext.Provider value={{ ...state, fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used inside ProductsProvider');
  return ctx;
}
```

- The API layer stays in `src/api/` — the provider only dispatches
- The `useProducts` guard catches the #1 mistake: hook used outside the provider

---

# Consuming It

```jsx
// src/pages/Home.jsx
import { useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';

function Home() {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.grid}>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

- Three returns — loading, error, success. Never a blank screen
- Every consumer reads through the same hook — no prop drilling

> 💡 Components render state. They never fetch.

---
layout: center
---

# 3. Keep Local Local

Not everything belongs in context.

---

# The Temptation

```jsx
// ❌ global — only this input cares about the query
const [query, setQuery] = useState('');

// ✅ local — lives in the SearchBox, dies with it
function SearchBox() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

// ✅ global — the header and the page both read it
function CartIcon() {
  const { items } = useCart();
  return <span>Cart ({items.length})</span>;
}
```

- Context exists for **shared** state, not for convenience
- Every value in context re-renders every consumer — local state is free

> 💡 Moving state into context you don't need is a performance bug with a nice name.

---

# Multiple Contexts

```jsx
// src/main.jsx
function Main() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ProductsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ProductsProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

```text
outer providers  →  visible to everything inside
AuthProvider needs Theme?   ThemeProvider goes OUTSIDE it
Cart needs the user?        AuthProvider goes OUTSIDE it
```

- One concern per provider — auth, cart, products, theme
- Splitting contexts is how you stop unrelated re-renders

> 💡 Order is a dependency graph. Draw it before you nest it.

---
layout: center
---

# 4. Build It

Six steps, then the checklist.

---

# Step 1: Folders

```bash
mkdir -p src/context src/api src/hooks
```

```text
src/
├── api/          ← already there (Session 14)
├── context/
│   ├── ProductsContext.jsx   ← step 2
│   └── CartContext.jsx       ← step 5 (or your shared state)
├── hooks/        ← already there (Session 14)
├── pages/
└── main.jsx      ← step 3
```

---

# Step 2: First Context

- Create the reducer and provider from the earlier slides
- Swap in **your** resource module: `products.list()`, `carts.current()`
- Export a `useProducts`-style hook with the guard

---

# Step 3: Wrap the App

- Add `<ProductsProvider>` in `main.jsx`
- Inside `BrowserRouter` is fine — context doesn't care about routing
- `npm run dev` — app must still render before you change any page

---

# Step 4: Move One Page

- Pick your main list view
- Replace its local `useState` + `useEffect` with the context hook
- Confirm loading, error, and success all still appear

---

# Step 5: Shared State

- Cart (or favorites, or theme): its own context + provider
- Add it to `main.jsx` in the right spot in the order
- Header reads it — no props drilled through the router

---

# Step 6: Verify

- ✅ Data comes from the API, not a hardcoded array
- ✅ Loading and error states show on every data view
- ✅ Cart count survives navigating away and back
- ✅ Search input still filters — and it's still local state
- ✅ `grep -r "fetch(" src/pages` → no raw fetch left in pages

<br>

> 💡 The grep check is the one students skip. Pages render — they don't fetch.

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | `CartContext` with add/remove. Header shows the item count. |
| 🟡 Medium | Search page: results fetched through the API layer, stored in context, shown on `/search`. |
| 🔴 Challenge | Favorites feature: context + `localStorage` persistence — favorites survive a refresh. |

<br>

**Bonus:** add a `CLEAR_CART` action and a button that dispatches it.

> 💡 Easy first. Every dispatch goes through the reducer — no `setState` inside the provider.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| `useProducts must be used inside...` | Component is outside the provider — check `main.jsx` order |
| Data never arrives | Provider calls the API, but no page calls `fetchProducts()` on mount |
| Infinite re-render loop | `useEffect` missing deps, or object literal in the deps array |
| Stale cart after navigation | State lives in a page — move it into context |
| Everything re-renders on every keystroke | Unrelated state crammed into one provider — split it |
| Raw `fetch` still in pages | Pages consume context — only `src/api/` touches the network |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Planned global vs local state for my capstone
- [ ] Drew the data flow: api → hooks → context → pages
- [ ] Built a provider that dispatches loading / success / error
- [ ] Consumed it through a guarded `useX` hook
- [ ] Kept input state local instead of context-ing it
- [ ] Stacked multiple providers in dependency order
- [ ] Verified data flows end to end — no raw fetch in pages

<br>

### Next Session

**Session 16 — Styling & Layout** — global styles, tokens, Flexbox and Grid for the capstone.

---
layout: center
---

# Questions?

### Useful Links

- [React: Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [React: Managing State](https://react.dev/learn/managing-state)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
