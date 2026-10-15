---
theme: default
title: "Session 14 - API Layer Patterns"
info: |
  A dedicated API client, resource modules, consistent error handling,
  request cancellation and a reusable data hook.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# API Layer Patterns

One place for every fetch.

<br>

### React SPA Course - Session 14

---

# Today's Goals

<br>

- Upgrade Session 11's `api/` into a real client
- `ApiError` — errors that carry status and payload
- Resource modules: `movies.getPopular()`, not raw URLs
- A component error pattern that never lies about state
- `AbortController` for search-as-you-type
- One `useApi` hook instead of copied `useEffect`s

---

# Where We Left Off

Session 11 gave you one function per endpoint:

```js
// src/api/products.js
export async function getProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}
```

That already beats `fetch` in a component. Today it grows up:

```text
Session 11:  getProducts()                 ✅ one place
Session 14:  client + errors + cancel      ✅ one place, done right
```

> 💡 Same folder, better rules. No rewrite of what works.

---

# What Scatters

Every component that calls `fetch` re-invents this:

```jsx
const res = await fetch(url);
if (!res.ok) throw new Error('...');   // sometimes skipped
const data = await res.json();         // sometimes forgotten
setLoading(false);                     // sometimes in the wrong place
```

- Error messages differ per component
- 404 and 500 look identical to the user
- Retry, caching, auth headers: nowhere to put them

> 💡 Duplication in error handling is the expensive kind.

---
layout: center
---

# 1. The Client

All the network plumbing in one file.

---

# `apiClient` + `ApiError`

```js
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
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(`API error: ${response.status}`, response.status, data);
  }

  return response.json();
}
```

- One `fetch`, one `!ok` check, one place to add auth later

---

# Why a Custom Error Class

```jsx
try {
  await apiClient(`/products/${id}`);
} catch (err) {
  if (err instanceof ApiError) {
    if (err.status === 404) return <NotFound />;
    if (err.status === 401) return <LoginPrompt />;
    return <p>Server error ({err.status})</p>;
  }
  return <p>Network problem — check your connection</p>;
}
```

- `message` for humans, `status` for decisions, `data` for details
- Network failure and server error stop looking the same

> 💡 A thrown string tells you nothing. A thrown `ApiError` tells you everything.

---
layout: center
---

# 2. Resource Modules

Components should think in resources, not URLs.

---

# Endpoints as an Object

```js
// src/api/products.js
import { apiClient } from './client';

export const products = {
  getAll: (page = 1) => apiClient(`/products?page=${page}`),
  getById: id => apiClient(`/products/${id}`),
  search: (query, page = 1) =>
    apiClient(`/products/search?q=${encodeURIComponent(query)}&page=${page}`),

  create: body =>
    apiClient('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) =>
    apiClient(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: id => apiClient(`/products/${id}`, { method: 'DELETE' }),
};
```

- Resource name = the module, method = the verb
- One file per resource, mirrors your API's routes

---

# The Component Side

```jsx
// before — URL knowledge lives in the component
const res = await fetch(`${API_URL}/products/${id}`);
const item = await res.json();
```

```jsx
// after — no URL, no base, no headers
import { products } from '../api/products';

const item = await products.getById(id);
```

```text
component  →  api/products  →  api/client  →  network
   UI          resource         base URL,
               verbs            headers, errors
```

- Swap the backend → edit `client.js` only
- Add an auth header → edit `client.js` only

---

# Use the Signal, Too

`apiClient` passes `options` straight to `fetch`, so cancellation works:

```js
const controller = new AbortController();

products.search('shoes', 1, { signal: controller.signal })
  .catch(err => { /* AbortError lands here */ });

controller.abort();
```

```js
// forward the signal in your resource module
search: (query, opts = {}) =>
  apiClient(`/products/search?q=${encodeURIComponent(query)}`, opts),
```

- `opts` as the last param keeps every method cancel-friendly

---
layout: center
---

# 3. Error Handling in Components

The state machine that never lies.

---

# The Three-State Pattern

```jsx
function ProductList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);                    // clear before retrying
        const data = await products.getAll();
        if (!cancelled) setItems(data.results);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  return <ul>{items.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

---

# The Four Rules

1. **Reset error before the request** — stale errors hide new successes
2. **`cancelled` flag in every async effect** — no setState after unmount
3. **`finally` clears loading** — even when the request throws
4. **Render all three branches** — loading, error, empty, content

```jsx
// the four renders, in order
if (loading) return <Spinner />;
if (error)   return <ErrorMessage error={error} />;
if (!items.length) return <EmptyState />;
return <List items={items} />;
```

> 💡 An empty result is not an error. Give it its own screen.

---

# Message vs Object

```jsx
// ❌ you lose err.status and err.data at the door
catch (err) {
  setError(err.message);
}
```

```jsx
// ✅ keep the whole error, format at render time
catch (err) {
  setError(err);
}
```

```jsx
if (error) {
  return error.status === 404
    ? <NotFound />
    : <p role="alert">{error.message}</p>;
}
```

- Store the object, decide in the render
- The same error can drive different UI per page

---
layout: center
---

# 4. Cancellation

Stop the race before it happens.

---

# The Race You Lose

```text
user types "s"    → request A starts
user types "sh"   → request B starts
A resolves last   → list shows results for "s"   ❌
```

- Every keystroke starts a request
- Responses arrive out of order
- The fix is not "wait longer" — it's abort

---

# AbortController

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
        const data = await products.search(query, { signal: controller.signal });
        onResults(data.results);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    }

    search();
    return () => controller.abort();   // runs on cleanup
  }, [query, onResults]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

---

# What the Cleanup Does

```text
query: "s"   effect runs   controller A
query: "sh"  cleanup → A.abort()   effect runs   controller B
query: "shs" cleanup → B.abort()   effect runs   controller C
```

- Aborted requests throw `AbortError` — **not** a real failure
- React 18 StrictMode double-invokes effects; abort handles it cleanly
- Only the latest response is allowed to touch state

> 💡 Always filter `AbortError` before logging, or your console fills with noise.

---
layout: center
---

# 5. `useApi`

Same pattern, written once.

---

# The Hook

```js
// src/hooks/useApi.js
import { useState, useEffect } from 'react';

