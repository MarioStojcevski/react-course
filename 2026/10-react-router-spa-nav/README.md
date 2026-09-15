# Session 10 — React Router / SPA Nav

## What We're Learning Today

Single Page Applications don't load new pages — they swap components in and out. React Router is the standard way to handle navigation in React. Today we learn routes, links, nested routes, and dynamic URLs.

## Prerequisites

- Sessions 01-09 completed
- Capstone project with at least a list and detail view

## Concepts

### 1. What Is SPA Navigation?

In a traditional website, clicking a link loads a whole new HTML page. In an SPA:
- Only ONE HTML page loads (index.html)
- React swaps which components are visible
- The URL changes (so the back button works)
- No full page reload — instant navigation

### 2. Setting Up React Router

```bash
npm install react-router-dom
```

Wrap your app in a `BrowserRouter`:

```jsx
// src/main.jsx
import { BrowserRouter } from 'react-router-dom';
import App from './App';

function Main() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default Main;
```

### 3. Routes — Map URLs to Components

```jsx
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
```

**`path="*"` is a catch-all** — matches any URL not matched above. Use it for 404 pages.

### 4. Link & NavLink — Navigation Without Reloads

```jsx
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <nav>
      {/* Basic link */}
      <Link to="/">Home</Link>

      {/* NavLink adds an "active" class when the URL matches */}
      <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
        About
      </NavLink>
    </nav>
  );
}
```

**Never use `<a href="/">`** — that triggers a full page reload. Always use `<Link>`.

### 5. Dynamic Routes — URL Parameters

When you need IDs or slugs in the URL:

```jsx
// Define the route with a :param
<Route path="/movies/:id" element={<MovieDetail />} />

// In the component, read the param
import { useParams } from 'react-router-dom';

function MovieDetail() {
  const { id } = useParams();
  // Use id to fetch movie details
}
```

### 6. useNavigate — Programmatic Navigation

Sometimes you need to navigate in code (after form submit, after login):

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard'); // Redirect after login
    }
  }

  return (/* form JSX */);
}
```

### 7. Nested Routes — Layouts

Routes can be nested to share layouts:

```jsx
function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

// DashboardLayout renders an Outlet where child routes appear
function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet /> {/* Child route renders here */}
      </main>
    </div>
  );
}
```

### 8. Reading Query Parameters

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div>
      <p>Results for: {query}</p>
      <button onClick={() => setSearchParams({ q: 'new search' })}>
        Search something else
      </button>
    </div>
  );
}

// URL: /search?q=react
```

## Step-by-Step Walkthrough

1. Install React Router in your capstone:
   ```bash
   npm install react-router-dom
   ```

2. Update `src/main.jsx`:
   ```jsx
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

3. Create a simple header with navigation:
   ```jsx
   // src/components/Header.jsx
   import { NavLink } from 'react-router-dom';
   import styles from './Header.module.css';

   function Header() {
     return (
       <header className={styles.header}>
         <nav>
           <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>
             Home
           </NavLink>
           <NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ''}>
             About
           </NavLink>
         </nav>
       </header>
     );
   }

   export default Header;
   ```

4. Set up routes in `App.jsx`:
   ```jsx
   import { Routes, Route } from 'react-router-dom';
   import Header from './components/Header';
   import Home from './pages/Home';
   import About from './pages/About';

   function App() {
     return (
       <div>
         <Header />
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/about" element={<About />} />
         </Routes>
       </div>
     );
   }

   export default App;
   ```

5. Run `npm run dev` and test navigation between pages.

## Try It Yourself

1. **Easy:** Add a "Not Found" page that shows when someone visits an unknown URL.

2. **Medium:** Create a `/movies/:id` route that fetches and displays movie details using the ID from the URL.

3. **Challenge:** Add a search page at `/search?q=term` that reads the query parameter and fetches results.

## Common Mistakes & How to Fix Them

- **Page reloads on navigation** — You used `<a href>` instead of `<Link to>`
- **"Cannot read property of undefined"** — Your route param might not exist yet. Check the URL matches your route pattern
- **404 on refresh in production** — SPA routing needs server config to redirect all routes to index.html (we'll cover this in deployment)
- **Multiple Router errors** — You have `BrowserRouter` in more than one place. Keep it only in `main.jsx`

## Recap / Checklist

After today, you should be able to:

- [ ] Set up React Router in a project
- [ ] Define routes and map URLs to components
- [ ] Use `<Link>` and `<NavLink>` for navigation
- [ ] Read dynamic URL parameters with `useParams`
- [ ] Navigate programmatically with `useNavigate`
- [ ] Create nested routes with `<Outlet>`
- [ ] Read and set query parameters

## Useful Links

- [React Router Documentation](https://reactrouter.com/en/main)
- [React Router: Getting Started](https://reactrouter.com/en/main/start/tutorial)
- [MDN: URL API](https://developer.mozilla.org/en-US/docs/Web/API/URL_API)
