# Session 22 — Capstone Review & Debugging Clinic

## What We're Learning Today

Today is about fixing the bugs you've been living with. We'll cover the most common React bugs, how to debug them, and use opencode to help trace stack traces.

## Prerequisites

- Sessions 01-21 completed
- Capstone deployed and working (mostly)

## Concepts

### 1. Stale Closures — The #1 React Bug

A stale closure happens when a function "remembers" an old value:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    // This captures `count` at the time the function was created
    setTimeout(() => {
      alert(`Count is: ${count}`); // Always shows the OLD count
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

**Fix with useEffectEvent (React 19+):**
```jsx
import { useEffectEvent } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // useEffectEvent reads the LATEST value when called
  const handleAlert = useEffectEvent(() => {
    alert(`Count is: ${count}`);
  });

  function handleClick() {
    setTimeout(handleAlert, 3000);
  }

  return (/* ... */);
}
```

**Old workaround (still works but useEffectEvent is better):**
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  function handleClick() {
    setTimeout(() => {
      alert(`Count is: ${countRef.current}`);
    }, 3000);
  }

  return (/* ... */);
}
```

### 2. Missing Dependency Arrays

```jsx
// ❌ Bug: fetches data once, never updates
useEffect(() => {
  fetchMovies();
}, []);

// ❌ Bug: fetches on EVERY render (infinite loop!)
useEffect(() => {
  fetchMovies();
});

// ✅ Correct: fetches when query changes
useEffect(() => {
  fetchMovies(query);
}, [query]);
```

**Rule:** Every variable from outside the effect that you use inside must be in the dependency array.

### 3. The "Cannot Update State on Unmounted Component" Warning

```jsx
// ❌ Old pattern
useEffect(() => {
  let isMounted = true;
  async function fetchData() {
    const data = await fetch(url);
    if (isMounted) setData(data);
  }
  fetchData();
  return () => { isMounted = false; };
}, [url]);

// ✅ Modern pattern with AbortController
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const response = await fetch(url, { signal: controller.signal });
      const data = await response.json();
      setData(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    }
  }
  fetchData();

  return () => controller.abort();
}, [url]);
```

### 4. Key Prop Issues

```jsx
// ❌ Using array index as key (breaks with reordering)
{items.map((item, index) => (
  <Item key={index} item={item} />
))}

// ✅ Using unique ID
{items.map(item => (
  <Item key={item.id} item={item} />
))}

// ❌ Generating random keys (causes re-renders)
{items.map(item => (
  <Item key={Math.random()} item={item} />
))}
```

### 5. useEffect Running Twice in Development

React 18's StrictMode intentionally runs effects twice in development to help you find bugs. This is normal and doesn't happen in production.

**If your effect has side effects (creating subscriptions, etc.):**
```jsx
useEffect(() => {
  const subscription = subscribe(id);

  // Cleanup handles the duplicate run
  return () => subscription.unsubscribe();
}, [id]);
```

### 6. Debugging with React DevTools

```bash
# Install React DevTools browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
```

**Features:**
- **Components tab** — inspect component tree, props, state, hooks
- **Profiler tab** — record and analyze re-renders
- **Highlight updates** — shows which components re-render on each interaction

### 7. Console Debugging Techniques

```jsx
// Log objects, not just values
console.log('User:', user);
console.table(users); // Nice table view

// Log at the right time
useEffect(() => {
  console.log('Effect ran with query:', query);
}, [query]);

// Use console.trace() to see the call stack
function handleClick() {
  console.trace('Button clicked');
  // ... rest of handler
}

// Group related logs
console.group('Fetching movies');
console.log('URL:', url);
console.log('Response:', response);
console.groupEnd();
```

### 8. Using opencode for Debugging

```
> I'm getting this error in my console:
> "TypeError: Cannot read properties of undefined (reading 'map')"
> 
> Here's the component code:
> [paste code]
> 
> What's causing this and how do I fix it?
```

```
> My component re-renders infinitely. Here's the code:
> [paste useEffect code]
> 
> What's in my dependency array that shouldn't be?
```

```
> My app works locally but fails on GitHub Pages with a blank screen.
> The console shows: "Unexpected token '<'"
> What does this mean?
```

## Step-by-Step Walkthrough

1. Open your capstone in React DevTools

2. Enable "Highlight updates" in React DevTools settings

3. Interact with your app — see which components re-render

4. Check for common issues:
   - Components re-rendering unnecessarily
   - Missing keys on lists
   - Effects running without proper dependencies

5. Search your code for `console.log` and remove any leftover debugging logs

6. Fix any stale closure bugs with useEffectEvent

7. Test all routes and features

## Try It Yourself

1. **Easy:** Find and fix all stale closure bugs in your capstone using useEffectEvent.

2. **Medium:** Use React DevTools Profiler to record an interaction and identify which components re-render.

3. **Challenge:** Ask opencode to review your code for common React bugs. Fix any issues it finds.

## Common Mistakes & How to Fix Them

- **"Why is this variable undefined?"** — It's probably a stale closure. Use useEffectEvent or refs
- **"Too many re-renders"** — You're calling setState in the render body. Move it to an event handler or useEffect
- **"Key warning"** — You're using array index as key, or generating random keys
- **"Blank screen"** — Check the console for errors. Fix the first error — others are usually cascading

## Recap / Checklist

After today, you should be able to:

- [ ] Identify and fix stale closure bugs
- [ ] Write correct dependency arrays for useEffect
- [ ] Use React DevTools to debug components
- [ ] Handle the double-render in StrictMode
- [ ] Use opencode to debug stack traces
- [ ] Clean up console.log statements

## Useful Links

- [React useEffectEvent](https://react.dev/reference/react/useEffectEvent)
- [React DevTools Documentation](https://react.dev/learn/react-developer-tools)
- [Common React Bugs](https://react.dev/learn/you-might-not-need-an-effect)
