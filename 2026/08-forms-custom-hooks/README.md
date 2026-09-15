# Session 08 — Forms & Custom Hooks

## What We're Learning Today

Forms are how users interact with your app. Today we learn controlled forms, validation, and how to extract reusable logic into custom hooks.

## Prerequisites

- Sessions 01-07 completed (understand state, events, useEffect)
- Vite React project ready

## Concepts

### 1. Controlled Forms — React Controls the Input

In a controlled form, React state is the "source of truth" for the input value:

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Submitting:', { email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
}
```

**Why controlled?**
- Instant validation (check on every keystroke)
- Dynamic input behavior (disable submit until valid)
- Input formatting (uppercase, phone number masks)

### 2. Basic Validation

```jsx
function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.includes('@')) newErrors.email = 'Invalid email';
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid — submit it
      console.log('Submitted:', { name, email });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </div>
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### 3. Lifting Form State Up

When multiple forms share data, lift state to the parent:

```jsx
function CheckoutForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
  });

  function updateField(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      {step === 1 && (
        <Step1 data={formData} onUpdate={updateField} onNext={() => setStep(2)} />
      )}
      {step === 2 && (
        <Step2 data={formData} onUpdate={updateField} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
```

### 4. Custom Hooks — Reuse Logic

A custom hook is a function that starts with `use` and can call other hooks:

```jsx
// useLocalStorage.js — a custom hook
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Use it like useState, but persists to localStorage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### 5. Common Custom Hooks

**useFetch — fetch data once:**
```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserList() {
  const { data: users, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**useToggle — boolean state:**
```jsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle];
}

// Usage
function Modal() {
  const [isOpen, toggle] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>{isOpen ? 'Close' : 'Open'}</button>
      {isOpen && <div className="modal">Modal content</div>}
    </div>
  );
}
```

### 6. Rules of Custom Hooks

- **Must start with `use`** — React uses this to check for hook rules
- **Can call other hooks** — useState, useEffect, and other custom hooks
- **Returns anything you want** — a value, an array, an object
- **Each component gets its own copy** — hooks don't share state between components

## Step-by-Step Walkthrough

1. Create a new Vite React project:
   ```bash
   npm create vite@latest forms-and-hooks -- --template react
   cd forms-and-hooks
   npm install
   ```

2. Create `src/useLocalStorage.js`:
   ```jsx
   import { useState, useEffect } from 'react';

   export default function useLocalStorage(key, initialValue) {
     const [value, setValue] = useState(() => {
       const saved = localStorage.getItem(key);
       return saved ? JSON.parse(saved) : initialValue;
     });

     useEffect(() => {
       localStorage.setItem(key, JSON.stringify(value));
     }, [key, value]);

     return [value, setValue];
   }
   ```

3. Create `src/SignupForm.jsx`:
   ```jsx
   import { useState } from 'react';
   import useLocalStorage from './useLocalStorage';

   function SignupForm() {
     const [name, setName] = useLocalStorage('signup-name', '');
     const [email, setEmail] = useLocalStorage('signup-email', '');
     const [submitted, setSubmitted] = useState(false);

     function handleSubmit(e) {
       e.preventDefault();
       if (!name.trim() || !email.includes('@')) return;
       setSubmitted(true);
     }

     if (submitted) {
       return <p>Thanks for signing up, {name}!</p>;
     }

     return (
       <form onSubmit={handleSubmit}>
         <input
           value={name}
           onChange={(e) => setName(e.target.value)}
           placeholder="Name"
         />
         <input
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           placeholder="Email"
           type="email"
         />
         <button type="submit">Sign Up</button>
       </form>
     );
   }

   export default SignupForm;
   ```

4. Update `src/App.jsx`:
   ```jsx
   import SignupForm from './SignupForm';

   function App() {
     return (
       <div>
         <h1>Forms & Custom Hooks</h1>
         <SignupForm />
       </div>
     );
   }

   export default App;
   ```

5. Run `npm run dev`. Try filling the form, refreshing the page — your input persists!

## Try It Yourself

1. **Easy:** Create a `useCounter` hook with increment, decrement, and reset functions.

2. **Medium:** Build a `useFetch` hook that accepts a URL and returns `{ data, loading, error }`. Use it to fetch and display posts from JSONPlaceholder.

3. **Challenge:** Create a multi-step form (name → email → address) where each step's data persists in localStorage using `useLocalStorage`.

## Common Mistakes & How to Fix Them

- **Form submits and page reloads** — You forgot `e.preventDefault()` in your submit handler
- **Input feels controlled but sluggish** — You might be doing heavy work in onChange. Keep it lightweight
- **Custom hook not working** — Make sure it starts with `use` and follows hook rules (no conditional calls)
- **localStorage not updating** — Your useEffect dependency array is missing `key` or `value`

## Recap / Checklist

After today, you should be able to:

- [ ] Build controlled forms with validation
- [ ] Display validation errors next to fields
- [ ] Create custom hooks to reuse stateful logic
- [ ] Build useFetch, useLocalStorage, and useToggle hooks
- [ ] Understand the rules of hooks

## Useful Links

- [React: Building a Form](https://react.dev/learn/primitives)
- [React: Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [MDN: Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
