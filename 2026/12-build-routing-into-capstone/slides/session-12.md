---
theme: default
title: "Session 12 - Build Routing into Capstone"
info: |
  Practice day: plan your routes, add a layout, wire nav links,
  detail pages and 404s into your own capstone project.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Build Routing into Capstone

Your project. Real URLs. Today.

<br>

### React SPA Course - Session 12

---

# Today's Goals

<br>

- Plan your routes **before** writing them
- One `Layout` for header, main, footer
- Nested routes with `<Outlet />`
- `NavLink` in the header, `Link` on every card
- Detail pages from URL params + `useNavigate(-1)`
- No new concepts — Sessions 10 + 11 combined

---

# Where We Left Off

- Session 10: routes, links, params — in a throwaway demo
- Session 11: folders, `api/`, `.env` — in your capstone

Today both land in the app you keep:

```text
selected state  →  /item/:id URL
<Card onClick>  →  <Link to>
conditional UI  →  <Routes>
```

> 💡 Nothing new. The hard part is applying it to **your** codebase.

---
layout: center
---

# 1. Plan Your Routes

Five minutes of mapping saves an hour of rewiring.

---

# Map Views to URLs

| URL | Component | Purpose |
|---|---|---|
| `/` | Home | landing, featured |
| `/list` | ItemList | browse everything |
| `/item/:id` | ItemDetail | single item |
| `/about` | About | about the app |
| `*` | NotFound | 404 |

<br>

- Write this table for **your** capstone first
- Every view you built in Session 09 becomes a route

> 💡 If it isn't in the table, it isn't a page yet.

---

# What "Done" Looks Like

Verify each one in the browser:

1. Nav links switch pages — no reload
2. Back button returns to the previous page
3. A card links to its detail URL (`/item/42`)
4. Refreshing a detail URL still works
5. Unknown URL shows your 404 page
6. Active nav link is highlighted

<br>

> 💡 Six checks. Don't move on until each passes.

---
layout: center
---

# 2. The Layout

Header and footer once, not on every page.

---

# Layout with Outlet

```jsx
// src/layouts/Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Layout() {
  return (
    <div>
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
export default Layout;
```

- `<Outlet />` is where the current page renders
- Header never unmounts — nav state survives

---

# Nested Routes

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import ItemList from './pages/ItemList';
import ItemDetail from './pages/ItemDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="list" element={<ItemList />} />
        <Route path="item/:id" element={<ItemDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
export default App;
```

- Child paths are **relative**: `"list"`, not `"/list"`
- `index` = the parent's exact path

---
layout: center
---

# 3. Navigation

Links in the header, links on the cards.

---

# Header with NavLink

```jsx
// src/components/Header.jsx
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/list">Browse</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
    </header>
  );
}
export default Header;
```

```jsx
// active state
className={({ isActive }) => isActive ? 'active' : ''}
```

---

# Cards Link to Details

```jsx
// src/components/ItemCard.jsx
import { Link } from 'react-router-dom';

function ItemCard({ item }) {
  return (
    <div className={styles.card}>
      <img src={item.image} alt={item.title} />
      <h3>{item.title}</h3>
      <Link to={`/item/${item.id}`}>View details →</Link>
    </div>
  );
}
export default ItemCard;
```

- Replaces `onSelect={setSelected}` from Session 09
- The URL carries which item is open

---

# Detail Page + Back Button

```jsx
// src/pages/ItemDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, loading, error } = useFetch(`${API_URL}/items/${id}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <article>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{item.title}</h1>
    </article>
  );
}
```

---
layout: center
---

# 4. Build It

Six steps, then the checklist.

---

# Step 1: Folders

```bash
mkdir -p src/layouts src/pages
```

```text
src/
├── layouts/Layout.jsx   ← step 2
├── pages/Home.jsx
├── pages/ItemList.jsx   ← today's list view
├── pages/ItemDetail.jsx ← step 5
├── pages/NotFound.jsx   ← step 3
├── components/Header.jsx
└── App.jsx              ← step 4
```

Move existing views into `pages/`, one component per file.

---

# Step 2: Layout.jsx

Create `src/layouts/Layout.jsx` from the earlier slide.

- `<Header />` on top, `<Footer />` at the bottom
- `<Outlet />` in the middle

---

# Step 3: NotFound.jsx

```jsx
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className={styles.center}>
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/">Go home</Link>
    </div>
  );
}
export default NotFound;
```

---

# Step 4: App.jsx

- Wrap everything in the `Layout` route
- Child routes: `index`, `list`, `item/:id`, `*`
- Paths relative to `/`

```jsx
<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />
  <Route path="item/:id" element={<ItemDetail />} />
  <Route path="*" element={<NotFound />} />
</Route>
```

---

# Step 5: Header + Card Links

- `Header` → `<NavLink>` for each nav item
- `ItemCard` → `<Link to={`/item/${item.id}`}>`
- Detail page → `useParams()` + `useNavigate(-1)`

<br>

Replace the last `useState`-based view toggle you have left.

---

# Step 6: Verify

- `npm run dev`
- ✅ Every nav link switches pages, no reload
- ✅ Card → detail URL → Back → list intact
- ✅ Refresh on a detail URL still renders
- ✅ `/garbage` shows your 404 page
- ✅ Active link highlights in the nav

<br>

> 💡 Refresh and direct URLs are the two checks students skip. Don't skip them.

---

# Now Make It Yours

The scaffold is generic — swap in your domain:

```jsx
// your routes, your names
<Route path="product/:id" element={<ProductDetail />} />
<Route path="category/:name" element={<Category />} />

// your card, your fields
<Link to={`/product/${p.id}`}>{p.name}</Link>
```

- Route paths should read like your domain
- Field names come from **your** API

> 💡 If a route name confuses you, it will confuse users too.

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

Build on your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | 404 page with `<Link to="/">` back home. |
| 🟡 Medium | `/search` page → submit navigates to `/search?q=term`, show results. |
| 🔴 Challenge | Breadcrumbs: Home > Category > Item, built from the URL. |

<br>

**Bonus:** highlight the active category in your nav.

> 💡 Easy before Medium. Check the address bar after every click.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| Blank screen, no routes | `BrowserRouter` missing in `main.jsx` |
| Child route never renders | Parent layout has no `<Outlet />` |
| Detail fetches nothing | `useParams()` key ≠ the `:param` name |
| Page reloads on nav | `<a href>` left in the header or card |
| 404 on refresh (prod) | Server redirect — Session 19 |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Planned a route table for my capstone
- [ ] Created a `Layout` with shared header/footer
- [ ] Wired nested routes with `<Outlet />`
- [ ] Linked cards to detail pages with `Link`
- [ ] Read URL params and used `navigate(-1)`
- [ ] Added a 404 with a catch-all route
- [ ] Verified refresh, back button, direct URLs

<br>

### Next Session

**Session 13 — Context API & useReducer** — state that outlives one page.

---
layout: center
---

# Questions?

### Useful Links

- [React Router: Layout Routes](https://reactrouter.com/en/main/start/tutorial#layout-routes)
- [React Router: Dynamic Segments](https://reactrouter.com/en/main/start/tutorial#dynamic-segments)
- [React: Passing Data Deeply](https://react.dev/learn/passing-data-deeply-with-context)
