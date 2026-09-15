# Session 12 — Build Routing into Capstone

## What We're Learning Today

Today you'll add real navigation to your capstone project. By the end, users can click between pages, view details, and use the browser's back button.

## Prerequisites

- Sessions 01-11 completed (understand React Router, project structure)
- Capstone project with data fetching working

## Concepts

### 1. Map Your Capstone's Views to Routes

Before coding, plan your routes:

| URL | Component | Purpose |
|-----|-----------|---------|
| `/` | Home | Landing page, featured items |
| `/list` | ItemList | Browse all items |
| `/item/:id` | ItemDetail | Single item view |
| `/about` | About | About the app |
| `*` | NotFound | 404 page |

### 2. Layout Component — Shared UI Across Pages

Create a layout that wraps all pages (header, footer, sidebar):

```jsx
// src/layouts/Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Layout() {
  return (
    <div>
      <Header />
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        <Outlet /> {/* Page content renders here */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
```

### 3. Nested Routes — Keep It Clean

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import ItemList from './pages/ItemList';
import ItemDetail from './pages/ItemDetail';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="list" element={<ItemList />} />
        <Route path="item/:id" element={<ItemDetail />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
```

### 4. Navigation Between Pages

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
```

### 5. Linking from Cards to Details

```jsx
// src/components/ItemCard.jsx
import { Link } from 'react-router-dom';

function ItemCard({ item }) {
  return (
    <div className="item-card">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <Link to={`/item/${item.id}`}>View Details →</Link>
    </div>
  );
}
```

### 6. Back Button and Navigation

```jsx
// src/pages/ItemDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>Item {id}</h1>
      {/* ... rest of detail view */}
    </div>
  );
}
```

### 7. Active Link Styling

```jsx
// NavLink gives you an isActive boolean
<NavLink
  to="/list"
  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
>
  Browse
</NavLink>
```

## Step-by-Step Walkthrough

1. Create a layouts folder:
   ```bash
   mkdir src/layouts
   ```

2. Create `src/layouts/Layout.jsx` (see section 2 above)

3. Create `src/pages/NotFound.jsx`:
   ```jsx
   import { Link } from 'react-router-dom';

   function NotFound() {
     return (
       <div style={{ textAlign: 'center', padding: '50px' }}>
         <h1>404</h1>
         <p>Page not found</p>
         <Link to="/">Go home</Link>
       </div>
     );
   }

   export default NotFound;
   ```

4. Update your `App.jsx` with the nested routes (see section 3 above)

5. Update your Header to use `<NavLink>` (see section 4 above)

6. Add `<Link>` to your card components to link to detail pages

7. Test all routes — make sure back button works, direct URL access works, and 404 works for unknown paths

## Try It Yourself

1. **Easy:** Add a "Go Home" link to your 404 page that uses `<Link to="/">`.

2. **Medium:** Create a `/search` route with a search input. When you submit, navigate to `/search?q=term` and display results.

3. **Challenge:** Add a breadcrumb component that shows the current path (e.g., Home > Movies > Inception).

## Common Mistakes & How to Fix Them

- **Routes don't render** — Check that `<BrowserRouter>` wraps your `<App>` in `main.jsx`
- **404 on page refresh in production** — Need server-side redirect to index.html (covered in deployment session)
- **Nested routes don't show** — You forgot `<Outlet />` in the parent layout component
- **Navigation feels slow** — You might be doing data fetching in the component. Move it to useEffect or use a loading state

## Recap / Checklist

After today, you should be able to:

- [ ] Map views to routes in your capstone
- [ ] Create a layout component with shared UI
- [ ] Use nested routes for clean organization
- [ ] Link between pages with `<Link>` and `<NavLink>`
- [ ] Read URL parameters in detail pages
- [ ] Navigate programmatically with `useNavigate`
- [ ] Handle 404 pages with catch-all routes

## Useful Links

- [React Router: Layout Routes](https://reactrouter.com/en/main/start/tutorial#layout-routes)
- [React Router: Dynamic Segments](https://reactrouter.com/en/main/start/tutorial#dynamic-segments)
