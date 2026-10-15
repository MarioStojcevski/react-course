---
theme: default
title: "Session 10 - React Router / SPA Nav"
info: |
  SPA navigation, routes, Link/NavLink, URL params,
  useNavigate, nested routes and query params.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# React Router / SPA Nav

Real URLs. Real pages. No reloads.

<br>

### React SPA Course - Session 10

---

# Today's Goals

<br>

- SPA navigation — what changes vs a normal website
- Setup — `BrowserRouter` in one place
- Routes — map URLs to components
- `Link` / `NavLink` — navigate without reloads
- URL params, `useNavigate`, query params
- Nested routes — shared layouts with `<Outlet />`

---

# Where We Left Off

Session 09 toggled views with a piece of state:

```jsx
const [selected, setSelected] = useState(null);

if (selected) return <Detail item={selected} />;
return <List items={items} onSelect={setSelected} />;
```

It works, but the URL never changes:
- back button exits the app
- you can't share a link to a detail view
- refresh loses your place

> 💡 Routing replaces `selected` state with the **URL**.

---
layout: center
---

# 1. SPA Navigation

One HTML file. The URL still tells the truth.

---

# Two Ways to Change Page

| | Traditional site | SPA |
|---|---|---|
| Click link | browser loads new HTML | React swaps components |
| Server | sends a full page | sends JSON (usually) |
| Reload | yes | no |
| URL | changes | changes too |

<br>

The URL still changes — React Router just handles it in the browser.

> 💡 No reload = instant navigation and state that survives a page switch.

---

# The Router's Job

```text
URL            Router           UI
─────────────────────────────────────
/           →  <Home />       →  home screen
/about      →  <About />      →  about screen
/movies/42  →  <MovieDetail />→  detail for 42
/nope       →  <NotFound />   →  404 screen
```

- One table, checked on every navigation
- Mismatched URL → the `*` (catch-all) route

---
layout: center
---

# 2. Setup

Two files: install, then wrap the app.

---

# Install + Wrap

```bash
npm install react-router-dom
```

```jsx
// src/main.jsx
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

function Main() {
  return (
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}
export default Main;
```

---

# One Router Only

- `BrowserRouter` wraps the **whole** app, once
- It provides the URL context every hook reads from
- Two routers → error: "may be used only in the context of a `<Router>`"

<br>

```jsx
// main.jsx
<BrowserRouter><App /></BrowserRouter>
```

> 💡 If routes don't render, check `main.jsx` first.

---
layout: center
---

# 3. Routes

URL in, component out.

---

# Map URLs to Components

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default App;
```

---

# Route Anatomy

| Prop | Job | Example |
|---|---|---|
| `path` | URL pattern | `"/about"`, `"/movies/:id"` |
| `element` | component to render | `<About />` |
| `path="*"` | catch-all | 404 page |

<br>

- Paths are relative to each other when nested
- `index` = the parent's exact path

> 💡 Always add `path="*"` — unknown URLs deserve a page, not a blank screen.

---
layout: center
---

# 4. Link & NavLink

An `<a href>` throws away the SPA.

---

# Link — Navigate Without Reload

```jsx
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
```

| | `<a href="/about">` | `<Link to="/about">` |
|---|---|---|
| Reloads page | yes | no |
| Keeps state | no | yes |

> 💡 `<a href>` is only right for external sites and asset downloads.

---

# NavLink — Link + Active State

```jsx
import { NavLink } from 'react-router-dom';

<nav>
  <NavLink
    to="/about"
    className={({ isActive }) => (isActive ? 'active' : '')}
  >
    About
  </NavLink>
</nav>
```

- `isActive` is `true` when the URL matches
- The current page highlights itself

> 💡 NavLink = Link with a built-in "am I the current page?" check.

---
layout: center
---

# 5. Dynamic Routes

IDs and slugs live in the URL.

---

# useParams

```jsx
// define the pattern
<Route path="/movies/:id" element={<MovieDetail />} />
```

```jsx
// read the value
import { useParams } from 'react-router-dom';

