---
theme: default
title: "Session 11 - Project Architecture"
info: |
  Folder structure, presentational vs container components,
  environment variables, Vite base config, and an API layer.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Project Architecture

Rules for code that has to keep growing.

<br>

### React SPA Course - Session 11

---

# Today's Goals

<br>

- Folder structure — by type vs by feature
- Presentational vs container components
- Environment variables — keys out of the source
- Vite `base` — ready for GitHub Pages
- An API layer — one place for every fetch
- Constants instead of magic values

---

# Where We Left Off

Session 10 added routes. `App.jsx` is starting to grow:

```text
src/
├── App.jsx        ← routes + header + logic, all in one
├── Header.jsx
├── Home.jsx
└── About.jsx
```

Next week it gets Context, an API layer, and styles.

> 💡 Structure is cheap now and expensive later. Today we set the rules.

---
layout: center
---

# 1. Folder Structure

Where does each file live?

---

# By Type — Good for Small Apps

```text
src/
├── components/   Header.jsx, Card.jsx
├── pages/        Home.jsx, About.jsx
├── hooks/        useFetch.js
├── api/          products.js
├── utils/        helpers.js
└── App.jsx
```

- Group by **what the file is**
- Easy to find, easy to teach

---

# By Feature — Better for Larger Apps

```text
src/
├── features/
│   ├── products/  ProductCard.jsx
│   │             ProductList.jsx  useProducts.js
│   └── auth/      LoginForm.jsx   useAuth.js
├── components/    Header.jsx, Button.jsx
└── App.jsx
```

- Group by **what the file is for**
- A change to "products" stays in one folder

---

# Which One?

| Situation | Use |
|---|---|
| < 15 screens | by type |
| shared UI everywhere | by type |
| features with their own logic | by feature |
| several people, big app | by feature |

<br>

- Either beats a flat pile of files
- Mixed structure is normal: `features/` + shared `components/`

> 💡 Rule: if only one feature uses it, it lives in that feature's folder.

---
layout: center
---

# 2. Presentational vs Container

How it looks vs how it works.

---

# The Split

| | Presentational | Container |
|---|---|---|
| Job | render UI | own logic |
| Props in | data, callbacks | — |
| State | none | yes |
| Example | `<ProductCard />` | `<ProductList />` |

<br>

- Presentational: dumb, reusable, easy to test
- Container: fetches, decides, hands data down

> 💡 A component that both fetches **and** renders is doing two jobs.

---

# Presentational Example

```jsx
// ProductCard.jsx — just renders what it's given
function ProductCard({ title, price, image }) {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{price}</p>
    </div>
  );
}
export default ProductCard;
```

- No fetch, no `useEffect`, no business rules
- Props in, JSX out

---

# Container Example

```jsx
// ProductList.jsx — fetches, then renders
function ProductList() {
  const { data, loading, error } = useFetch(API_URL + '/products');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return data.map(p => <ProductCard key={p.id} {...p} />);
}
export default ProductList;
```

- Owns the request and the states
- Renders presentational children

---
layout: center
---

# 3. Environment Variables

Secrets don't belong in source.

---

# .env + import.meta.env

```bash
# .env — local only, never committed
VITE_API_URL=https://api.example.com
VITE_API_KEY=abc123
```

```jsx
// src/api/products.js
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
```

- Only `VITE_` prefixed vars reach the code
- Restart the dev server after editing `.env`

---

# Env Var Rules

- `VITE_` prefix — Vite hides anything else
- `.env` in `.gitignore` — never commit secrets
- `.env.example` committed — keys empty, names documented
- Change `.env` → restart `npm run dev`

```text
.env          ← gitignored
.env.example  ← committed
```

> 💡 A key in a committed file is a leaked key, even if you delete it later.

---
layout: center
---

# 4. Vite Config for GitHub Pages

Deploys break on one small setting.

---

# The `base` Option

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/my-repo-name/',
});
```

```text
site at  user.github.io/my-repo/
config   base: '/my-repo/'

