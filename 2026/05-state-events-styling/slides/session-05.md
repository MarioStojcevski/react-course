---
theme: default
title: "Session 05 - State, Events, Styling"
info: |
  Make components respond to the user: useState, event handlers,
  controlled inputs, conditional rendering, and CSS Modules.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# State, Events, Styling

Static no more. Components that remember and react.

<br>

### React SPA Course - Session 05

---

# Today's Goals

<br>

- State — `useState`, the component's memory
- Events — respond to clicks, input, submits
- Controlled inputs — React owns the form value
- Conditional rendering — show UI based on state
- CSS Modules — scoped, conflict-free styles
- Inline styles — dynamic values from state

---

# Where We Left Off

Session 04 components render the same UI forever:

```jsx
function Counter() {
  return <p>Count: 0</p>;   // forever 0
}
```

**The problems:**
- Props are read-only — a component can't change them
- No memory — every render is identical
- No response to clicks or typing

> 💡 State fixes all three: data that lives **inside** the component and changes over time.

---
layout: center
---

# 1. State — A Component's Memory

State is data that changes. When it changes, React re-renders.

---

# Props vs State

| Props | State |
|---|---|
| Passed in by the parent | Owned by the component itself |
| Read-only | Changed only through its setter |
| Changes when the parent re-renders | Changes trigger a re-render |
| Configures the component | Tracks interaction over time |

> 💡 A good rule: if a value never changes while visible, it's a prop. If it changes, it's state.

---

# Your First State

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Add 1
      </button>
    </div>
  );
}
```

| Piece | Meaning |
|---|---|
| `useState(0)` | Create state, initial value `0` |
| `count` | Current value — read it like a normal variable |
| `setCount` | The only way to change it |

---

# The Re-Render Cycle

```text
1. Component renders        → screen shows count: 0
2. User clicks button       → handler runs setCount(1)
3. React re-renders         → screen shows count: 1
4. Repeat
```

```jsx
<button onClick={() => setCount(count + 1)}>Add 1</button>
//                    ^^^^^^^^^^^^^^^^^^^^ reads THIS render's count
```

> 💡 You never touch the DOM. Describe the UI for the new state — React updates the screen.

---

# Rules of Hooks

- Only call hooks at the **top level** — never in loops, conditions, or nested functions
- Only call hooks from **React functions** — components or custom hooks
- Hook names always start with `use` — `useState`, `useEffect`, `useRef`

```jsx
// ❌ Conditional hook — breaks the rule
if (visible) {
  const [count, setCount] = useState(0);
}

// ✅ Always call, use the value conditionally
const [count, setCount] = useState(0);
```

---

# State Updates Are Async

React batches updates. The next render sees the result — not your code.

```jsx
// ❌ Both lines read count = 0 from this render → ends at 1
setCount(count + 1);
setCount(count + 1);

// ✅ Functional form — each update receives the previous value → ends at 2
setCount(prev => prev + 1);
setCount(prev => prev + 1);
```

**Use the functional form when:**
- You update based on the previous value
- One handler triggers multiple updates

---

# Never Mutate State

```jsx
// ❌ Mutating the same array — React doesn't see a change
todos.push(newTodo);
setTodos(todos);

// ✅ New array, new reference — React re-renders
setTodos([...todos, newTodo]);

// ✅ Remove / update — always build a new array
setTodos(todos.filter(t => t.id !== id));
```

> 💡 Treat state as immutable. React compares references to decide what to update.

---
layout: center
---

# 2. Events — Responding to the User

JSX events: camelCase, and they take functions — not strings.

---

# Handling Clicks

```jsx
function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return <button onClick={handleClick}>Click Me</button>;
}
```

```jsx
// ✅ Function reference
<button onClick={handleClick}>

// ✅ Inline arrow — needed when you pass arguments
<button onClick={() => setCount(count + 1)}>

