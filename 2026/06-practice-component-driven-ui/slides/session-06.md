---
theme: default
title: "Session 06 - Practice: Component-Driven UI"
info: |
  Practice day: plan a component tree, lift state up, and build a
  mini shopping cart with state, props, and events.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Practice: Component-Driven UI

Plan it, split it, wire it up.

<br>

### React SPA Course - Session 06

---

# Today's Goals

<br>

- Plan a UI **before** writing any code
- Split a page into small components
- Lift state up so siblings can share it
- Pass data down, send actions up
- Build a working mini shopping cart
- No new concepts — pure repetition

---

# Where We Left Off

```jsx
function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <button>Add to Cart</button>
    </div>
  );
}
```

- The button does nothing — no handler attached
- No cart, no total, no memory
- One component can't hold the whole page

> 💡 Today: split the UI into components, then connect them with state.

---
layout: center
---

# 1. The Exercise

A throwaway app. Pure muscle memory.

---

# Build a Mini Shopping Cart

Four moving parts, nothing more:

- **Browse** — a list of products
- **Add** — a button on every product card
- **Cart** — shows what you've added
- **Total** — a running price sum

<br>

**Not your capstone.** Throwaway code, keepable instincts.

> 💡 Type it out. Copy-paste teaches your fingers nothing.

---

# Component Breakdown

Plan the tree before you touch the keyboard:

```text
App
├── ProductList
│   └── ProductCard   (repeated)
└── Cart
    └── CartItem      (repeated)
```

- Repeated or reusable markup → its own component
- One component, one job

> 💡 If you'd copy-paste it, componentize it.

---

# Component, or Not?

| Make it a component when... | Keep it inline when... |
|---|---|
| The same markup repeats | It appears exactly once |
| It has one clear job | It's just a wrapper `<div>` |
| You'd test it on its own | It's a one-off line of text |

<br>

Start with one component per line of the tree. Split further only when a file gets hard to read.

---
layout: center
---

# 2. Lifting State Up

When siblings need the same data.

---

# The Problem

```jsx
function App() {
  return (
    <div>
      <ProductList />
      <Cart />
    </div>
  );
}
```

- `ProductList` adds items — `Cart` has to show them
- Siblings can't read each other's props or state
- State inside a child is invisible to everyone else

> 💡 If two components need the same data, it lives in neither of them.

---

# The Fix — Lift It to App

```jsx
function App() {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart(prev => [...prev, product]);
  }

  return (
    <div>
      <ProductList onAddToCart={addToCart} />
      <Cart items={cart} />
    </div>
  );
}
```

State moves to the **closest common parent** of the two components.

---

# Data Down, Actions Up

```text
App owns the state
  │
  ├─ props ───────► ProductList   (products, addToCart)
  ├─ props ───────► Cart          (items)
  │
  ◄── onAddToCart(product) ───────┘
```

| Direction | What travels |
|---|---|
| Down ↓ | Data via props: `items`, `products` |
| Up ↑ | Actions: children call the parent's function |

---
layout: center
---

# 3. Build It

Six files, one working cart.

---

# Step 1 — `src/data.js`

```js
export const products = [
  { id: 1, name: 'Laptop',     price: 999 },
  { id: 2, name: 'Phone',      price: 699 },
  { id: 3, name: 'Headphones', price: 149 },
  { id: 4, name: 'Watch',      price: 299 },
];
```

- Plain data, no React — just an array of objects
- `id` is unique — it becomes our `key`

> 💡 Data in its own file keeps components focused on UI.

---

# Step 2 — `src/ProductCard.jsx`

```jsx
import styles from './ProductCard.module.css';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className={styles.card}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;
```

- Two props in: the data, and the callback that sends data back up

---

# Step 3 — `src/ProductCard.module.css`

```css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
}
.card button {
  cursor: pointer;
}
```

- File ends in `.module.css` — scoped to this component only
- Read classes as `styles.card`, never as the raw string `"card"`

---

# Step 4 — `src/Cart.jsx`

```jsx
function Cart({ items }) {
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <div>
      <h2>Cart ({items.length})</h2>
      {items.length === 0 && <p>Cart is empty</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name} — ${item.price}</li>
        ))}
      </ul>
      <p>Total: ${total}</p>
    </div>
  );
}

export default Cart;
```

---

# Step 5 — `src/ProductList.jsx`

```jsx
function ProductList({ products, onAddToCart }) {
  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductList;
```

- `key` from the product's unique `id` — Session 04 again

> 💡 The README maps products straight inside `App`. Extracting `ProductList` keeps `App` readable.

---

# Step 6 — `src/App.jsx`

```jsx
import { useState } from 'react';
import { products } from './data';
import ProductList from './ProductList';
import Cart from './Cart';

function App() {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart(prev => [...prev, product]);
  }

  return (
    <div>
      <h1>Mini Cart</h1>
      <ProductList products={products} onAddToCart={addToCart} />
      <Cart items={cart} />
    </div>
  );
}
```

---

# Run It

```bash
npm run dev
```

- [ ] Four products render as cards
- [ ] Click **Add to Cart** — the item appears in the cart
- [ ] Add the same product twice — the list grows
- [ ] The total updates on every add
- [ ] Empty cart shows the empty message

---
layout: center
---

# 4. Keeping Lists in Sync

Updates depend on the state you can't see yet.

---

# Use the Functional Form

```jsx
// ❌ Reads THIS render's cart — rapid clicks lose items
setCart([...cart, product]);

// ✅ React passes the latest cart in
setCart(prev => [...prev, product]);
```

| | `setCart([...cart, p])` | `setCart(prev => [...prev, p])` |
|---|---|---|
| Reads | Snapshot from this render | Latest state, always |
| Rapid clicks | Can drop updates | Safe |

> 💡 New state depends on old state? Always use `prev => ...`.

---
layout: center
---

# Try It Yourself

Get Easy working before you touch Medium.

---

# Exercises

| Level | Task |
|---|---|
| 🟢 Easy | **Clear Cart** button that resets state to `[]` |
| 🟡 Medium | Group duplicates — show `Laptop ×2`, not repeat rows |
| 🔴 Challenge | **Remove** button per cart item — drops one instance |

<br>

**Bonus:** disable **Add to Cart** when the item is already in the cart.

> 💡 One level at a time. Verify in the browser before moving on.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| Cart renders empty after adding | Functional form: `setCart(prev => [...prev, item])` |
| Key warning on cart items | Use the product `id`, never the array index |
| Nothing re-renders | You mutated state — build a new array instead |
| Button click does nothing | Prop isn't passed down, or isn't called with `()` |

> 💡 Almost every bug today is state-related. Check the setter first.

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Plan a component tree before writing code
- [ ] Lift state to the closest common parent
- [ ] Pass data down with props, actions up with callbacks
- [ ] Render lists with `.map()` and stable keys
- [ ] Update state immutably with the functional form
- [ ] Build a small app from scratch

<br>

### Next Session

**Session 07 — useEffect & Data Fetching** — your app talks to an API.

---
layout: center
---

# Questions?

### Useful Links

- [React: Thinking in React](https://react.dev/learn/thinking-in-react)
- [React: Lifting State Up](https://react.dev/learn/sharing-state-between-components)
- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React: Lists and Keys](https://react.dev/learn/rendering-lists)
