// ============================================
// Session 02 - SOLUTIONS (for instructor reference)
// ============================================

// 1. DESTRUCTURING
const product = { name: 'Laptop', price: 999, inStock: true };
const { name: productName, price, inStock } = product;
console.log(productName, price, inStock); // Laptop 999 true

const colors = ['red', 'green', 'blue'];
const [firstColor, secondColor] = colors;
console.log(firstColor, secondColor); // red green


// 2. ARROW FUNCTIONS
const double = x => x * 2;
console.log(double(5)); // 10


// 3. TEMPLATE LITERALS
const cardName = 'React Course';
const cardPrice = 49;
const card = `
  <div class="card">
    <h2>${cardName}</h2>
    <p>Price: $${cardPrice}</p>
  </div>
`;
console.log(card);


// 4. SPREAD / REST
const arr1 = [1, 2];
const arr2 = [3, 4];
const arr3 = [5, 6];
const merged = [...arr1, ...arr2, ...arr3];
console.log(merged); // [1, 2, 3, 4, 5, 6]


// 5. ARRAY METHODS
const products = [
  { id: 1, name: 'Laptop', price: 999, inStock: true },
  { id: 2, name: 'Phone', price: 699, inStock: false },
  { id: 3, name: 'Headphones', price: 149, inStock: true },
  { id: 4, name: 'Watch', price: 299, inStock: true },
];

const cheapProducts = products
  .filter(p => p.price < 300)
  .map(p => p.name);
console.log(cheapProducts); // ['Headphones', 'Watch']


// 6. ASYNC / AWAIT
async function fetchUser() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
    const user = await response.json();
    console.log(user.name); // Leanne Graham
    console.log(user.email); // Sincere@april.biz
  } catch (err) {
    console.error(err);
  }
}

fetchUser();
