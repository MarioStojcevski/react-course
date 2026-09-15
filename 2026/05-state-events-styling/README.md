# Session 05 — State, Events, Styling

## What We're Learning Today

Components can't just display static data — they need to respond to user actions. Today we learn `useState` to make components remember things, event handlers to respond to clicks/input, and CSS Modules for styling.

## Prerequisites

- Sessions 01-04 completed (understand JSX, components, props)
- A Vite React project from Session 04

## Concepts

### 1. State — Making Components Remember

State is data that changes over time. When state changes, React re-renders the component (updates what's on screen).

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

**How `useState` works:**
- `useState(0)` — creates a state variable with initial value `0`
- Returns `[count, setCount]` — the current value and a function to change it
- `setCount(count + 1)` — tells React to update the value and re-render

**Rules of hooks:**
- Only call hooks at the top level (not inside loops, conditions, or nested functions)
- Only call hooks from React functions (components or custom hooks)
- Hook names always start with `use`

### 2. Event Handling — Responding to User Actions

JSX events use camelCase and take functions:

```jsx
function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return <button onClick={handleClick}>Click Me</button>;
}
```

**Common events:**
```jsx
// Click
<button onClick={() => console.log('clicked')}>Click</button>

// Input change
<input onChange={(e) => console.log(e.target.value)} />

// Form submit
<form onSubmit={(e) => { e.preventDefault(); /* handle submit */ }}>
  <button type="submit">Send</button>
</form>

// Mouse enter/leave
<div onMouseEnter={() => console.log('hovered')}>Hover me</div>
```

**Always use `e.preventDefault()` for forms** — otherwise the browser reloads the page.

### 3. Multiple State Updates — Todo List Example

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
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Key concepts:**
- `value={input}` — controlled input (React controls the value)
- `onChange={(e) => setInput(e.target.value)}` — update state on every keystroke
- Never mutate state directly: `todos.push(newTodo)` ❌, `setTodos([...todos, newTodo])` ✅

### 4. Conditional Rendering

Show different UI based on state:

```jsx
function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOn(!isOn)}>
        {isOn ? 'ON' : 'OFF'}
      </button>

      {/* Conditional rendering — multiple approaches */}

      {/* 1. Ternary operator */}
      {isOn ? <p>Light is on</p> : <p>Light is off</p>}

      {/* 2. Short-circuit evaluation */}
      {isOn && <p>The light is shining!</p>}

      {/* 3. Variable */}
      {isOn ? <span style={{ color: 'green' }}>Active</span> : <span style={{ color: 'red' }}>Inactive</span>}
    </div>
  );
}
```

### 5. CSS Modules — Scoped Styles

CSS Modules give each component its own isolated styles. No conflicts, no naming headaches.

**Create `Button.module.css`:**
```css
.button {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #2563eb;
}

.primary {
  background-color: #10b981;
}

.primary:hover {
  background-color: #059669;
}
```

**Use it in your component:**
```jsx
import styles from './Button.module.css';

function Button({ children, primary }) {
  const className = primary
    ? `${styles.button} ${styles.primary}`
    : styles.button;

  return (
    <button className={className}>{children}</button>
  );
}
```

**Why CSS Modules?**
- Each component's styles are isolated — no global conflicts
- Class names are hashed: `.button_x7k2f` instead of `.button`
- You import exactly what you need — unused styles get removed
- No class name collisions between different components

### 6. Inline Styles

For dynamic styles that depend on state, use inline styles (as an object):

```jsx
function ColorPicker() {
  const [color, setColor] = useState('#000000');

  return (
    <div>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <div style={{ backgroundColor: color, padding: '50px', color: 'white' }}>
        Background is {color}
      </div>
    </div>
  );
}
```

**Rule:** Use CSS Modules for static styles. Use inline styles only when the value depends on state/props.

## Step-by-Step Walkthrough

1. Open your Vite React project from Session 04
2. Create `src/Counter.jsx`:

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

3. Create `src/TodoList.jsx`:

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

4. Update `src/App.jsx`:

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

5. Save files and test — try adding/removing todos and clicking the counter.

## Try It Yourself

1. **Easy:** Add a "Decrease" button to the Counter that subtracts 1. Add a "Reset" button that sets count to 0.

2. **Medium:** Create a `VisibilityToggle` component. When a button is clicked, show/hide a paragraph of text.

3. **Challenge:** Create a `ColorPicker` component with three color buttons (red, green, blue). Clicking a button changes the background color of the page.

## Common Mistakes & How to Fix Them

- **State doesn't update immediately after `setState`** — `setState` is async. If you need the new value right away, use the functional form: `setCount(prev => prev + 1)`
- **Infinite re-render loop** — You're calling `setState` inside the render body without proper dependencies. Move it into an event handler
- **Input feels janky** — Make sure you're using a controlled input with `value` and `onChange` together
- **CSS not applying** — CSS Module class names are accessed as properties: `styles.button`, not `"button"`

## Recap / Checklist

After today, you should be able to:

- [ ] Use `useState` to create and update state
- [ ] Handle click, change, and submit events
- [ ] Create controlled inputs
- [ ] Render lists conditionally and with `.map()`
- [ ] Use CSS Modules for scoped styling
- [ ] Use inline styles for dynamic values

## Useful Links

- [React: State Management](https://react.dev/learn/state-a-components-memory)
- [React: Handling Events](https://react.dev/learn/responding-to-events)
- [React: Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
