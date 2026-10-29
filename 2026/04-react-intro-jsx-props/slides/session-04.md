---
theme: default
title: "Session 04 - React Intro, JSX, Props"
info: |
  Your first React app: Vite setup, JSX, components, props, and lists.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# React Intro, JSX, Props

No more manual DOM. Welcome to React.

<br>

### React SPA Course - Session 04

---

# Today's Goals

<br>

- What React is and why it exists
- Vite — scaffold a project in one command
- Project structure — where code lives
- JSX — HTML inside JavaScript
- Components — functions that return UI
- Props — pass data parent → child
- Lists and keys — render arrays of data

---

# Why React?

Remember Session 03? We built every element by hand:

```js
const div = document.createElement('div');
div.innerHTML = `...`;
document.getElementById('app').appendChild(div);
```

**The problems:**
- Data changes? Tear down and rebuild everything
- No reuse — only works for products
- Complex UI = nightmare

> 💡 React flips the model: you **describe** what the UI should look like, React updates the DOM for you.

---

# What Is React?

React is a JavaScript library for building user interfaces.

<br>

### The key idea

You write **components** — small, reusable pieces of UI — and React puts them together.

| Vanilla JS | React |
|---|---|
| Imperatively update DOM | Declaratively describe UI |
| You say **how** | You say **what** |
| Manual `appendChild` | React renders for you |

---
layout: center
---

# 1. Vite — Our Build Tool

One command, dev server, hot reload.

---

# Create a React Project

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

Your app is running at `http://localhost:5173`. Open it in your browser.

> 💡 Vite is pronounced "veet".

---

# Why Vite?

| Vite does | Why it matters |
|---|---|
| Dev server + hot reload | Save a file → browser updates instantly |
| Bundles for production | One optimized build to deploy |
| Handles modern JS | JSX and ES modules just work |

---

# Project Structure

```text
my-app/
├── public/          # Static files (images, favicon)
├── src/             # Your code goes here
│   ├── App.jsx      # Main component
│   ├── main.jsx     # Entry point — mounts React to the DOM
│   └── index.css    # Global styles
├── index.html       # HTML shell (React mounts here)
├── package.json     # Project config
└── vite.config.js   # Vite settings
```

**Don't touch `main.jsx`** — it connects React to the HTML. We work in `App.jsx` and below.

---

# What Vite Gives You

### `index.html` — the shell

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

### `src/main.jsx` — mounts React

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

> 💡 Everything you build renders inside `#root`.

---
layout: center
---

# 2. JSX — HTML in JavaScript

It looks like HTML. It's actually JavaScript.

---

# What JSX Becomes

Every JSX tag is a function call:

```jsx
// This JSX:
const element = <h1>Hello, World!</h1>;

// Is secretly this JavaScript:
const element = React.createElement('h1', null, 'Hello, World!');
```

| You write | React sees |
|---|---|
| `<h1>Hello</h1>` | A function call that returns an object |
| Nested tags | Nested function calls |
| `.jsx` files | Compiled before the browser runs |

> 💡 You never call `createElement` yourself. JSX is the shorthand.

---

# JSX Rule: One Root Element

```jsx
// ✅ Wrap in a div or fragment
return (
  <div>
    <h1>Title</h1>
    <p>Paragraph</p>
  </div>
);

// ❌ Won't work — two root elements
return (
  <h1>Title</h1>
  <p>Paragraph</p>
);
```

---

# JSX Rules: Attributes

```jsx
// ✅ Use className instead of class
<div className="container">

// ✅ Use camelCase for attributes
<input onChange={handleChange} />

// ✅ Self-close empty tags
<img src="photo.jpg" />
<input type="text" />
```

---

# JavaScript Inside JSX

Curly braces let you run any JavaScript expression:

```jsx
const user = { name: 'Mario', age: 30 };

function App() {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{2 + 2}</p>
      <p>{user.age >= 18 ? 'Adult' : 'Minor'}</p>
    </div>
  );
}
```

| Works in `{}` | Doesn't work |
|---|---|
| Expressions: `a + b`, `fn()` | Statements: `if`, `for`, `const` |
| `user.name` | `user` (renders `[object Object]`) |

---
layout: center
---

# 3. Components — Building Blocks

A component is just a function that returns JSX.

---

# Your First Component

```jsx
function Greeting() {
  return <h1>Hello, World!</h1>;
}

// Use it like an HTML tag
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
    </div>
  );
}
```

---

# Component Naming Rules

| Rule | Why |
|---|---|
| Capital letter | `Greeting` ✅, `greeting` ❌ — lowercase is an HTML tag |
| One component per file | Convention, not a rule |
| File matches name | `Greeting.jsx` for `Greeting` |

<br>

> 💡 Components compose. `App` can contain dozens of components, each containing more.

---

# Component Tree

```jsx
function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
```

```text
App
├── Header
├── Main
└── Footer
```

Data flows **down**. Parent → child. Never up. (Props make this work.)

---
layout: center
---

# 4. Props — Passing Data to Components

Props are how a parent gives data to a child.

---

# Passing Props