custom domain?   base: '/'
```

- Every asset URL gets that prefix
- Wrong base → blank page, 404s in prod

> 💡 Set it before Session 19, not during the deploy panic.

---
layout: center
---

# 5. API Layer

Scattered `fetch` calls rot fast.

---

# One File, Every Endpoint

```js
// src/api/products.js
const API_URL = import.meta.env.VITE_API_URL;

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}
```

```jsx
// components only see functions
const { data } = useFetch('/products'); // or getProducts()
```

---

# Why Bother

- One place to change when the API moves
- Errors handled in one spot, not ten
- Components never see URLs or keys
- Caching / retries get added later, centrally

```text
components  →  api/  →  network
   UI         URLs, keys,
              error handling
```

> 💡 If `fetch(` appears in a component, it belongs in `api/`.

---
layout: center
---

# 6. Constants, Not Magic Values

---

# Name the Numbers

```jsx
// ❌ what does this mean?
if (status === 200) { /* ... */ }
setTimeout(refresh, 5000);
```

```jsx
// ✅ self-documenting
const STATUS_OK = 200;
const REFRESH_INTERVAL_MS = 5000;

if (status === STATUS_OK) { /* ... */ }
setTimeout(refresh, REFRESH_INTERVAL_MS);
```

- One edit when the value changes
- Reads like a sentence in review

> 💡 If a literal appears twice, name it once.

---
layout: center
---

# Hands-On Time

Reorganize your capstone. Five steps.

---

# Step 1: Folders + Env

```bash
mkdir -p src/pages src/api src/utils
```

```text
src/
├── pages/      ← route-level components
├── api/        ← fetch functions
├── components/ ← reusable UI
├── hooks/      ← custom hooks
└── utils/      ← pure helpers
```

Create `.env` and `.env.example`, then add `.env` to `.gitignore`.

---

# Step 2: API Layer

```js
// src/api/products.js
const API_URL = import.meta.env.VITE_API_URL;

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}
```

Move every `fetch(` out of your components into `src/api/`.

---

# Step 3: Split the Fat Component

```text
before:  ProductPage.jsx  = fetch + loading + list + card markup

after:   pages/ProductPage.jsx  → container, fetch + states
         components/ProductCard.jsx → presentational
```

- Container gets data, card renders it
- Update import paths after moving files

---

# Run It

- `npm run dev`
- ✅ App behaves exactly as before — no visual change
- ✅ No `fetch(` left in components (`Ctrl+Shift+F` to check)
- ✅ `.env` read via `import.meta.env`, server restarted
- ✅ Console free of errors

<br>

> 💡 Architecture refactors should be invisible to users.

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your own capstone.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Move your API key into `.env`, read it with `import.meta.env`. |
| 🟡 Medium | Move every fetch into `src/api/`, components import from there. |
| 🔴 Challenge | `useProducts.js` hook wrapping the API → `{ items, loading, error }`. |

<br>

**Bonus:** `.env.example` committed with empty values.

> 💡 Medium is the real win — do it before adding more features.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| `undefined` from `import.meta.env` | Restart dev server; check the `VITE_` prefix |
| Key visible in the bundle | Vite embeds env vars — secrets need a proxy |
| Deployed site: blank / 404 | `base` in `vite.config.js` ≠ repo name |
| Broken imports after moving | Update every import path (`Ctrl+Shift+F`) |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Choose by-type or by-feature folders
- [ ] Split presentational and container components
- [ ] Keep secrets in `.env`, read with `import.meta.env`
- [ ] Configure Vite `base` for GitHub Pages
- [ ] Centralize fetches in an `api/` layer
- [ ] Replace magic values with named constants

<br>

### Next Session

**Session 12 — Build Routing into Your Capstone** — practice day.

---
layout: center
---

# Questions?

### Useful Links

- [Vite: Env Variables](https://vitejs.dev/guide/env-and-mode)
- [Vite: Base URL](https://vitejs.dev/config/shared-options.html#base)
- [React: Thinking in React](https://react.dev/learn/thinking-in-react)
