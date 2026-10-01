---
theme: default
title: "Session 08 - Forms & Custom Hooks"
info: |
  Controlled forms, validation, shared form state,
  and custom hooks: useLocalStorage, useFetch, useToggle.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Forms & Custom Hooks

Data in, logic reused.

<br>

### React SPA Course - Session 08

---

# Today's Goals

<br>

- Controlled forms — React owns the input value
- Validation — check before you submit
- Shared form state — multi-step flows
- Custom hooks — extract and reuse stateful logic
- `useLocalStorage`, `useFetch`, `useToggle`
- The rules of custom hooks

---

# Where We Left Off

Session 07 pulls data **in**:

```jsx
const [users, setUsers] = useState([]);
useEffect(() => { /* fetch → setUsers */ }, []);
```

Today data flows **out** — through forms:

- one controlled input (Session 05) → whole forms with several fields
- submit-time validation with visible errors
- the same logic reused across components

> 💡 A form is just state that stays invisible until someone types.

---
layout: center
---

# 1. Controlled Forms

React state is the source of truth for every input.

---

# Two Ways to Own an Input

| | Uncontrolled | Controlled |
|---|---|---|
| Value lives in | the DOM | React state |
| Read it | on submit, via ref | from state, anytime |
| Update it | the user types freely | `onChange` → setter |
| Instant validation | awkward | natural |

> 💡 We use **controlled** inputs — same pattern as the Session 05 todo input.

---

# One Form, Two Pieces

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault(); // ← or the page reloads
    console.log('Submitting:', { email, password });
  }
  // ... JSX on the next slide
}
```

- State first: one piece per field, all starting as `''`
- `e.preventDefault()` stops the browser's native submit (full page reload)

---

# The Input Contract

```jsx
<form onSubmit={handleSubmit}>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <button type="submit">Log In</button>
</form>
```

- `value` + `onChange` **together** — the Session 05 rule, per field
- `label htmlFor` = `input id` — clicking the label focuses the input
- `type="email"` gives free browser validation hints

---

# Why Bother?

With React holding the value, you can:

- **Validate live** — check on every keystroke
- **Gate the button** — `disabled={!isValid}` until the form is good
- **Format input** — uppercase, strip spaces, mask a phone number
- **Derive UI** — show a password strength bar as they type

> 💡 The DOM can only store a string. State can store anything you can compute from it.

---
layout: center
---

# 2. Validation

Catch mistakes before the request, not after.

---

# Validate on Submit

```jsx
const [errors, setErrors] = useState({});

function validate() {
  const errs = {};
  if (!name.trim()) errs.name = 'Name is required';
  if (!email.includes('@')) errs.email = 'Invalid email';
  return errs;
}

function handleSubmit(e) {
  e.preventDefault();
  const errs = validate();
  setErrors(errs);
  if (Object.keys(errs).length === 0) { /* submit */ }
}
```

- `errors` mirrors your fields: `{ name: '...', email: '...' }`
- Empty object = valid → only then submit

---

# Show Errors Next to the Field

```jsx
<input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
/>
{errors.email && <span className={styles.error}>{errors.email}</span>}
```

- `&&` renders the message only when there **is** an error
- Clear a field's error as soon as they edit it again

```text
type → onChange → state → submit → validate
                                   ├─ errors → show, don't send
                                   └─ none   → send it
```

> 💡 Never trust the client alone — re-check on the server. The form just fails fast.

---
layout: center
---

# 3. Shared & Multi-Step Forms

Several inputs, one source of truth.

---

# One Object, Many Fields

```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  address: '',
  cardNumber: '',
});

function updateField(field, value) {
  setFormData(prev => ({ ...prev, [field]: value }));
}
```

- One state object instead of four `useState` calls
- `[field]` — computed key: `'name'`, `'email'`, … one updater for all

```jsx
<input value={formData.email}
  onChange={(e) => updateField('email', e.target.value)} />
```

---

# Walk Between Steps

```jsx
const [step, setStep] = useState(1);

{step === 1 && (
  <Step1 data={formData} onUpdate={updateField}
         onNext={() => setStep(2)} />
)}
{step === 2 && (
  <Step2 data={formData} onUpdate={updateField}
         onSubmit={sendOrder} />
)}
```

- `formData` lives in the parent — steps receive slices as props
- Conditional rendering (Session 05) decides which step is on screen
- Each step **reads and writes** the same object → nothing gets lost

---
layout: center
---

# 4. Custom Hooks

When the same stateful logic appears twice, extract it.

---

# What Is a Custom Hook?

A plain function that:

- **starts with `use`** — that's how React recognizes it
- **may call other hooks** — `useState`, `useEffect`, even other custom hooks
- **returns whatever you decide** — an array, an object, a value
- **gets its own copy per component** — no shared state between users of the hook

```jsx
function useCounter() {          // custom hook
  const [count, setCount] = useState(0);
  return [count, setCount];
}
```

> 💡 It's not magic — just a function that lets React count hooks correctly.

---

# useLocalStorage — Persist Any State

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

- Lazy initializer reads storage **once**, on first render
- The effect writes back on every change — two-way sync

---

# It Behaves Like useState

```jsx
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

