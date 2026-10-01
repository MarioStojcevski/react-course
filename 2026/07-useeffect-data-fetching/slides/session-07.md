---
theme: default
title: "Session 07 - useEffect & Data Fetching"
info: |
  Side effects, useEffect, dependency arrays, cleanup,
  and loading/error states. Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# useEffect & Data Fetching

Beyond rendering. Fetch, listen, clean up.

<br>

### React SPA Course - Session 07

---

# Today's Goals

<br>

- Side effects — what they are, why they exist
- `useEffect` — run code after render
- Dependency arrays — control *when* it runs
- Cleanup — undo effects on unmount
- Loading, error, empty states — real fetching UX
- Fetch on prop changes — re-run when inputs change

---

# Where We Left Off

Session 06 components render, remember state, respond to clicks — but the data is all hard-coded:

```jsx
const items = [...]; // written by us, in the file
```

Nothing reaches outside the app:
- no API requests
- no tab title updates
- no timers or listeners

> 💡 The browser can do more than render JSX. React calls those extra jobs **side effects**.

---
layout: center
---

# 1. What Is a Side Effect?

Anything a component does that isn't rendering.

---

# Side Effects, Examples

| Side effect | Typical job |
|---|---|
| Fetching data | load users from an API |
| Setting a timer | countdown, polling an API |
| Listening to events | `window.addEventListener` |
| Changing the browser | `document.title = '...'` |
| Logging | `console.log` for debugging |

> 💡 Render must be **pure**: same props + state → same UI. Effects are the escape hatch for everything else.

---

# When Do Effects Run?

```text
1. State changes (or the component first mounts)
2. React renders the JSX → screen updates
3. useEffect runs               ← after the paint
4. The effect sets state (e.g. fetched data)
5. React renders again — effect stays quiet if deps didn't change
```

- Effects don't describe UI — they **synchronize** React with systems outside React: network, DOM, timers.
- That's why they run *after* render, not during it.

---
layout: center
---

# 2. useEffect — The Basics

Run code after render, on a schedule you control.

---

# Your First Effect

```jsx
import { useEffect } from 'react';

function Analytics() {
  useEffect(() => {
    console.log('Component appeared!');
  }, []);

  return <p>Thanks for visiting.</p>;
}
```

`useEffect(fn, [])` → React runs `fn` **once**, right after the component first appears on screen.

---

# Anatomy of an Effect

| Part | Job |
|---|---|
| `() => { ... }` | the function React runs after render |
| second argument | the **dependency array** — when to run it |
| `return () => { ... }` | optional **cleanup**, runs before the next run |

```jsx
useEffect(() => {
  // do the thing
  return () => { /* undo the thing */ };
}, [deps]);
```

> 💡 The body runs after paint — safe to touch the real DOM and `document`.

---

# The Dependency Array

```jsx
useEffect(() => { /* ... */ });            // after EVERY render
useEffect(() => { /* ... */ }, []);        // once, after mount
useEffect(() => { /* ... */ }, [userId]);  // when userId changes
```

- No second argument → runs after every render (rarely what you want)
- `[]` → runs once on mount: one-time fetch, initial setup
- `[a, b]` → re-runs whenever `a` or `b` changes

> 💡 Rule: every value the effect **reads** from outside belongs in the array. The ESLint plugin `react-hooks/exhaustive-deps` enforces it.

---

