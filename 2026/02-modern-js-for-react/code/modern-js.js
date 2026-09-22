// ============================================
// Session 02 - Modern JavaScript for React
// Practice file - run with: node modern-js.js
// ============================================

// 1. DESTRUCTURING
console.log("=== Destructuring ===");

const person = { name: "Mario", age: 30, city: "Skopje" };

// Object destructuring
const { name, age } = person;
console.log(name, age);

// Array destructuring
const colors = ["red", "green", "blue"];
const [first, second] = colors;
console.log(first, second);

// Destructure product object
const product = { name: "Laptop", price: 999, inStock: true };

const { name: productName, price, inStock } = product;

console.log(productName, price, inStock);

// 2. ARROW FUNCTIONS
console.log("\n=== Arrow Functions ===");

// Old way
function addOld(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

console.log(add(2, 3));

// Double a number
const double = (number) => number * 2;

console.log(double(5));

// 3. TEMPLATE LITERALS
console.log("\n=== Template Literals ===");

const userName = "Alice";
const userAge = 25;

// Old way
const msgOld = "My name is " + userName + " and I am " + userAge + " years old";

// Template literal
const msg = `My name is ${userName} and I am ${userAge} years old`;

console.log(msg);

// HTML card using a template literal
const cardName = "React Course";
const cardPrice = 49;

const card = `
  <div class="card">
    <h2>${cardName}</h2>
    <p>Price: $${cardPrice}</p>
  </div>
`;

console.log(card);

// 4. SPREAD / REST
console.log("\n=== Spread / Rest ===");

const nums = [1, 2, 3];

const moreNums = [...nums, 4, 5];

console.log(moreNums);

// Spread objects
const user1 = {
  name: "Alice",
  age: 25,
};

const user2 = {
  ...user1,
  city: "London",
};

console.log(user2);

// Rest
const [firstItem, ...rest] = [10, 20, 30, 40];

console.log(firstItem);
console.log(rest);

// Merge arrays using spread
const arr1 = [1, 2];
const arr2 = [3, 4];
const arr3 = [5, 6];

const merged = [...arr1, ...arr2, ...arr3];

console.log(merged);

// 5. ARRAY METHODS
console.log("\n=== Array Methods ===");

const products = [
  { id: 1, name: "Laptop", price: 999, inStock: true },
  { id: 2, name: "Phone", price: 699, inStock: false },
  { id: 3, name: "Headphones", price: 149, inStock: true },
  { id: 4, name: "Watch", price: 299, inStock: true },
];

// map
const names = products.map((product) => product.name);

console.log("Names:", names);

// filter
const available = products.filter((product) => product.inStock);

console.log("Available:", available.length);

// find
const phone = products.find((product) => product.name === "Phone");

console.log("Phone:", phone);

// reduce
const total = products.reduce((sum, product) => sum + product.price, 0);

console.log("Total price:", total);

// Filter products under $300 and return their names
const cheapProducts = products
  .filter((product) => product.price < 300)
  .map((product) => product.name);

console.log("Products under $300:", cheapProducts);

// 6. ASYNC / AWAIT
console.log("\n=== Async/Await ===");

// Promise version
function fetchTodoOld() {
  return fetch("https://jsonplaceholder.typicode.com/todos/1")
    .then((response) => response.json())
    .then((data) => console.log("Promise:", data.title))
    .catch((error) => console.error(error));
}

// Async / await version
async function fetchTodo() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1",
    );

    const data = await response.json();

    console.log("Async:", data.title);
  } catch (error) {
    console.error(error);
  }
}

// Fetch user and log name + email
async function fetchUser() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users/1",
    );

    const user = await response.json();

    console.log("User name:", user.name);
    console.log("User email:", user.email);
  } catch (error) {
    console.error(error);
  }
}

// Run async functions
fetchTodoOld();
fetchTodo();
fetchUser();
