# Session 04 — React Intro, JSX, Props

## What We're Learning Today

Welcome to React! Today we set up our first React project, learn what JSX is, and understand how props let us pass data between components. By the end, you'll have a working React app.

## Prerequisites

- Sessions 01-03 completed (understand vanilla JS, DOM, fetch)
- Node.js v18+ installed
- Terminal ready

## Concepts

### 1. What Is React?

React is a JavaScript library for building user interfaces. Instead of manually manipulating the DOM (like we did in Session 03), you describe what the UI should look like, and React figures out how to update it efficiently.

**The key idea:** You write components — small, reusable pieces of UI — and React puts them together.

### 2. Vite — Our Build Tool

Vite (pronounced "veet") is a tool that:
- Starts a development server with hot reload (changes appear instantly)
- Bundles your code for production
- Handles modern JavaScript features

**Create a new React project:**

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

Your app is now running at `http://localhost:5173`. Open it in your browser.

### 3. Project Structure

```
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

### 4. JSX — HTML in JavaScript

JSX looks like HTML but it's actually JavaScript. Every JSX tag becomes a function call:

```jsx
// This JSX:
const element = <h1>Hello, World!</h1>;

// Is secretly this JavaScript:
const element = React.createElement('h1', null, 'Hello, World!');
```

**JSX rules (these will bite you if you forget):**

```jsx
// ✅ One root element — wrap in a div or fragment
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

// ✅ Use className instead of class
<div className="container">

// ✅ Use camelCase for attributes
<input onChange={handleChange} />

// ✅ Self-close empty tags
<img src="photo.jpg" />
<input type="text" />

// ✅ JavaScript in curly braces
<h1>{user.name}</h1>
<p>{2 + 2}</p>
```

### 5. Components — Building Blocks

A component is just a function that returns JSX:

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

**Component naming rules:**
- Start with a capital letter: `Greeting` ✅, `greeting` ❌
- One component per file (convention, not rule)
- File name matches component name: `Greeting.jsx`

### 6. Props — Passing Data to Components

Props are how you pass data from a parent component to a child:

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

**Props are read-only.** A component can never change its own props. Think of them as function arguments — you receive them, you don't modify them.

**Default props:**
```jsx
function Greeting({ name = 'Stranger' }) {
  return <h1>Hello, {name}!</h1>;
}

<Greeting />          // "Hello, Stranger!"
<Greeting name="Mario" />  // "Hello, Mario!"
```

### 7. Lists and Keys

When rendering arrays of data, each item needs a unique `key` prop:

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
```

**Why keys?** React uses keys to know which items changed, were added, or removed. Without keys, React warns you and updates inefficiently.

**Rules for keys:**
- Must be unique among siblings (not globally)
- Use IDs from your data, not array indices
- Never generate random values as keys

## Step-by-Step Walkthrough

1. Create your React project:
   ```bash
   npm create vite@latest my-first-react-app -- --template react
   cd my-first-react-app
   npm install
   npm run dev
   ```

2. Open `src/App.jsx` and replace everything with:

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

3. Save the file. The browser updates instantly — no manual refresh!

4. Now create a `UserCard` component. Add this above the `App` function:

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

5. Use it inside `App`:

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

6. Save and see three user cards rendered in the browser.

## Try It Yourself

1. **Easy:** Create a `Greeting` component that takes a `name` prop and displays "Hello, {name}!" Use it three times with different names.

2. **Medium:** Create a `ProductCard` component that takes `name`, `price`, and `inStock` props. Show "In Stock" or "Out of Stock" based on the boolean.

3. **Challenge:** Create an array of products and use `.map()` to render a `ProductCard` for each one.

## Common Mistakes & How to Fix Them

- **"Adjacent elements must be wrapped"** — You have multiple root elements. Wrap them in a `<div>` or `<>...</>` (fragment)
- **"className is not defined"** — Use `className` instead of `class` in JSX
- **Props show as `{object Object}`** — You're passing an object directly. Access a property: `{user.name}` not `{user}`
- **Key warning in console** — You forgot the `key` prop on a mapped element, or used the array index as key

## Recap / Checklist

After today, you should be able to:

- [ ] Create a Vite React project
- [ ] Explain what JSX is and its rules
- [ ] Create function components
- [ ] Pass and receive props
- [ ] Render lists with `.map()` and `key` props
- [ ] Understand the component tree (parent → child)

## Useful Links

- [React Official Tutorial](https://react.dev/learn)
- [Vite Documentation](https://vitejs.dev/guide/)
- [JSX Introduction](https://react.dev/learn/writing-markup-with-jsx)
- [Props Documentation](https://react.dev/learn/passing-props-to-a-component)