// ❌ String — that's old HTML/React 0.x style
<button onclick="handleClick()">
```

---

# Common Events

| Event | Fires when |
|---|---|
| `onClick` | Element clicked |
| `onChange` | Input, select, or textarea changes |
| `onSubmit` | Form submitted |
| `onKeyDown` | Key pressed down |
| `onMouseEnter` / `onMouseLeave` | Cursor enters / leaves |

```jsx
<div onMouseEnter={() => console.log('hovered')}>Hover me</div>
<input onChange={(e) => console.log(e.target.value)} />
```

---

# The Event Object

Handlers receive an event — `e` for short:

```jsx
// Read the current input value
<input onChange={(e) => console.log(e.target.value)} />

// Stop the browser's default behavior
<form onSubmit={(e) => {
  e.preventDefault();
  // handle submit — page does NOT reload
}}>
```

> 💡 Always call `e.preventDefault()` in form handlers, or the browser reloads the page and wipes your state.

---
layout: center
---

# 3. Controlled Inputs

React state drives the input — not the other way around.

---

# What Makes an Input "Controlled"?

Two pieces, used together:

```jsx
const [input, setInput] = useState('');

<input
  value={input}                              // React shows the value
  onChange={(e) => setInput(e.target.value)}  // every keystroke updates state
  placeholder="Add a todo..."
/>
```

| Piece | Job |
|---|---|
| `value={input}` | The input always displays current state |
| `onChange` | Keystrokes write back into state |

> 💡 One source of truth: state. The input is just a view of it.

---

# A Full Example: TodoList

```jsx
import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  function addTodo() {
    if (input.trim() === '') return;
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput('');
  }

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
      </ul>
    </div>
  );
}
```

---

# What Just Happened

- Two state variables — `todos` (the list) and `input` (the text box)
- `addTodo` appends immutably: `[...todos, newTodo]`
- After adding, `setInput('')` clears the controlled input
- `.map()` renders the list — keys from `id`, from Session 04

**Remove works the same way:**

```jsx
function removeTodo(id) {
  setTodos(todos.filter(todo => todo.id !== id));
}
```

> 💡 Adding, clearing, removing — three state updates, one click.

---
layout: center
---

# 4. Conditional Rendering

Show different UI based on state. Plain JavaScript logic in JSX.

---

# Three Approaches

```jsx
const [isOn, setIsOn] = useState(false);

// 1. Ternary — either / or
{isOn ? <p>Light is on</p> : <p>Light is off</p>}

// 2. Short-circuit — render only when true
{isOn && <p>The light is shining!</p>}

// 3. Early return — whole component based on state
if (!user) return <p>Please log in.</p>;
```

Pick one and stay consistent inside a file.

---

# The `&&` Gotcha

```jsx
// ❌ When count is 0, React renders "0" on screen
{count && <p>Has items</p>}