# Reactive Fetch — Deps in Action

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function search() {
      const r = await fetch(`https://api.example.com/search?q=${query}`);
      setResults(await r.json());
    }
    search();
  }, [query]); // ← re-run when query changes

  return <ul>{results.map(r => <li key={r.id}>{r.title}</li>)}</ul>;
}
```

> 💡 One effect, many runs — React re-runs it every time `query` changes.

---
layout: center
---

# 3. Cleanup

Effects can outlive the render. Cleanup stops them.

---

# The Return Function

Some effects keep working after the component leaves the screen. Cleanup stops them:

```jsx
useEffect(() => {
  function handleResize() {
    console.log('Window is now', window.innerWidth);
  }
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize); // cleanup
  };
}, []);
```

> 💡 Pair every `addEventListener` with a `removeEventListener` — subscribe once, clean up always.

---

# When Does Cleanup Run?

```text
mount            → effect runs
deps change      → cleanup runs → effect runs again
unmount          → cleanup runs
```

- `[]` effects clean up only when the component disappears
- Typical cleanup jobs: remove listeners, `clearInterval`, abort fetches
- Aborting matters: a late response must never set state on a dead component

> 💡 Cleanup = the effect's "on the way out" hook. Subscribe symmetrically: every setup gets a matching teardown.

---
layout: center
---

# 4. Loading, Error, Empty

Every fetch has three outcomes. Show all three.

---

# Three States of Every Fetch

| State | Meaning | What to show |
|---|---|---|
| loading | request in flight | "Loading users…" |
| error | request failed | error message |
| empty | success, 0 results | "No users found" |

```jsx
if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;
if (users.length === 0) return <p>No users found</p>;
```

> 💡 Never leave a blank screen — the user can't tell if it's broken.

---

# State for the Fetch

```jsx
const [users, setUsers] = useState([]);       // the data
const [loading, setLoading] = useState(true); // request in flight
const [error, setError] = useState(null);     // null = no error
```

- `loading` starts `true` — the request begins immediately
- `users` starts empty — grows when the response lands
- `error` stays `null` on success, holds a message on failure

> 💡 Three pieces of state → three UI branches. Add them together, always.

---

# The Effect

```jsx
useEffect(() => {
  async function fetchUsers() {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      setUsers(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchUsers();
}, []); // ← one-time fetch
```

- `try / catch / finally` maps onto the three states
- `[]` keeps it a **single** request per mount

---

# The Render

Guard clauses first, list last:

```jsx
if (loading) return <p>Loading users...</p>;
if (error) return <p>Error: {error}</p>;

return (
  <ul>
    {users.map(user => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);
```

- Each guard returns early — the list only renders with good data
- `key={user.id}` — same list rule as Session 05

---
layout: center
---

# 5. The Mental Model

Render → effect → maybe re-render → cleanup.

---

# The Effect Lifecycle

```text
Component renders
  ↓
useEffect runs (if dependencies changed)
  ↓
state set inside effect → component renders again
  ↓
cleanup runs (if the effect returned one)
  ↓
…cycle continues until unmount
```

> 💡 Say it out loud: "After render, do X. If A or B change, do X again. On the way out, undo X."

---
layout: center
---

# Hands-On Time

Create the data-fetching project. Three files.

---

# Step 1: Project + UserList

```bash
npm create vite@latest data-fetching -- --template react
cd data-fetching && npm install
```

```text
src/
├── UserList.jsx        ← state + effect + render, from the slides above
├── DocumentTitle.jsx   ← next step
└── App.jsx             ← step 3
```

Build `UserList` from the three slides: state, effect, render.

---

# Step 2: DocumentTitle.jsx

```jsx
import { useState, useEffect } from 'react';

function DocumentTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // ← deps: count

  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}
```

The tab title is a side effect — the browser owns it, React just synchronizes.

---

# Step 3: App.jsx

```jsx
import UserList from './UserList';
import DocumentTitle from './DocumentTitle';

function App() {
  return (
    <div>
      <h1>Data Fetching</h1>
      <DocumentTitle />
      <UserList />
    </div>
  );
}

export default App;
```

---

# Run It

- `npm run dev`
- ✅ "Loading users..." flashes, then the list appears
- ✅ Click the button — the **tab title** changes
- ✅ Console free of errors and warnings

<br>

> 💡 In dev, React StrictMode runs effects twice on purpose — it proves your cleanup works. Not a bug.

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Fetch posts, show the first 5 titles. |
| 🟡 Medium | Dropdown of user IDs 1–5 → fetch that user's posts when it changes. |
| 🔴 Challenge | Search input — fetch filtered posts as the user types (wait 300ms after they stop typing). |

<br>

> 💡 Medium and Challenge hinge on the dependency array. Think: what does the effect *read*?

---

# Common Mistakes

| Problem | Fix |
|---|---|
| Effect runs forever (infinite loop) | State set inside the effect → add correct deps or move the setup |
| Data never appears | One-time fetch needs `[]` — missing deps re-run it endlessly |
| Stale data after a prop change | Missing dep — list every value the effect reads |
| "State update on unmounted component" | No cleanup — abort the fetch / remove the listener |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Explain what a side effect is
- [ ] Use `useEffect` with `[]` for one-time fetches
- [ ] Re-run effects when props change via deps
- [ ] Show loading, error, and empty states
- [ ] Clean up listeners and requests on unmount
- [ ] Update `document.title` from state

<br>

### Next Session

**Session 08 — Forms, Validation & Custom Hooks** — user input done right.

---
layout: center
---

# Questions?

### Useful Links

- [React: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
