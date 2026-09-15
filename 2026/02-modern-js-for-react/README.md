# Session 02 — Modern JavaScript for React

## What We're Learning Today

React is written in JavaScript, so we need to level up our JS skills first. Today covers the specific language features you'll see in every React project — destructuring, arrow functions, array methods, promises, and async/await.

## Prerequisites

- Session 01 completed (understand modules, npm, DevTools)
- A code editor and terminal open

## Concepts

### 1. Destructuring — Extract Values from Objects/Arrays

Instead of writing `person.name` and `person.age` over and over, pull them out in one line:

```javascript
// Without destructuring
const name = person.name;
const age = person.age;

// With destructuring — same thing, cleaner
const { name, age } = person;

// Works with arrays too
const [first, second] = ['apple', 'banana'];
// first = 'apple', second = 'banana'
```

**Why you'll see this everywhere in React:**
```javascript
// React props come like this:
function Greeting({ name, age }) {
  return <p>{name} is {age} years old</p>;
}
```

### 2. Arrow Functions — Shorter Way to Write Functions

```javascript
// Old way
function add(a, b) {
  return a + b;
}

// Arrow function — same thing
const add = (a, b) => {
  return a + b;
};

// Even shorter — if it's one expression, skip the braces and "return"
const add = (a, b) => a + b;
```

**One parameter? Skip the parentheses:**
```javascript
const double = x => x * 2;
```

**No parameters? Use empty parentheses:**
```javascript
const sayHello = () => 'Hello!';
```

### 3. Template Literals — String Interpolation

Use backticks (`` ` ``) and `${variable}` to build strings:

```javascript
const name = 'Mario';
const age = 30;

// Old way — concatenation
const msg = 'My name is ' + name + ' and I am ' + age + ' years old';

// Template literal — readable!
const msg = `My name is ${name} and I am ${age} years old`;
```

**Multi-line strings too:**
```javascript
const html = `
  <div>
    <h1>${name}</h1>
    <p>${age}</p>
  </div>
`;
```

### 4. Spread/Rest Operator (`...`)

Same three dots, two different uses:

**Spread — expand an array or object:**
```javascript
const nums = [1, 2, 3];
const moreNums = [...nums, 4, 5]; // [1, 2, 3, 4, 5]

const person = { name: 'Mario', age: 30 };
const olderPerson = { ...person, age: 31 }; // { name: 'Mario', age: 31 }
```

**Rest — collect remaining items into an array:**
```javascript
const [first, ...rest] = [1, 2, 3, 4];
// first = 1, rest = [2, 3, 4]

function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3); // 6
```

### 5. Array Methods — map, filter, reduce, find

These four methods will appear in every React project:

**map — transform each item:**
```javascript
const names = ['Alice', 'Bob', 'Charlie'];
const upper = names.map(name => name.toUpperCase());
// ['ALICE', 'BOB', 'CHARLIE']

// In React — turn data into JSX
const items = names.map(name => <li key={name}>{name}</li>);
```

**filter — keep items that pass a test:**
```javascript
const nums = [1, 2, 3, 4, 5, 6];
const evens = nums.filter(n => n % 2 === 0);
// [2, 4, 6]
```

**reduce — combine into a single value:**
```javascript
const nums = [1, 2, 3, 4];
const total = nums.reduce((sum, n) => sum + n, 0);
// 10
```

**find — get the first match:**
```javascript
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const user = users.find(u => u.id === 2);
// { id: 2, name: 'Bob' }
```

### 6. Promises — Handling Async Operations

When you fetch data from a server, it takes time. Promises handle "I'll get back to you":

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())  // when data arrives, parse it
  .then(data => console.log(data))     // then use it
  .catch(error => console.error(error)); // if something breaks
```

### 7. async/await — Promises, Made Readable

`async/await` does the same thing as `.then()` but reads like normal code:

```javascript
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

**Rule:** You can only use `await` inside an `async` function. The `await` pauses until the promise resolves.

### 8. fetch — Getting Data from APIs

`fetch` is built into browsers. It returns a promise:

```javascript
// Simple GET request
const response = await fetch('https://api.github.com/users/mario');
const user = await response.json();
console.log(user.name);
```

**With options (POST, headers, etc.):**
```javascript
const response = await fetch('https://api.example.com/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Hello', body: 'World' })
});
```

## Step-by-Step Walkthrough

1. Create a new file `modern-js.js` in your `01-web-basics` folder
2. Add each example from above, one section at a time
3. Run it with `node modern-js.js` in the terminal
4. Try modifying the values — change the arrays, change the objects, see what happens

## Try It Yourself

1. **Easy:** Destructure this object and log the values:
   ```javascript
   const product = { name: 'Laptop', price: 999, inStock: true };
   ```

2. **Medium:** Use `.map()` to create an array of HTML strings from this list:
   ```javascript
   const colors = ['red', 'green', 'blue'];
   // Expected: ['<li>red</li>', '<li>green</li>', '<li>blue</li>']
   ```

3. **Challenge:** Use `async/await` and `fetch` to get data from `https://jsonplaceholder.typicode.com/todos/1` and log the title. (Don't worry if it feels weird — we'll practice this more later.)

## Common Mistakes & How to Fix Them

- **"Cannot use 'await' outside async function"** — Wrap your code in an `async function` or use a top-level `.then()` chain
- **map/filter returns undefined** — You forgot to use the return value. Store it: `const result = arr.map(...)`
- **Spread creates a shallow copy** — `{ ...obj }` copies top-level properties only. Nested objects are still shared references

## Recap / Checklist

After today, you should be able to:

- [ ] Use destructuring for objects and arrays
- [ ] Write arrow functions (with and without parentheses/braces)
- [ ] Use template literals for string interpolation
- [ ] Use spread to expand arrays/objects
- [ ] Use map, filter, reduce, and find on arrays
- [ ] Write async/await functions
- [ ] Use fetch to call an API

## Useful Links

- [MDN: Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [MDN: Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN: Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [JavaScript.info: Promises](https://javascript.info/promise-basics)
- [JavaScript.info: Async/Await](https://javascript.info/async-await)