// ✅ Compare explicitly
{count > 0 && <p>Has items</p>}
```

| Expression | Renders when `count = 0` |
|---|---|
| `{count && <p>Hi</p>}` | `0` 😬 |
| `{count > 0 && <p>Hi</p>}` | nothing ✅ |

> 💡 `&&` renders whatever is on the left when it's truthy — and `0` is renderable.

---
layout: center
---

# 5. CSS Modules — Scoped Styles

One component, its own styles. No global collisions.

---

# The Global CSS Problem

```css
/* index.css — affects EVERYTHING */
.button {
  background-color: #3b82f6;
}
```

Now every `.button` on the page changes — including ones you didn't want to touch.

**CSS Modules fix it:**

```css
/* Button.module.css — only this component */
.button {
  background-color: #3b82f6;
}
```

React hashes the class: `.button_x7k2f`. Scoped by construction.

---

# Using a CSS Module

Create `Button.module.css`:

```css
.button {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.button:hover { background-color: #2563eb; }
.primary { background-color: #10b981; }
```

Import and use it:

```jsx
import styles from './Button.module.css';

function Button({ children, primary }) {
  const className = primary
    ? `${styles.button} ${styles.primary}`
    : styles.button;
  return <button className={className}>{children}</button>;
}
```

---

# CSS Modules Rules

- File must end in `.module.css` — `styles.css` stays global
- Access classes as properties: `styles.button` ✅, `styles["button"]` ✅, `"button"` ❌
- Combine classes with template literals or `clsx`-style helpers
- Unused classes are dropped from the build

| Why CSS Modules | |
|---|---|
| Isolated per component | No global conflicts |
| Hashed names | `.button_x7k2f` can't collide |
| Imported explicitly | Only what you use ships |

---
layout: center
---

# 6. Inline Styles — Dynamic Values

When the style itself depends on state, use an inline style object.

---

# Inline Styles

```jsx
function ColorPicker() {
  const [color, setColor] = useState('#000000');

  return (
    <div>
      <input type="color" value={color}
             onChange={(e) => setColor(e.target.value)} />
      <div style={{ backgroundColor: color, padding: '50px', color: 'white' }}>
        Background is {color}
      </div>
    </div>
  );
}
```

- Double braces: outer `{}` = JSX expression, inner `{}` = the style object
- camelCase keys: `backgroundColor`, `fontSize`, `borderRadius`
- Values are strings: `'16px'`, `'#3b82f6'`

---

# CSS Modules or Inline?

| Use | When |
|---|---|
| CSS Modules | Static styles — anything that doesn't change |
| Inline styles | Values that come from state or props |

```jsx
// ✅ Static → CSS Module
<button className={styles.button}>Save</button>

// ✅ Dynamic → inline
<div style={{ backgroundColor: isOn ? 'green' : 'gray' }} />
```

> 💡 One rule of thumb: if you'd write it the same on every render, it belongs in a CSS Module.

---
layout: center
---

# Hands-On Time

Open your Vite project from Session 04. Let's make it interactive.

---

# Step 1: Counter.jsx

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Counter</h2>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default Counter;
```

Three buttons, one piece of state.

---

# Step 2: TodoList.jsx

```jsx
import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  function addTodo() {
    if (input.trim() === '') return;
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput('');
  }

  function removeTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  return (
    <div>
      <h2>Todo List</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
```

---

# Step 3: App.jsx

```jsx
import Counter from './Counter';
import TodoList from './TodoList';

function App() {
  return (
    <div>
      <h1>Session 05 App</h1>
      <Counter />
      <TodoList />
    </div>
  );
}

export default App;
```

Save and test — click the counter, add and remove todos, press Enter to add.

---
layout: center
---

# Try It Yourself

---

# Exercises

| Level | Task |
|---|---|
| 🟢 Easy | Add a "Decrease" button (`-1`) and a "Reset" button to Counter. |
| 🟡 Medium | `VisibilityToggle` — click a button to show/hide a paragraph. |
| 🔴 Challenge | `ColorPicker` — three color buttons (red, green, blue) change the page background. |

<br>

> 💡 Start with Easy. Only move on when it works in the browser.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| State doesn't change when you expect | Updates are async — use `setCount(prev => prev + 1)` |
| Infinite re-render loop | `setState` in the render body — move it into an event handler |
| Input feels janky or won't type | Controlled input needs `value` **and** `onChange` together |
| CSS class not applying | Access as `styles.button`, and the file must be `.module.css` |
| List items lose state / key warning | Missing `key`, or you used the array index |
| Style inline objects everywhere | Static styles → CSS Modules; inline only for dynamic values |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Create and update state with `useState`
- [ ] Handle click, change, and submit events
- [ ] Build controlled inputs with `value` + `onChange`
- [ ] Render lists and UI conditionally
- [ ] Scope styles with CSS Modules
- [ ] Use inline styles for state-driven values

<br>

### Next Session

**Session 06 — Practice: Component-Driven UI** — build a full UI from components.

---
layout: center
---

# Questions?

### Useful Links

- [React: State — A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React: Responding to Events](https://react.dev/learn/responding-to-events)
- [React: Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