- Same array API as `useState` — swap the import and it just works
- Difference: `theme` survives a page refresh

> 💡 Good for settings, draft form fields, last-visited tab — anything you'd hate to retype.

---
layout: center
---

# 5. Two More You'll Use

useFetch and useToggle — Session 07 logic, extracted.

---

# useFetch — Three States in One Hook

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

Session 07's UserList effect — now reusable for **any** URL.

---

# useFetch in a Component

```jsx
function UserList() {
  const { data: users, loading, error } = useFetch(
    'https://jsonplaceholder.typicode.com/users'
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

- The hook owns the effect — the component only **renders**
- Rename on destructure: `data: users` reads better in JSX
- Change the URL prop → the effect re-runs (dep array still matters)

---

# useToggle — Boolean State

```jsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle];
}
```

```jsx
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

- One line to create toggle state anywhere — no more `setX(!x)`
- `prev => !prev` stays correct even in fast double-clicks

---
layout: center
---

# 6. Rules of Custom Hooks

Four rules. Break one and React complains.

---

# The Four Rules

| Rule | Why |
|---|---|
| Must start with `use` | React's linter checks hook calls inside it |
| Can call any hooks | `useState`, `useEffect`, other custom hooks |
| Return anything | array (pair API), object, or single value |
| One copy **per component** | two users of `useFetch` never share data |

<br>

- Hooks run unconditionally — **no** `if`/loops around hook calls
- Put the logic in a hook file (`src/useFetch.js`), import it like a utility

> 💡 If two components need the same loading/error dance, that's your cue to extract.

---
layout: center
---

# Hands-On Time

New project. One hook, one form, one App.

---

# Step 1: Project + Files

```bash
npm create vite@latest forms-and-hooks -- --template react
cd forms-and-hooks && npm install
```

```text
src/
├── useLocalStorage.js   ← step 2
├── SignupForm.jsx       ← step 3
└── App.jsx              ← step 4
```

---

# Step 2: useLocalStorage.js

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

Exactly the hook from the slides — paste it verbatim.

---

# Step 3: SignupForm.jsx — Logic

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

  if (submitted) return <p>Thanks for signing up, {name}!</p>;
  // ... form JSX next slide
}
```

- Two fields via the hook — **they survive a refresh**
- Guard clause replaces a full `errors` object for this quick build

---

# Step 3: SignupForm.jsx — JSX

```jsx
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
```

Same input contract, twice. `value` + `onChange`, always together.

---

# Step 4: App.jsx

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

---

# Run It

- `npm run dev`
- ✅ Submit empty → nothing happens (guard clause)
- ✅ Fill it in → "Thanks for signing up, {name}!"
- ✅ **Refresh the page** → the fields still hold your text

<br>

> 💡 That last one is `useLocalStorage` working — state came back from storage.

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | `useCounter` hook — increment, decrement, reset. |
| 🟡 Medium | `useFetch(url)` returning `{ data, loading, error }` → list JSONPlaceholder posts. |
| 🔴 Challenge | Multi-step form (name → email → address), each step persisted with `useLocalStorage`. |

<br>

> 💡 Medium rebuilds Session 07's fetch — this time the logic lives in a hook.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| Page reloads on submit | Missing `e.preventDefault()` in the handler |
| Input won't type / feels dead | Controlled input needs `value` **and** `onChange` |
| Custom hook throws / lints | Must start with `use`; never call hooks conditionally |
| localStorage doesn't update | Dep array missing `key` or `value` |
| Hook shares state across components | Hooks never share — each component gets its own copy |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Build controlled forms — state owns every field
- [ ] Validate on submit, show errors beside inputs
- [ ] Keep multi-step form data in one object
- [ ] Extract logic into custom hooks
- [ ] Build `useLocalStorage`, `useFetch`, `useToggle`
- [ ] Apply the four rules of custom hooks

<br>

### Next Session

**Session 09 — Practice: Capstone Idea** — everything, no new concepts.

---
layout: center
---

# Questions?

### Useful Links

- [React: Building a Form](https://react.dev/learn/primitives)
- [React: Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [MDN: Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
