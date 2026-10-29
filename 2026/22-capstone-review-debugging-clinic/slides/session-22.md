---
theme: default
title: "Session 22 - Capstone Review & Debugging Clinic"
info: |
  Fix the bugs you've been living with: stale closures, bad
  dependency arrays, key mistakes, StrictMode double runs,
  and debugging with DevTools and opencode.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Capstone Review & Debugging Clinic

Fix the bugs you've been living with.

<br>

### React SPA Course - Session 22

---

# Today's Goals

<br>

- Diagnose and fix **stale closures** — the #1 React bug
- Write dependency arrays that don't lie
- Kill the unmounted-component warning with `AbortController`
- Fix `key` mistakes that corrupt lists
- Understand why StrictMode runs effects twice
- Debug with React DevTools, the console, and opencode

---

# Where We Left Off

```text
Session 19  →  deployed and live
Session 20  →  opencode as your pair programmer
Session 21  →  deploy debugging, the classic failures
Session 22  →  the bugs inside the app itself
```

- The site loads. Now the console tells stories.
- Bring **your** capstone open — we fix yours, not a demo

> 💡 A clinic means your bug, on your screen, fixed today.

---

# The Symptom → Cause Map

| Symptom | Likely cause |
|---|---|
| Value in a timeout/callback is always old | Stale closure |
| Effect fires every render, or never | Dependency array |
| Warning about setting state on unmounted | No cleanup / abort |
| List flickers or inputs lose focus | Bad `key` |
| Works in dev, odd in prod | StrictMode double-run assumptions |
| Re-renders too often | State in the wrong place |

> 💡 Match the symptom first. The fix follows from the cause.

---
layout: center
---

# 1. Stale Closures

The function remembers the past.

---

# What a Stale Closure Looks Like

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    // captures `count` from the render where handleClick was born
    setTimeout(() => {
      alert(`Count is: ${count}`); // always the OLD value
    }, 3000);
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleClick}>Alert in 3s</button>
    </div>
  );
}
```

- Click Increment three times, then Alert — you get the value from **creation time**
- The closure isn't broken; it's doing exactly what closures do

> 💡 Every render makes new functions with fresh values. Old ones keep old ones.

---

# The Fix: useEffectEvent (React 19+)

```jsx
import { useEffectEvent } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // reads the LATEST value whenever it's called — no dep array needed
  const handleAlert = useEffectEvent(() => {
    alert(`Count is: ${count}`);
  });

  function handleClick() {
    setTimeout(handleAlert, 3000);
  }

  return (/* ... */);
}
```

- Wrap the callback, not the timer
- `useEffectEvent` is stable — it never needs to be in any dependency array

---

# The Old Workaround: Ref

Still works. Worth recognizing:

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;   // ref always mirrors the latest count
  }, [count]);

  function handleClick() {
    setTimeout(() => {
      alert(`Count is: ${countRef.current}`); // reads live value
    }, 3000);
  }

  return (/* ... */);
}
```

- Refs are a box you can read without re-rendering
- Prefer `useEffectEvent` in React 19 — but know this pattern: interviews still ask it

---
layout: center
---

# 2. Dependency Arrays

Every outside value you use goes in.

---

# Three Wrong, One Right

```jsx
// ❌ fetches once — if `query` changes, nothing happens
useEffect(() => {
  fetchProducts(query);
}, []);

// ❌ fetches on EVERY render — infinite loop
useEffect(() => {
  fetchProducts(query);
});

// ✅ fetches when query changes
useEffect(() => {
  fetchProducts(query);
}, [query]);
```

- Rule: **every** reactive value used inside the effect belongs in the array
- Missing a dep → stale data. Extra dep → extra runs (usually harmless, sometimes not)

> 💡 When in doubt, put it in. React will tell you if it's a problem.

---

# Cleanup: Stop the Warning

```jsx
// ❌ the old isMounted flag
useEffect(() => {
  let isMounted = true;
  fetchData().then(d => { if (isMounted) setData(d); });
  return () => { isMounted = false; };
}, [url]);

// ✅ AbortController — cancels the request itself
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const res = await fetch(url, { signal: controller.signal });
      setData(await res.json());
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    }
  }
  fetchData();

  return () => controller.abort();
}, [url]);
```

- Cleanup runs before the next effect **and** on unmount
- `AbortError` is cancellation, not failure — don't show it as an error

> 💡 Your Session 14 client already does this — reuse it.

---
layout: center
---

# 3. Keys & StrictMode

Small words, real bugs.

---

# Key Mistakes

```jsx
// ❌ index as key — breaks on reorder, insert, delete
{items.map((item, index) => (
  <Item key={index} item={item} />
))}

// ❌ random keys — every render remounts every row
{items.map(item => (
  <Item key={Math.random()} item={item} />
))}

// ✅ stable, unique, from the data
{items.map(item => (
  <Item key={item.id} item={item} />
))}
```