function MovieDetail() {
  const { id } = useParams(); // "42" from /movies/42
  // fetch and render that movie
}
```

- `:id` is a placeholder — any value matches
- `useParams()` returns strings, even for numbers

---

# Fetch From the Param

```jsx
function MovieDetail() {
  const { id } = useParams();
  const { data: movie, loading, error } =
    useFetch(`https://api.example.com/movies/${id}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h1>{movie.title}</h1>;
}
```

- Same `useFetch` from Session 08 — the URL changes, the hook reacts
- `id` in the URL → new request

> 💡 One component, infinite pages.

---
layout: center
---

# 6. useNavigate

Sometimes navigation is code, not a click.

---

# Navigate in Code

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(user, pass);
    if (ok) navigate('/dashboard');
  }
  return (/* form */);
}
```

```jsx
navigate(-1);        // back button
navigate('/search'); // go somewhere
```

> 💡 After a submit, a redirect is a function call — not a page reload.

---
layout: center
---

# 7. Nested Routes

One layout, many pages inside it.

---

# Layout + Outlet

```jsx
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```

```jsx
function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main><Outlet /></main>
    </div>
  );
}
```

- `<Outlet />` is where the child route renders
- Header and sidebar stay mounted across pages

---
layout: center
---

# 8. Query Params

State that belongs in the URL.

---

# useSearchParams

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q');

  return <p>Results for: {query}</p>;
}
```

```text
/search?q=react   →   query === "react"
```

- Read: `searchParams.get('q')`
- Write: `setSearchParams({ q: 'react' })`

> 💡 A search you can bookmark, share, and reload.

---
layout: center
---

# Hands-On Time

Add routing to a fresh project. Four steps.

---

# Step 1: Project + Router

```bash
npm create vite@latest spa-nav -- --template react
cd spa-nav && npm install
npm install react-router-dom
```

```text
src/
├── main.jsx      ← wrap in BrowserRouter
├── pages/Home.jsx
├── pages/About.jsx
└── App.jsx       ← routes, next step
```

Create `pages/Home.jsx` and `pages/About.jsx` with a heading each.

---

# Step 2: App.jsx

```jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
export default App;
```

---

# Step 3: Header with NavLink

```jsx
// src/Header.jsx
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <nav>
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
        Home
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
        About
      </NavLink>
    </nav>
  );
}
export default Header;
```

Render `<Header />` above `<Routes />` in `App.jsx`.

---

# Run It

- `npm run dev`
- ✅ Click **About** — no reload, content swaps
- ✅ URL reads `/about`, active class highlights
- ✅ Back button returns to `/`
- ✅ Direct visit to `/about` works (refresh too)
- ✅ Console free of errors

<br>

> 💡 Still reloading? You typed `<a href>` somewhere.

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Add a 404 page with `path="*"` and a link back home. |
| 🟡 Medium | `/items/:id` detail route — read the param, show that item. |
| 🔴 Challenge | Search at `/search?q=term` — read the query param, fetch results. |

<br>

**Bonus:** active-state styling on every nav link.

> 💡 Easy before Medium. Verify the URL in the address bar each time.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| Page reloads on click | `<a href>` → `<Link to>` |
| Routes render nothing | `BrowserRouter` missing in `main.jsx` |
| `useParams()` undefined | URL doesn't match the `:param` pattern |
| Nested page missing | Parent layout has no `<Outlet />` |
| 404 on refresh in prod | Server must redirect to `index.html` (Session 19) |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Set up React Router in a project
- [ ] Map URLs to components with `Routes`
- [ ] Navigate with `Link` and `NavLink`
- [ ] Read URL params with `useParams`
- [ ] Redirect in code with `useNavigate`
- [ ] Share layouts with nested routes
- [ ] Read and write query params

<br>

### Next Session

**Session 11 — Project Architecture** — folders, config, and rules that scale.

---
layout: center
---

# Questions?

### Useful Links

- [React Router Docs](https://reactrouter.com/en/main)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [MDN: URL API](https://developer.mozilla.org/en-US/docs/Web/API/URL_API)