export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFn(controller.signal);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; controller.abort(); };
  }, deps);

  return { data, loading, error };
}
```

---

# Usage

```jsx
import { useApi } from '../hooks/useApi';
import { products } from '../api/products';

function PopularProducts() {
  const { data, loading, error } = useApi(signal => products.getAll(1, { signal }));

  if (loading) return <Spinner />;
  if (error) return <p role="alert">{error.message}</p>;
  if (!data?.results?.length) return <p>Nothing here yet.</p>;

  return (
    <ul>
      {data.results.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

- The component only renders decisions — no fetch plumbing
- Pass `deps` when the request depends on props or URL

```jsx
useApi(signal => products.getById(id), [id]);
```

---

# What's Left in the Component

```text
before:  fetch + headers + ok check + json + cancelled + loading + error
after:   useApi(...)  →  4 render branches
```

| | Before | After |
|---|---|---|
| Lines per page | ~40 | ~10 |
| Error handling | different everywhere | one implementation |
| Cancellation | usually missing | built in |
| Next: retry / cache | rewrite each page | edit the hook |

> 💡 Extract the pattern when you've written it three times, not once.

---
layout: center
---

# Build It

Six steps on your capstone.

---

# Step 1: `client.js`

Create `src/api/client.js` from the earlier slide.

- `BASE_URL` from `import.meta.env.VITE_API_URL`
- `ApiError` with `status` and `data`
- `apiClient(endpoint, options)` forwards `options.signal`

---

# Step 2: Resource Modules

One file per resource you fetch in your capstone:

```text
src/api/
├── client.js     ← step 1
├── items.js      getAll, getById, search, create, update, remove
└── auth.js       login, me, logout
```

- Every function returns a promise — no JSX, no hooks in here

---

# Step 3: Hunt Down `fetch`

```text
Ctrl+Shift+F   search:   fetch(
```

- Every hit in a component moves into `src/api/`
- Components import `items.getAll()`, never `fetch`

---

# Step 4: `useApi.js`

Create `src/hooks/useApi.js`, then convert one page:

```jsx
const { data, loading, error } = useApi(signal => items.getAll({ signal }), []);
```

- Confirm loading, error, and empty states all render
- Add `[id]` to `deps` if the request depends on a route param

---

# Step 5: Search + Cancel

- One search input → `AbortController` in the effect
- Verify in the Network tab: typing fast shows **aborted** requests

---

# Step 6: Verify

- `npm run dev`
- ✅ No `fetch(` left in components
- ✅ Kill the dev server → error state renders, no white screen
- ✅ Search fast → only the last response lands
- ✅ Loading shows, then clears — never stuck spinning
- ✅ 404 from the API renders your empty/not-found UI

<br>

> 💡 The "kill the server" check is the one students skip. Do it.

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | `client.js` + one resource module; every fetch moved out of components. |
| 🟡 Medium | `useApi` on all data pages; distinct loading / error / empty screens. |
| 🔴 Challenge | Retry: failed GET retries 3×, 1s apart, then surfaces an `ApiError`. |

<br>

**Bonus:** search box with `AbortController` — watch aborted requests in the Network tab.

> 💡 Easy first. The retry challenge belongs inside `client.js`.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| `AbortError` spam in console | Filter `err.name !== 'AbortError'` before logging |
| Error from a previous request shows | `setError(null)` at the start of every load |
| Loading never clears | Set it in `finally`, not after the `try` |
| Double fetch in dev | StrictMode runs effects twice — abort/cancel covers it |
| `undefined` from `BASE_URL` | Restart dev server after editing `.env` |
| `useApi` never re-runs | Missing entry in the `deps` array |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Centralized `fetch` in `api/client.js` with `ApiError`
- [ ] Grouped endpoints into resource modules
- [ ] Handled loading, error, and empty states consistently
- [ ] Kept the whole error object, decided at render time
- [ ] Cancelled stale requests with `AbortController`
- [ ] Reused the pattern through a `useApi` hook
- [ ] Confirmed zero `fetch(` calls left in components

<br>

### Next Session

**Session 15 — Build State + Data Layer into Capstone** — context and API layer, together.

---
layout: center
---

# Questions?

### Useful Links

- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN: Fetch Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [TanStack Query](https://tanstack.com/query/latest) — the advanced version of today
