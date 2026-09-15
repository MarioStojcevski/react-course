# Session 11 — Project Architecture

## What We're Learning Today

As your app grows, you need rules for organizing code. Today covers folder structure, presentational vs container components, environment variables, and configuring Vite for deployment.

## Prerequisites

- Sessions 01-10 completed (understand routing, components, state)
- Capstone project with basic routing

## Concepts

### 1. Folder Structure — Organize by Feature

There are two common approaches:

**By type (good for small apps):**
```
src/
├── components/
│   ├── Header.jsx
│   ├── Button.jsx
│   └── Card.jsx
├── pages/
│   ├── Home.jsx
│   └── About.jsx
├── hooks/
│   ├── useFetch.js
│   └── useLocalStorage.js
├── utils/
│   └── helpers.js
└── App.jsx
```

**By feature (better for larger apps):**
```
src/
├── features/
│   ├── movies/
│   │   ├── MovieCard.jsx
│   │   ├── MovieList.jsx
│   │   ├── MovieDetail.jsx
│   │   └── useMovies.js
│   └── auth/
│       ├── LoginForm.jsx
│       ├── SignupForm.jsx
│       └── useAuth.js
├── components/
│   ├── Header.jsx
│   └── Button.jsx
└── App.jsx
```

**Rule:** If a file is only used by one feature, put it in that feature's folder.

### 2. Presentational vs Container Components

| | Presentational | Container |
|---|---|---|
| **Job** | How things look | How things work |
| **Props** | Data, callbacks | State, logic |
| **State** | None | Yes |
| **Example** | `<Button onClick={...}>` | `<LoginForm onSubmit={...}>` |

**Presentational component:**
```jsx
// UserCard.jsx — just renders UI
function UserCard({ name, email, avatar }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}
```

**Container component:**
```jsx
// UserListContainer.jsx — fetches data, manages state
function UserListContainer() {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} {...user} />
      ))}
    </div>
  );
}
```

### 3. Environment Variables — Secrets and Config

Never hardcode API keys or URLs. Use environment variables:

```bash
# .env (local, never committed to git)
VITE_API_URL=https://api.themoviedb.org/3
VITE_API_KEY=your_secret_key_here
```

```jsx
// Access in your code with import.meta.env
const response = await fetch(
  `${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}`
);
```

**Rules:**
- Variables MUST start with `VITE_` (Vite won't expose others)
- Add `.env` to `.gitignore` — never commit secrets
- Restart the dev server after changing `.env`
- Use `.env.example` (no values) to show what's needed

### 4. Vite Config for GitHub Pages

When deploying to GitHub Pages, Vite needs to know the base path:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/my-repo-name/', // GitHub Pages serves from /repo-name/
});
```

**How to find your base:**
- If your site is at `https://username.github.io/my-repo/`, set `base: '/my-repo/'`
- If using a custom domain, set `base: '/'`

### 5. API Layer — Centralize Your Fetch Calls

Don't scatter `fetch` calls everywhere. Create a dedicated API layer:

```javascript
// src/api/movies.js
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export async function getPopularMovies() {
  const response = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}`);
  if (!response.ok) throw new Error('Failed to fetch movies');
  return response.json();
}

export async function getMovieDetails(id) {
  const response = await fetch(`${API_URL}/movie/${id}?api_key=${API_KEY}`);
  if (!response.ok) throw new Error('Failed to fetch movie');
  return response.json();
}

export async function searchMovies(query) {
  const response = await fetch(
    `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error('Failed to search movies');
  return response.json();
}
```

**Benefits:**
- One place to change if the API changes
- Easy to add caching, retry logic, or request cancellation
- Components don't need to know about URLs or API keys

### 6. Constants vs Magic Values

```jsx
// ❌ Magic values — hard to maintain
if (status === 200) { ... }
const color = '#3b82f6';
setTimeout(() => {}, 5000);

// ✅ Named constants — self-documenting
const STATUS_OK = 200;
const PRIMARY_COLOR = '#3b82f6';
const DEBOUNCE_DELAY = 5000;
```

## Step-by-Step Walkthrough

1. Create the folder structure in your capstone:
   ```bash
   mkdir src/components src/pages src/hooks src/api src/utils
   ```

2. Create `.env` in your project root:
   ```
   VITE_API_URL=https://api.themoviedb.org/3
   VITE_API_KEY=your_key_here
   ```

3. Create `.env.example` (no secrets):
   ```
   VITE_API_URL=
   VITE_API_KEY=
   ```

4. Add `.env` to `.gitignore`:
   ```
   .env
   .env.local
   ```

5. Create `src/api/movies.js` with your API functions (see section 5 above).

6. Update components to use the API layer instead of direct fetch calls.

7. Update `vite.config.js` with the correct `base` for GitHub Pages.

## Try It Yourself

1. **Easy:** Create a `.env` file with your API key. Access it from a component using `import.meta.env.VITE_API_KEY`.

2. **Medium:** Move all fetch calls from your components into an `api/` folder. Update components to import from there.

3. **Challenge:** Create a `useMovies.js` custom hook that wraps your API calls and returns `{ movies, loading, error }`.

## Common Mistakes & How to Fix Them

- **"API key is undefined"** — You forgot to restart the dev server after adding `.env`
- **API key visible in browser** — Environment variables in Vite are embedded in the client bundle. For truly secret keys, you need a backend proxy
- **Build works but deployed site shows 404** — Your `base` in vite.config.js doesn't match your GitHub repo name
- **Import path errors after reorganizing** — Update all import paths when you move files

## Recap / Checklist

After today, you should be able to:

- [ ] Choose a folder structure for your project
- [ ] Separate presentational and container components
- [ ] Use environment variables for API keys and config
- [ ] Configure Vite's `base` for GitHub Pages deployment
- [ ] Create an API layer to centralize fetch calls
- [ ] Use constants instead of magic values

## Useful Links

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode)
- [Vite: Base URL](https://vitejs.dev/config/shared-options.html#base)
- [React Project Structure Best Practices](https://react.dev/learn/start-a-new-react-project#consider-using-a-framework)
