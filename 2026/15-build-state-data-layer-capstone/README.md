# Session 15 — Build State/Data Layer into Capstone

## What We're Learning Today

Today you'll integrate global state management and your API layer into the capstone. By the end, your app should have data flowing from the API through context to your components.

## Prerequisites

- Sessions 01-14 completed
- Capstone project with routing and basic UI

## Concepts

### 1. Plan Your Global State

Decide what needs to be global vs local:

| Global (Context) | Local (useState) |
|------------------|-------------------|
| User authentication | Form inputs |
| Shopping cart | Search query |
| Theme (light/dark) | Modal open/close |
| Language preference | Dropdown expanded |

### 2. Data Flow Architecture

```
API Layer (src/api/)
    ↓
Custom Hooks (src/hooks/)
    ↓
Context (src/context/) ← Global State
    ↓
Components (src/components/, src/pages/)
    ↓
UI
```

### 3. Combining Context + API

```jsx
// src/context/MoviesContext.jsx
import { createContext, useContext, useReducer } from 'react';
import { movies } from '../api/movies';

const MoviesContext = createContext();

function moviesReducer(state, action) {
  switch (action.type) {
    case 'SET_MOVIES':
      return { ...state, movies: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SELECT_MOVIE':
      return { ...state, selectedMovie: action.payload };
    case 'CLEAR_SELECTION':
      return { ...state, selectedMovie: null };
    default:
      return state;
  }
}

export function MoviesProvider({ children }) {
  const [state, dispatch] = useReducer(moviesReducer, {
    movies: [],
    selectedMovie: null,
    loading: false,
    error: null,
  });

  async function fetchPopularMovies() {
    dispatch({ type: 'SET_LOADING' });
    try {
      const data = await movies.getPopular();
      dispatch({ type: 'SET_MOVIES', payload: data.results });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }

  async function searchMovies(query) {
    dispatch({ type: 'SET_LOADING' });
    try {
      const data = await movies.search(query);
      dispatch({ type: 'SET_MOVIES', payload: data.results });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }

  function selectMovie(movie) {
    dispatch({ type: 'SELECT_MOVIE', payload: movie });
  }

  function clearSelection() {
    dispatch({ type: 'CLEAR_SELECTION' });
  }

  return (
    <MoviesContext.Provider
      value={{
        ...state,
        fetchPopularMovies,
        searchMovies,
        selectMovie,
        clearSelection,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error('useMovies must be used within a MoviesProvider');
  }
  return context;
}
```

### 4. Using Global State in Components

```jsx
// src/pages/Home.jsx
import { useEffect } from 'react';
import { useMovies } from '../context/MoviesContext';

function Home() {
  const { movies, loading, error, fetchPopularMovies } = useMovies();

  useEffect(() => {
    fetchPopularMovies();
  }, [fetchPopularMovies]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Popular Movies</h1>
      <div className="movie-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
```

### 5. Keeping Local State Local

Don't put everything in context:

```jsx
// ✅ Local state — only this component needs it
function SearchBox() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// ✅ Global state — many components need this
function CartIcon() {
  const { items } = useCart();
  return <span>Cart ({items.length})</span>;
}
```

### 6. Combining Multiple Contexts

```jsx
// src/main.jsx
function Main() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <MoviesProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MoviesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

**Order matters:** Outer providers are available to all inner providers.

## Step-by-Step Walkthrough

1. Create context files for your capstone's main features:
   ```bash
   mkdir src/context
   ```

2. Create a context for your main data (movies, products, etc.) following the pattern in section 3

3. Wrap your app in the provider(s) in `main.jsx`

4. Update your page components to use the context hooks instead of local state

5. Verify data flows correctly from API → context → components

6. Test loading, error, and success states

## Try It Yourself

1. **Easy:** Create a `CartContext` that manages your cart items. Add an item count display in the header.

2. **Medium:** Build a search feature that uses the API layer and stores results in context. Show results on a dedicated search page.

3. **Challenge:** Add a "favorites" feature: create a `FavoritesContext` that lets users save/unsave items, persisted to localStorage.

## Common Mistakes & How to Fix Them

- **Provider order errors** — Make sure providers that depend on others are wrapped inside them (e.g., AuthProvider inside ThemeProvider)
- **State not updating across components** — Check that all components use the same context hook, not local state
- **Too many re-renders** — Split your context. Don't put unrelated state in the same provider
- **Stale data** — Add a refresh mechanism (re-fetch on focus, pull-to-refresh, etc.)

## Recap / Checklist

After today, you should be able to:

- [ ] Plan which state should be global vs local
- [ ] Combine context + useReducer + API calls
- [ ] Build a complete data flow (API → context → components)
- [ ] Use multiple contexts for different concerns
- [ ] Keep local state local when appropriate

## Useful Links

- [React: Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [React: Managing State](https://react.dev/learn/managing-state)
