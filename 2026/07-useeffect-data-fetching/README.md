# Session 07 — useEffect & Data Fetching

## What We're Learning Today

Components need to do things besides rendering — like fetching data when they appear, subscribing to events, or cleaning up resources. `useEffect` is React's way of handling these "side effects."

## Prerequisites

- Sessions 01-06 completed (understand state, props, components)
- Vite React project ready

## Concepts

### 1. What Is a Side Effect?

A side effect is anything a component does that isn't rendering JSX:
- Fetching data from an API
- Setting up a timer
- Adding an event listener
- Changing the document title
- Logging to console

### 2. useEffect — Run Code After Render

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This runs AFTER the component renders
    async function fetchUser() {
      const response = await fetch(`https://api.example.com/users/${userId}`);
      const data = await response.json();
      setUser(data);
    }
    fetchUser();
  }, [userId]); // ← dependency array

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

### 3. The Dependency Array

The second argument to `useEffect` controls when it runs:

```jsx
// Runs after EVERY render (probably not what you want)
useEffect(() => {
  console.log('I run every time');
});

// Runs only ONCE on mount (empty array)
useEffect(() => {
  console.log('I run once when component appears');
}, []);

// Runs when userId changes
useEffect(() => {
  console.log('userId changed to', userId);
}, [userId]);

// Runs when userId OR theme changes
useEffect(() => {
  console.log('userId or theme changed');
}, [userId, theme]);
```

**Rule:** Every variable from outside the effect that you use inside it should be in the dependency array.

### 4. Cleanup — The Return Function

Some side effects need cleanup (removing listeners, canceling requests):

```jsx
useEffect(() => {
  function handleResize() {
    console.log('Window resized');
  }

  window.addEventListener('resize', handleResize);

  // Cleanup function — runs when component unmounts
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

### 5. Loading, Error, and Empty States

Every data-fetching component has three states:

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (users.length === 0) return <p>No users found</p>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### 6. Fetching Based on Props/State

When you fetch data that depends on a prop or state value, add it to the dependency array:

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function search() {
      const response = await fetch(`https://api.example.com/search?q=${query}`);
      const data = await response.json();
      setResults(data);
    }
    search();
  }, [query]); // Re-fetch when query changes

  return (
    <ul>
      {results.map(r => <li key={r.id}>{r.title}</li>)}
    </ul>
  );
}
```

### 7. The useEffect Mental Model

Think of `useEffect` as saying: "Hey React, after you render, I need to do something. And if any of these values change, do it again."

```
Component renders
  ↓
useEffect runs (if dependencies changed)
  ↓
Component renders again (if state changed in effect)
  ↓
Cleanup runs (if needed)
  ↓
New useEffect runs (if dependencies changed again)
```

## Step-by-Step Walkthrough

1. Create a new Vite React project:
   ```bash
   npm create vite@latest data-fetching -- --template react
   cd data-fetching
   npm install
   ```

2. Create `src/UserList.jsx`:
   ```jsx
   import { useState, useEffect } from 'react';

   function UserList() {
     const [users, setUsers] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
       async function fetchUsers() {
         try {
           const response = await fetch('https://jsonplaceholder.typicode.com/users');
           if (!response.ok) throw new Error('Failed to fetch');
           const data = await response.json();
           setUsers(data);
         } catch (err) {
           setError(err.message);
         } finally {
           setLoading(false);
         }
       }
       fetchUsers();
     }, []);

     if (loading) return <p>Loading users...</p>;
     if (error) return <p>Error: {error}</p>;

     return (
       <ul>
         {users.map(user => (
           <li key={user.id}>
             <strong>{user.name}</strong> — {user.email}
           </li>
         ))}
       </ul>
     );
   }

   export default UserList;
   ```

3. Create `src/DocumentTitle.jsx`:
   ```jsx
   import { useState, useEffect } from 'react';

   function DocumentTitle() {
     const [count, setCount] = useState(0);

     useEffect(() => {
       document.title = `You clicked ${count} times`;
     }, [count]);

     return (
       <div>
         <p>You clicked {count} times</p>
         <button onClick={() => setCount(count + 1)}>Click me</button>
       </div>
     );
   }

   export default DocumentTitle;
   ```

4. Update `src/App.jsx`:
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

5. Run `npm run dev`. You should see users load from the API.

## Try It Yourself

1. **Easy:** Fetch posts from `https://jsonplaceholder.typicode.com/posts` and display the first 5 titles.

2. **Medium:** Add a dropdown that lets the user select a user ID (1-5). Fetch and display that user's posts when the selection changes.

3. **Challenge:** Add a search input. As the user types, fetch posts filtered by title (hint: use a debounced search — delay the fetch until the user stops typing for 300ms).

## Common Mistakes & How to Fix Them

- **"Can't perform a React state update on an unmounted component"** — You're setting state after the component unmounts. Use a cleanup function or AbortController
- **Infinite re-render loop** — Your dependency array includes an object or array that gets a new reference every render. Move it inside the effect or memoize it
- **Data never shows** — Check that your dependency array is `[]` for one-time fetches. If you forgot it, the effect re-runs infinitely
- **Stale data** — Your dependency array is missing a value. Add all variables the effect uses

## Recap / Checklist

After today, you should be able to:

- [ ] Explain what a side effect is
- [ ] Use `useEffect` with empty dependency array for one-time fetches
- [ ] Use `useEffect` with dependencies for reactive fetches
- [ ] Implement loading, error, and empty states
- [ ] Clean up side effects (remove listeners, cancel requests)
- [ ] Change the document title based on state

## Useful Links

- [React: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