- Keys tell React **which item is which** across renders
- Wrong keys = inputs losing focus, wrong row animating, state jumping rows

> 💡 If the data has an id, use it. If not, generate it once — not per render.

---

# StrictMode Runs Effects Twice

```text
development:  mount → effect → cleanup → effect
production:   mount → effect
```

- Intentional: it exposes effects with no cleanup
- Your effect must be **safe to run twice**

```jsx
useEffect(() => {
  const sub = subscribe(productId);
  return () => sub.unsubscribe(); // handles the duplicate run
}, [productId]);
```

- No cleanup function? You probably need one
- Don't "fix" it with flags — fix the effect

---
layout: center
---

# 4. Debug Like a Pro

Tools, then prompts.

---

# React DevTools

```text
Components tab   tree, props, state, hooks — click the suspect
Profiler tab     record an interaction, see what re-rendered
Highlight updates  flicker on every re-render — instant heat map
```

```text
profiler workflow
  1. enable "Highlight updates"
  2. do the slow interaction
  3. the flickering components are your suspects
  4. Profiler flamegraph: why did this one re-render?
```

- A component that re-renders on every keystroke of an unrelated input → wrong state placement or a missing memo

---

# Console Techniques

```jsx
console.log('User:', user);          // objects, not strings
console.table(users);                // arrays of objects

useEffect(() => {
  console.log('effect ran, query =', query);
}, [query]);                         // log at the boundary

console.trace('button clicked');     // who called me?
console.group('Fetching products');  // group related logs
```

```bash
# before you ship — no stray logs
grep -r "console.log" src/
```

- Log at **boundaries**: effects, event handlers, reducers
- A log inside render fires hundreds of times and lies to you

---

# Debugging with opencode

```text
> I'm getting "TypeError: Cannot read properties of undefined (reading 'map')".
> Here's the component: [paste code]
> What's causing this and how do I fix it?
```

```text
> My component re-renders infinitely. Here's the useEffect: [paste code]
> What's in my dependency array that shouldn't be?
```

```text
> Here's my React DevTools Profiler screenshot of a slow click:
> [attach] Which component should I optimize first?
```

- Paste the **error verbatim** and the **actual file** — one bug, one prompt
- Ask "what should I check first?" — ranked next steps, not a rewrite

---
layout: center
---

# 5. The Clinic

Your capstone. Your bugs.

---

# Triage Order

```text
1. console       first error — later ones are usually fallout
2. network       failing request? that's a data bug, not a render bug
3. components    React DevTools: which component holds the bad state?
4. effects       deps correct? cleanup present?
5. keys          list rendering weird? check the id
6. opencode      still stuck → structured prompt with file attached
```

- One bug at a time — verify the fix before starting the next
- Write each bug down: symptom → cause → fix. That's your clinic log

> 💡 The bug you fix today is one you won't explain away in the demo.

---

# Review Checklist

```text
□ no console errors on any route
□ no console.log left in src/
□ every useEffect has correct deps + cleanup where needed
□ every list uses a stable id key
□ no raw fetch in components — api layer only
□ loading, error, empty states all reachable
□ cart/shared state survives navigation
□ hard-refresh on a deep route still works (live URL)
```

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Find and fix every stale closure — swap in `useEffectEvent` or a ref. |
| 🟡 Medium | Record an interaction in React DevTools Profiler. Fix the top re-renderer. |
| 🔴 Challenge | Ask opencode to review your code for common React bugs. Fix what it finds. |

<br>

**Bonus:** remove every `console.log` from `src/` and re-test all routes.

> 💡 Easy first. A fix you haven't re-tested is still a hypothesis.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| "This variable is always old" | Stale closure — `useEffectEvent` or ref |
| Effect runs forever / never | Fix the dependency array — every outside value in |
| Key warning in the console | Use `item.id`, never index, never `Math.random()` |
| Inputs lose focus while typing | Unstable keys, or state moved to the wrong parent |
| State update warning on unmount | Cleanup with `AbortController` |
| "I fixed it, it came back" | You fixed the symptom — find the cause in the profiler |
| opencode rewrote half the app | Ask for the smallest fix, apply it, re-test |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Diagnosed stale closures and fixed them with `useEffectEvent`
- [ ] Wrote dependency arrays from the "every outside value" rule
- [ ] Replaced the isMounted flag with `AbortController`
- [ ] Fixed list bugs caused by bad `key`s
- [ ] Explained why StrictMode runs effects twice
- [ ] Used React DevTools, the console, and opencode to find bugs
- [ ] Cleared the review checklist on my own capstone

<br>

### Next Session

**Session 23 — Testing Basics & Error Handling** — catch bugs with tests before your users do.

---
layout: center
---

# Questions?

### Useful Links

- [React useEffectEvent](https://react.dev/reference/react/useEffectEvent)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Fixing "state update on unmounted"](https://react.dev/reference/react/useEffect#usage)
