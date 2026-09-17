---
theme: default
title: "Session 02 - Modern JavaScript for React"
info: |
  The JS features you will see in every React project.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Modern JavaScript for React

React is written in JavaScript. Let us level up our JS skills.

<br>

### React SPA Course - Session 02

---

# Today's Goals

<br>

- Destructuring - extract values cleanly
- Arrow functions - shorter syntax
- Template literals - string interpolation
- Spread/Rest - expand and collect
- Array methods - map, filter, reduce, find
- Promises and async/await - handle async data
- fetch - call APIs

---
layout: center
---

# 1. Destructuring

Pull values out of objects and arrays in one line.

---

# Object Destructuring

<br>

```js
// Without destructuring
const name = person.name;
const age = person.age;

// With destructuring
const { name, age } = person;
```

<br>

### Why you will see this everywhere in React

```js
// React props come like this:
function Greeting({ name, age }) {
  return `<p>${name} is ${age} years old</p>`;
}
```

---

# Array Destructuring

<br>

```js
const [first, second] = ['apple', 'banana'];
// first = 'apple'
// second = 'banana'
```

<br>

### Real use case - useState

```js
const [count, setCount] = useState(0);
//      value    setter
```

> You will see this pattern constantly in React. It is how we extract values from arrays.

---
layout: center
---

# 2. Arrow Functions

Shorter way to write functions.

---

# Arrow Functions

<br>

```js
// Old way
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => {
  return a + b;
};

// Even shorter - one expression, skip braces and return
const add = (a, b) => a + b;
```

<br>

| Syntax | When to use |
|---|---|
| `const fn = () => {}` | No parameters |
| `const fn = x => {}` | One parameter |
| `const fn = (a, b) => {}` | Multiple parameters |

---

# Arrow Functions in React

<br>

```js
// Event handlers
<button onClick={() => console.log('clicked')}>

// Array methods
items.map(item => `<li>${item.name}</li>`)

// Conditional rendering
isLoggedIn ? Dashboard() : Login()
```

<br>

> Arrow functions are everywhere in React. Get comfortable with them.

---
layout: center
---

# 3. Template Literals

Build strings with variables inside them.

---

# Template Literals

<br>

```js
const name = 'Mario';
const age = 30;

// Old way - concatenation
const msg = 'My name is ' + name + ' and I am ' + age + ' years old';

// Template literal - readable
const msg = `My name is ${name} and I am ${age} years old`;
```

<br>

### Multi-line strings

```js
const html = `
  <div>
    <h1>${name}</h1>
    <p>${age}</p>
  </div>
`;
```

> Use backticks, not quotes. `${}` inserts variables.

---
layout: center
---

# 4. Spread / Rest

Three dots, two different uses.

---

# Spread - Expand

<br>

```js
// Arrays
const nums = [1, 2, 3];
const moreNums = [...nums, 4, 5];
// [1, 2, 3, 4, 5]

// Objects
const person = { name: 'Mario', age: 30 };
const older = { ...person, age: 31 };
// { name: 'Mario', age: 31 }
```

<br>

### Why this matters in React

```js
// Never mutate state directly
setTodos([...todos, newTodo]);  // correct - new array
todos.push(newTodo);            // wrong - mutation
```

---

# Rest - Collect

<br>

```js
// Collect remaining array items
const [first, ...rest] = [1, 2, 3, 4];
// first = 1
// rest = [2, 3, 4]
```

<br>

```js
// Collect remaining function arguments
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3); // 6
```

<br>

> Spread expands, Rest collects. Same syntax, opposite purpose.

---
layout: center
---

# 5. Array Methods

These four will appear in every React project.

---

# map - Transform Each Item

<br>

```js
const names = ['Alice', 'Bob', 'Charlie'];
const upper = names.map(name => name.toUpperCase());
// ['ALICE', 'BOB', 'CHARLIE']
```

<br>

### In React - turn data into UI

```js
const items = names.map(name => (
  `<li>${name}</li>`
));
```

<br>

