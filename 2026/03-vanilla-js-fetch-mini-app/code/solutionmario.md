# Session 03 — Vanilla JS + Fetch Mini-App

## What We're Learning Today

Before we learn React, we're going to build a small app with plain JavaScript that fetches data from an API and displays it. This will show us the pain of doing it manually — so when we see React tomorrow, we'll understand *why* it exists.

**API we're using:** [DummyJSON](https://dummyjson.com) — free, no API key, CORS-friendly, 100+ products.

## Prerequisites

- Sessions 01-02 completed (understand HTTP, DOM, async/await, fetch)
- Node.js installed

## Concepts

### 1. The Goal

We'll build a tiny app that:
1. Fetches a list of products from DummyJSON
2. Creates HTML elements for each product
3. Appends them to the page

All with vanilla JavaScript. No frameworks, no libraries.

### 2. The API We're Using

[DummyJSON](https://dummyjson.com/products) returns 100+ products with:
- `id`, `title`, `description`, `price`, `discountPercentage`
- `thumbnail`, `images[]`
- `category`, `brand`, `rating`, `stock`
- `tags[]`

```javascript
const response = await fetch('https://dummyjson.com/products?limit=10');
const data = await response.json();
// data.products = array of 10 product objects
```

### 3. Creating Elements with JavaScript

Instead of writing HTML by hand, we create elements in JS:

```javascript
// Create a heading
const heading = document.createElement('h1');
heading.textContent = 'Products';

// Create a card
const card = document.createElement('div');
card.className = 'product-card';
card.innerHTML = `
  <img src="${product.thumbnail}" alt="${product.title}">
  <h3>${product.title}</h3>
  <p>$${product.price}</p>
`;

// Put it all together
document.body.appendChild(heading);
document.getElementById('app').appendChild(card);
```

### 4. Building the App — Step by Step

Here's the full vanilla JS app we'll build:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Store - Vanilla JS</title>
    <style>
      body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
      .product { display: flex; gap: 16px; padding: 16px; border-bottom: 1px solid #eee; }
      .product img { width: 100px; height: 100px; object-fit: cover; border-radius: 4px; }
      .product h3 { margin: 0 0 4px; }
      .product .price { color: #2c7a2c; font-weight: bold; font-size: 1.2em; }
      .product .old-price { text-decoration: line-through; color: #999; }
      .error { color: red; }
      .loading { color: gray; }
    </style>
  </head>
  <body>
    <h1>Store</h1>
    <div id="app"></div>

    <script>
      async function loadProducts() {
        const app = document.getElementById('app');

        // Show loading state
        app.innerHTML = '<p class="loading">Loading...</p>';

        try {
          const response = await fetch('https://dummyjson.com/products?limit=10');
          const data = await response.json();

          // Clear loading message
          app.innerHTML = '';

          // Create a card for each product
          data.products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
              <img src="${product.thumbnail}" alt="${product.title}">
              <div>
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <span class="price">$${product.price}</span>
                <span class="old-price">$${Math.round(product.price / (1 - product.discountPercentage / 100))}</span>
              </div>
            `;
            app.appendChild(div);
          });
        } catch (error) {
          app.innerHTML = '<p class="error">Failed to load products.</p>';
        }
      }

      loadProducts();
    </script>
  </body>
</html>
```

### 5. The Three States Every Data Fetch Has

Every time you fetch data, three things can happen:

| State | What to show |
|-------|-------------|
| **Loading** | Spinner, skeleton, "Loading..." text |
| **Success** | The actual data |
| **Error** | Error message, retry button |

This pattern appears in every React app. We're learning it now in plain JS so it's familiar later.

### 6. Why This Is Painful (And Why React Exists)

Notice what we're doing:
- Manually creating each element with `document.createElement`
- Manually setting properties with `.textContent` and `.innerHTML`
- Manually appending with `.appendChild`
- Manually handling loading/error states by swapping `innerHTML`

**The problems:**
- If data changes, we have to tear down and rebuild everything manually
- No way to "update" just one part of the UI
- Getting complex (nested elements, lists, conditionals) becomes a nightmare
- No reuse — this code only works for products

React solves all of this. Tomorrow you'll see how.

## Step-by-Step Walkthrough

1. Open `code/products.html` in your browser
2. You should see 10 products loaded from DummyJSON
3. Open DevTools → Network tab → see the request
4. Now disconnect your internet and refresh — see the error state

## Try It Yourself

1. **Easy:** Change `?limit=10` to `?limit=5` to show fewer products.

2. **Medium:** Add a search box that filters products by title as you type. (Hint: Listen to the `input` event and filter the array.)

3. **Challenge:** Fetch categories from `https://dummyjson.com/products/categories` and add a dropdown to filter by category. When a category is selected, fetch only products from that category.

## Common Mistakes & How to Fix Them

- **"CORS error"** — DummyJSON allows CORS, so this shouldn't happen. If it does, check the URL.
- **"app is null"** — Your script ran before the DOM loaded. Put `<script>` at the end of `<body>` or use `defer`
- **Nothing shows up** — Open DevTools Console. There's probably an error message. Read it.
- **Data looks like `[object Object]`** — You're calling `.toString()` on an object. Use `JSON.stringify()` or access a specific property like `product.title`

## Recap / Checklist

After today, you should be able to:

- [ ] Fetch data from a public API using async/await
- [ ] Create and append DOM elements with JavaScript
- [ ] Handle loading, success, and error states
- [ ] Explain why manual DOM manipulation is tedious (this is why React exists)
- [ ] Use DevTools Network tab to inspect API requests

## Useful Links

- [DummyJSON](https://dummyjson.com)
- [DummyJSON Products](https://dummyjson.com/products)
- [MDN: Document.createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
