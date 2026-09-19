---
theme: default
title: "Session 03 - Vanilla JS Fetch Mini-App"
info: |
  Build a real app with plain JavaScript and an API.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Vanilla JS Fetch Mini-App

Build a store app with plain JavaScript. See why React exists.

<br>

### React SPA Course - Session 03

---

# Today's Goals

<br>

- Fetch data from DummyJSON API
- Create DOM elements dynamically
- Handle loading, success, error states
- Build a search/filter feature
- Feel the pain of manual DOM manipulation

---

# The API We're Using

<br>

**DummyJSON** — free, no API key, CORS-friendly

| Endpoint | Returns |
|---|---|
| `/products` | 100+ products |
| `/products/:id` | Single product |
| `/products/categories` | All categories |
| `/products/category/:name` | Filter by category |

<br>

### Let's explore it

Open **dummyjson.com/products** in your browser

---

# The Goal

<br>

Build a store app that:
1. Fetches products from DummyJSON
2. Creates HTML for each product
3. Appends them to the page
4. Lets users search/filter

<br>

All with vanilla JavaScript. No React yet.

---

# Step 1: Fetch Data

<br>

```js
const response = await fetch('https://dummyjson.com/products?limit=10');
const data = await response.json();

console.log(data.products);
// Array of 10 product objects
```

<br>

Each product has: `title`, `description`, `price`, `discountPercentage`, `thumbnail`, `category`, `rating`

---

# Step 2: Create Elements

<br>

```js
// Create a card
const div = document.createElement('div');
div.className = 'product';

div.innerHTML = `
  <img src="${product.thumbnail}" alt="${product.title}">
  <h3>${product.title}</h3>
  <p>${product.description}</p>
  <span>$${product.price}</span>
`;

// Append to page
document.getElementById('app').appendChild(div);
```

---

# Step 3: Loading States

Every data fetch has 3 states: Loading, Success, Error

```js
app.innerHTML = '<p>Loading...</p>';
try {
  const data = await fetchProducts();
  app.innerHTML = renderProducts(data);
} catch (error) {
  app.innerHTML = '<p>Failed to load.</p>';
}
```

---

# Step 4: Search/Filter

<br>

```js
// Listen to input events
searchBox.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(query)
  );

  renderProducts(filtered);
});
```

---

# The Full App

<br>

Open `code/products.html` in your browser

- 20 products loaded from DummyJSON
- Product cards with image, price, discount, category
- Search box that filters by title/description/category
- Loading and error states

---

# Why This Is Painful

<br>

Notice what we're doing:
- Creating each element with `createElement`
- Setting properties with `.innerHTML`
- Appending with `.appendChild`
- Swapping `innerHTML` for loading states

<br>

**The problems:**
- Data changes? Tear down and rebuild everything
- No way to update just one part
- Complex UI = nightmare
- No reuse — only works for products

---

# React Solves This

<br>

Instead of manually building DOM:

```js
// React equivalent (preview)
function ProductList({ products }) {
  return (
    <div>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
```

<br>

React updates only what changed. No manual DOM work.

You'll learn this in Session 04.

---

# Recap

<br>

- [ ] Fetch data from DummyJSON API
- [ ] Create and append DOM elements
- [ ] Handle loading, success, error states
- [ ] Build search/filter functionality
- [ ] Feel the pain of manual DOM manipulation

<br>

### Tomorrow: React intro — no more manual DOM!

---

# Try It Yourself

<br>

1. **Easy:** Change `?limit=10` to `?limit=5`

2. **Medium:** Add a category filter dropdown

3. **Challenge:** Fetch from `/products/category/smartphones`

<br>

### Code is in `03-vanilla-js-fetch-mini-app/code/`