```jsx
// Define a component that accepts props
function UserCard({ name, email, role }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      <span>{role}</span>
    </div>
  );
}

// Pass props when you use it
function App() {
  return (
    <div>
      <UserCard name="Alice" email="alice@example.com" role="Developer" />
      <UserCard name="Bob" email="bob@example.com" role="Designer" />
    </div>
  );
}
```

One component, two different cards. That's the reuse we were missing.

---

# Props Are Like Function Arguments

```js
// Plain JS function
function greet(name) {
  return 'Hello, ' + name;
}
greet('Alice');

// Component — same idea
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
<Greeting name="Alice" />
```

> 💡 **Props are read-only.** A component can never change its own props.

---

# Destructuring Props

```js
// Without destructuring
function UserCard(props) {
  return <h2>{props.name}</h2>;
}

// With destructuring — cleaner
function UserCard({ name, email, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <span>{role}</span>
    </div>
  );
}
```

Object destructuring from Session 02. You will see this in every React codebase.

---

# Default Props

Give a prop a fallback when none is passed:

```jsx
function Greeting({ name = 'Stranger' }) {
  return <h1>Hello, {name}!</h1>;
}

<Greeting />                 // "Hello, Stranger!"
<Greeting name="Mario" />    // "Hello, Mario!"
```

---

# Props Can Be Any Type

```jsx
<UserCard user={{ name: 'Alice' }} />   // object
<ProductCard inStock={true} />          // boolean
<Counter count={42} />                  // number
<Layout><p>Children</p></Layout>        // JSX as children
```

> 💡 Booleans and numbers need braces `{}`. Strings can use quotes `""`.

---
layout: center
---

# 5. Lists and Keys

Render an array of data with `.map()`.

---

# Rendering Lists

```jsx
function TodoList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}

// In the parent:
<TodoList items={[
  { id: 1, text: 'Learn JSX' },
  { id: 2, text: 'Learn props' },
  { id: 3, text: 'Build something' },
]} />
```

`.map()` transforms each array item into JSX. React renders them all.

---

# Why Keys?

React uses `key` to know which items changed, were added, or removed.

| Key rule | Example |
|---|---|
| Unique among siblings | Not globally unique |
| Use IDs from your data | `item.id` ✅ |
| Never use array index | Breaks when list reorders ❌ |
| Never use random values | New key every render ❌ |

---

# Keys — Good vs Bad

```jsx
// ✅ Good
<li key={item.id}>{item.text}</li>

// ❌ Bad — React can't track items when the list changes
<li key={index}>{item.text}</li>
```

> 💡 Forget the key and React warns you in the console. Fix it immediately.

---
layout: center
---

# Hands-On Time

Let us build our first React app.

---

# Step 1: Create the Project

```bash
npm create vite@latest my-first-react-app -- --template react
cd my-first-react-app
npm install
npm run dev
```

---

# Step 2: Replace App.jsx

Open `src/App.jsx` and replace everything with:

```jsx
function App() {
  return (
    <div>
      <h1>My First React App</h1>
      <p>This is way easier than vanilla JS!</p>
    </div>
  );
}

export default App;
```

Save the file. The browser updates instantly — no manual refresh!

---

# Step 3: Add a Component

Create a `UserCard` above the `App` function:

```jsx
function UserCard({ name, email }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}
```

---

# Step 4: Use It

```jsx
function App() {
  return (
    <div>
      <h1>My Team</h1>
      <UserCard name="Alice" email="alice@example.com" />
      <UserCard name="Bob" email="bob@example.com" />
      <UserCard name="Charlie" email="charlie@example.com" />
    </div>
  );
}
```

Save and see three user cards rendered in the browser.

---
layout: center
---

# Try It Yourself

---

# Exercises

| Level | Task |
|---|---|
| 🟢 Easy | `Greeting` component with a `name` prop. Use it three times. |
| 🟡 Medium | `ProductCard` with `name`, `price`, `inStock`. Show "In Stock" / "Out of Stock". |
| 🔴 Challenge | Array of products → `.map()` to render `ProductCard` for each. Don't forget `key`. |

<br>

> 💡 Start with Easy. Only move to Medium when Easy works.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| "Adjacent elements must be wrapped" | Multiple roots — wrap in `<div>` or `<>...</>` |
| "className is not defined" | Use `className`, not `class` |
| Props show `[object Object]` | Access a property: `{user.name}` not `{user}` |
| Key warning in console | Missing `key`, or used array index |
| Component renders as text | Lowercase name — capitalize it |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Create a Vite React project
- [ ] Explain what JSX is and its rules
- [ ] Create function components
- [ ] Pass and receive props
- [ ] Render lists with `.map()` and `key` props
- [ ] Understand the component tree (parent → child)

<br>

### Next Session

**Session 05 — State, events, styling** — make components respond to the user.

---
layout: center
---

# Questions?

### Useful Links

- [React Official Tutorial](https://react.dev/learn)
- [Vite Documentation](https://vitejs.dev/guide/)
- [JSX Introduction](https://react.dev/learn/writing-markup-with-jsx)
- [Props Documentation](https://react.dev/learn/passing-props-to-a-component)
