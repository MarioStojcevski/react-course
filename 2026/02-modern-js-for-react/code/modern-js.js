// ============================================
// Session 02 - Modern JavaScript for React
// Practice file - run with: node modern-js.js
// ============================================

// 1. DESTRUCTURING
console.log('=== Destructuring ===');

const person = { name: 'Mario', age: 30, city: 'Skopje' };

// Object destructuring
const { name, age } = person;
console.log(name, age); // Mario 30

// Array destructuring
const colors = ['red', 'green', 'blue'];
const [first, second] = colors;
console.log(first, second); // red green

// TODO: Destructure this object and log the values
const product = { name: 'Laptop', price: 999, inStock: true };


// 2. ARROW FUNCTIONS
console.log('\n=== Arrow Functions ===');

// Old way
function addOld(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

console.log(add(2, 3)); // 5

// TODO: Create an arrow function called "double" that takes a number and returns it multiplied by 2


// 3. TEMPLATE LITERALS
console.log('\n=== Template Literals ===');

const userName = 'Alice';
const userAge = 25;

// Old way
const msgOld = 'My name is ' + userName + ' and I am ' + userAge + ' years old';

// Template literal
const msg = `My name is ${userName} and I am ${userAge} years old`;

console.log(msg);

// TODO: Create a multi-line template literal that generates an HTML card:
// `
//   <div class="card">
//     <h2>${name}</h2>
//     <p>Price: $${price}</p>
//   </div>
// `


// 4. SPREAD / REST
console.log('\n=== Spread / Rest ===');

// Spread - expand
const nums = [1, 2, 3];
const moreNums = [...nums, 4, 5];
console.log(moreNums); // [1, 2, 3, 4, 5]

// Spread objects
const user1 = { name: 'Alice', age: 25 };
const user2 = { ...user1, city: 'London' };
console.log(user2); // { name: 'Alice', age: 25, city: 'London' }

// Rest - collect
const [firstItem, ...rest] = [10, 20, 30, 40];
console.log(firstItem); // 10
console.log(rest); // [20, 30, 40]

// TODO: Use spread to merge these arrays into one
const arr1 = [1, 2];
const arr2 = [3, 4];
const arr3 = [5, 6];
// const merged = ???


// 5. ARRAY METHODS
console.log('\n=== Array Methods ===');

const products = [
  { id: 1, name: 'Laptop', price: 999, inStock: true },
  { id: 2, name: 'Phone', price: 699, inStock: false },
  { id: 3, name: 'Headphones', price: 149, inStock: true },
  { id: 4, name: 'Watch', price: 299, inStock: true },
];

// map - transform each item
const names = products.map(p => p.name);
console.log('Names:', names); // ['Laptop', 'Phone', 'Headphones', 'Watch']

// filter - keep items that pass a test
const available = products.filter(p => p.inStock);
console.log('Available:', available.length); // 3

// find - get first match
const phone = products.find(p => p.name === 'Phone');
console.log('Phone:', phone); // { id: 2, name: 'Phone', ... }

// reduce - combine into single value
const total = products.reduce((sum, p) => sum + p.price, 0);
console.log('Total price:', total); // 2146

// TODO: Filter products under $300, then map to get their names


// 6. ASYNC / AWAIT
console.log('\n=== Async/Await ===');

// Promises (old way)
function fetchTodoOld() {
  return fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())
    .then(data => console.log('Promise:', data.title))
    .catch(err => console.error(err));
}

// Async/await (modern way)
async function fetchTodo() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    console.log('Async:', data.title);
  } catch (err) {
    console.error(err);
  }
}

// Run async functions
fetchTodoOld();
fetchTodo();

// TODO: Create an async function that fetches a user from
// https://jsonplaceholder.typicode.com/users/1 and logs their name and email
