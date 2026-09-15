# Session 06 — Practice: Component-Driven UI

## What We're Learning Today

Today is practice day. We'll build a small throwaway app to solidify what we learned about state, props, and events. This app won't be part of your capstone — it's pure repetition to build muscle memory.

## Prerequisites

- Sessions 01-05 completed (understand state, events, CSS Modules)
- A Vite React project

## Concepts

### 1. The Exercise — Build a Mini Shopping Cart

We'll build a simple cart with:
- A list of products to browse
- An "Add to Cart" button on each
- A cart that shows what you've added
- A running total

### 2. Component Breakdown

Before writing code, plan your components:

```
App
├── ProductList
│   └── ProductCard (repeated)
└── Cart
    └── CartItem (repeated)
```

**Rule of thumb:** If a piece of UI is repeated or could be reused, make it a component.

### 3. Lifting State Up

The cart state needs to be shared between `ProductList` and `Cart`. When siblings need to share data, lift the state to their closest common parent:

```jsx
// State lives in App — the parent of both ProductList and Cart
function App() {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart([...cart, product]);
  }

  return (
    <div>
      <ProductList onAddToCart={addToCart} />
      <Cart items={cart} />
    </div>
  );
}
```

**Key pattern:** Parent passes a function down as a prop, child calls it to send data up.

### 4. Props Are Data Down, Actions Up

```
App
  ↓ data (products, cart items)
  ↓ actions (addToCart function)
ProductList & Cart
```

- **Data flows down:** Parent gives children the data they need via props
- **Actions flow up:** Children call functions passed by parents to send data back

### 5. Keeping Lists in Sync

When adding items, always use the functional form of setState if the new state depends on the old:

```jsx
// ✅ Safe — guaranteed to use latest state
setCart(prev => [...prev, product]);

// ⚠️ Risky — might use stale state in rapid clicks
setCart([...cart, product]);
```

## Step-by-Step Walkthrough

1. Create a new Vite React project:
   ```bash
   npm create vite@latest mini-cart -- --template react
   cd mini-cart
   npm install
   ```

2. Create `src/data.js`:
   ```javascript
   export const products = [
     { id: 1, name: 'Laptop', price: 999 },
     { id: 2, name: 'Phone', price: 699 },
     { id: 3, name: 'Headphones', price: 149 },
     { id: 4, name: 'Watch', price: 299 },
   ];
   ```

3. Create `src/ProductCard.jsx`:
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

4. Create `src/ProductCard.module.css`:
   ```css
   .card {
     border: 1px solid #ddd;
     padding: 16px;
     margin: 8px;
     border-radius: 8px;
   }
   ```

5. Create `src/Cart.jsx`:
   ```jsx
   function Cart({ items }) {
     const total = items.reduce((sum, item) => sum + item.price, 0);

     return (
       <div>
         <h2>Cart ({items.length} items)</h2>
         {items.length === 0 && <p>Your cart is empty</p>}
         <ul>
           {items.map((item, index) => (
             <li key={index}>{item.name} — ${item.price}</li>
           ))}
         </ul>
         <p><strong>Total: ${total}</strong></p>
       </div>
     );
   }

   export default Cart;
   ```

6. Update `src/App.jsx`:
   ```jsx
   import { useState } from 'react';
   import { products } from './data';
   import ProductCard from './ProductCard';
   import Cart from './Cart';

   function App() {
     const [cart, setCart] = useState([]);

     function addToCart(product) {
       setCart(prev => [...prev, product]);
     }

     return (
       <div>
         <h1>Mini Cart</h1>
         <div style={{ display: 'flex' }}>
           <div style={{ flex: 2 }}>
             <h2>Products</h2>
             {products.map(product => (
               <ProductCard
                 key={product.id}
                 product={product}
                 onAddToCart={addToCart}
               />
             ))}
           </div>
           <div style={{ flex: 1 }}>
             <Cart items={cart} />
           </div>
         </div>
       </div>
     );
   }

   export default App;
   ```

7. Run `npm run dev` and test adding items to the cart.

## Try It Yourself

1. **Easy:** Add a "Clear Cart" button that resets the cart to empty.

2. **Medium:** Show the number of each item in the cart (e.g., "Laptop x2") instead of listing duplicates.

3. **Challenge:** Add a "Remove" button next to each cart item that removes just one instance of that item.

## Common Mistakes & How to Fix Them

- **Cart shows empty after adding** — You're not using the functional form: use `setCart(prev => [...prev, item])` instead of `setCart(cart + item)`
- **Key warning on cart items** — Using array index as key causes issues when items are removed. Use a unique ID instead
- **Component doesn't re-render** — You might be mutating state directly. Always create new arrays/objects for setState

## Recap / Checklist

After today, you should be able to:

- [ ] Break a UI into components before writing code
- [ ] Lift state up to share data between siblings
- [ ] Pass functions as props for child-to-parent communication
- [ ] Build a working mini app from scratch
- [ ] Confidently use state, props, and event handlers together

## Useful Links

- [React: Thinking in React](https://react.dev/learn/thinking-in-react)
- [React: Lifting State Up](https://react.dev/learn/sharing-state-between-components)
- [React: Lists and Keys](https://react.dev/learn/rendering-lists)
