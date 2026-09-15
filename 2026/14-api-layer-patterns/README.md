# Session 14 — API Layer Patterns

## What We're Learning Today

Scattered `fetch` calls are hard to maintain. Today we create a dedicated API layer with consistent error handling, loading states, and patterns that scale.

## Prerequisites

- Sessions 01-13 completed (understand state, effects, context)
- Capstone project with context/state management

## Concepts

### 1. Why an API Layer?

Without an API layer, you have:
- Duplicate fetch logic in every component
- Inconsistent error handling
- Hard to change base URLs or add authentication
- Impossible to add caching or retry logic

With an API layer:
- One place to manage all API calls
- Consistent error handling
- Easy to swap APIs or add auth headers
- Testable in isolation

### 2. Basic API Module

```javascript
// src/api/client.js
const BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiClient(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(
      `API error: ${response.status}`,
      response.status,
      data
    );
  }

  return response.json();
}
```

### 3. Resource-Specific API Modules

```javascript
// src/api/movies.js
import { apiClient } from './client';

export const movies = {
  async getPopular(page = 1) {
    return apiClient(`/movie/popular?page=${page}`);
  },

  async getById(id) {
    return apiClient(`/movie/${id}`);
  },

  async search(query, page = 1) {
    return apiClient(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  },

  async getGenres() {
    return apiClient('/genre/movie/list');
  },
};
```

```javascript
// src/api/users.js
import { apiClient } from './client';

export const users = {
  async getAll() {
    return apiClient('/users');
  },

  async getById(id) {
    return apiClient(`/users/${id}`);
  },

  async create(userData) {
    return apiClient('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async update(id, userData) {
    return apiClient(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async delete(id) {
    return apiClient(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};
```

### 4. Error Handling Patterns

```javascript
// In a component
import { movies } from '../api/movies';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);
        const data = await movies.getPopular();
        if (!cancelled) {
          setMovies(data.results);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMovies();

    return () => { cancelled = true; };
  }, []);

  // ... render
}
```

**Key patterns:**
- Use a `cancelled` flag to prevent state updates after unmount
- Always reset error state before a new request
- Use `finally` to ensure loading is cleared

### 5. Request Cancellation with AbortController

For search-as-you-type, cancel previous requests:

```jsx
function SearchBox({ onResults }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!query) {
      onResults([]);
      return;
    }

    const controller = new AbortController();

    async function search() {
      try {
        const data = await movies.search(query, { signal: controller.signal });
        onResults(data.results);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    }

    search();

    return () => controller.abort();
  }, [query, onResults]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search movies..."
    />
  );
}
```

### 6. Custom Hook for Data Fetching

Wrap your API calls in a reusable hook:

```javascript
// src/hooks/useApi.js
import { useState, useEffect } from 'react';

export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFn();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => { cancelled = true; };
  }, deps);

  return { data, loading, error };
}
```

**Usage:**
```jsx
import { useApi } from '../hooks/useApi';
import { movies } from '../api/movies';

function PopularMovies() {
  const { data, loading, error } = useApi(() => movies.getPopular(), []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ul>
      {data.results.map(movie => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  );
}
```

## Step-by-Step Walkthrough

1. Create the API layer structure:
   ```bash
   mkdir src/api
   ```

2. Create `src/api/client.js` (see section 2 above)

3. Create resource-specific modules (see section 3 above) for your capstone's API

4. Create `src/hooks/useApi.js` (see section 6 above)

5. Update your components to use the API layer instead of direct fetch calls

6. Test that everything still works, with proper error handling

## Try It Yourself

1. **Easy:** Create an API module for your capstone's main resource (movies, users, etc.) with get, search, and getById methods.

2. **Medium:** Build a `useSearch` hook that uses AbortController to cancel previous searches as the user types.

3. **Challenge:** Add retry logic to the API client — if a request fails, retry up to 3 times with a 1-second delay between attempts.

## Common Mistakes & How to Fix Them

- **"AbortError: The operation was aborted"** — This is expected when the component unmounts during a fetch. Check for `err.name !== 'AbortError'` before logging
- **Stale closures in useEffect** — The `cancelled` flag pattern prevents this. Always use it for async effects
- **API errors not showing** — Make sure your error state is being set and your component checks for it before rendering
- **Double fetching in StrictMode** — React 18's StrictMode runs effects twice in development. Your cancellation logic handles this correctly

## Recap / Checklist

After today, you should be able to:

- [ ] Create a centralized API client
- [ ] Build resource-specific API modules
- [ ] Handle loading, error, and success states consistently
- [ ] Cancel requests with AbortController
- [ ] Create reusable data-fetching hooks
- [ ] Apply error handling patterns across your app

## Useful Links

- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React Query Documentation](https://tanstack.com/query/latest) (advanced alternative)