| Method | Returns |
|---|---|
| `map()` | New array (same length) |
| `forEach()` | undefined (just runs) |

---

# filter - Keep What Passes

<br>

```js
const nums = [1, 2, 3, 4, 5, 6];
const evens = nums.filter(n => n % 2 === 0);
// [2, 4, 6]
```

<br>

### In React - filter a list

```js
const activeUsers = users.filter(user => user.isActive);

activeUsers.map(user => (
  UserCard(user)
));
```

---

# reduce - Combine Into One Value

<br>

```js
const nums = [1, 2, 3, 4];
const total = nums.reduce((sum, n) => sum + n, 0);
// 10
```

<br>

### In React - calculate something

```js
const cartTotal = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);
```

<br>

> reduce is the most powerful array method. It can do what map and filter do.

---

# find - Get First Match

<br>

```js
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const user = users.find(u => u.id === 2);
// { id: 2, name: 'Bob' }
```

<br>

### In React - get one item

```js
const movie = movies.find(m => m.id === Number(movieId));
```

---
layout: center
---

# 6. Promises and Async/Await

How to handle data that takes time to arrive.

---

# Promises

When you fetch data, it takes time. Promises handle "I will get back to you":

<br>

```js
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

<br>

| Method | What it does |
|---|---|
| `.then()` | Runs when promise resolves |
| `.catch()` | Runs when promise fails |
| `.finally()` | Runs either way |

---

# async / await - Same Thing, Readable

<br>

```js
async function getData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

<br>

| Rule | Example |
|---|---|
| await only inside async | `async function fn() { await ... }` |
| await pauses until resolved | `const data = await fetch(url)` |
| Use try/catch for errors | Same as `.catch()` |

---
layout: center
---

# 7. fetch - Call APIs

Built into browsers. Returns a promise.

---

# fetch Basics

<br>

```js
// Simple GET request
const response = await fetch('https://api.github.com/users/mario');
const user = await response.json();
console.log(user.name);
```

<br>

### With options

```js
const response = await fetch('https://api.example.com/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Hello', body: 'World' })
});
```

<br>

### Check if response is OK

```js
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();
```

---
layout: center
---

# Hands-On Time

Let us practice each concept.

---

# Create Your Practice File

<br>

1. Create `modern-js.js` in your `01-web-basics` folder
2. Add each example, one section at a time
3. Run with `node modern-js.js`

<br>

```bash
node modern-js.js
```

<br>

> Modify the values. Change the arrays, change the objects. See what happens.

---
layout: center
---

# Try It Yourself

---

# Exercises

<br>

| Level | Task |
|---|---|
| Easy | Destructure this: `const product = { name: 'Laptop', price: 999, inStock: true }` |
| Medium | Use `.map()` to create HTML list items from `['red', 'green', 'blue']` |
| Challenge | Use async/await and fetch to get data from jsonplaceholder.typicode.com/todos/1 |

<br>

> Start with Easy. Only move to Medium when Easy works.

---

# Common Mistakes

<br>

| Problem | Fix |
|---|---|
| Cannot use await outside async | Wrap in `async function` |
| map returns undefined | Store the result: `const result = arr.map(...)` |
| Spread creates shallow copy | Nested objects are still shared references |

---
layout: center
---

# Recap

---

# What We Covered Today

<br>

- Destructuring - `{ name, age }` from objects, `[a, b]` from arrays
- Arrow functions - `() => {}` shorter syntax
- Template literals - backticks with `${}` for strings
- Spread/Rest - `...` to expand or collect
- map/filter/reduce/find - array methods you will use daily
- Promises and async/await - handle async operations
- fetch - call APIs from the browser

---

# Next Session

**Session 03 - Vanilla JS Fetch Mini-App**

We build a small app with plain JavaScript. No React yet. This will show us why React exists.

---
layout: center
---

# Questions?

<br>

### Useful Links

- MDN: Destructuring Assignment
- MDN: Arrow Functions
- MDN: Array Methods
- JavaScript.info: Promises
- JavaScript.info: Async/Await
