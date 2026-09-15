# Session 03 — Vanilla JS + Fetch Mini-App

## What We're Learning Today

Before we learn React, we're going to build a small app with plain JavaScript that fetches data from an API and displays it. This will show us the pain of doing it manually — so when we see React tomorrow, we'll understand *why* it exists.

## Prerequisites

- Sessions 01-02 completed (understand HTTP, DOM, async/await, fetch)
- Node.js installed

## Concepts

### 1. The Goal

We'll build a tiny app that:
1. Fetches a list of users from a public API
2. Creates HTML elements for each user
3. Appends them to the page

All with vanilla JavaScript. No frameworks, no libraries.

### 2. The API We're Using

[JSONPlaceholder](https://jsonplaceholder.typicode.com/) is a free fake API for testing. We'll use `/users` to get a list of users:

```javascript
const response = await fetch('https://jsonplaceholder.typicode.com/users');
const users = await response.json();
// Returns an array of 10 user objects
```

### 3. Creating Elements with JavaScript

Instead of writing HTML by hand, we create elements in JS:

```javascript
// Create a heading
const heading = document.createElement('h1');
heading.textContent = 'My Users';

// Create a list
const list = document.createElement('ul');

// Create a list item
const item = document.createElement('li');
item.textContent = 'Mario';

// Put it all together
list.appendChild(item);
document.body.appendChild(heading);
document.body.appendChild(list);
```

### 4. Building the App — Step by Step

Here's the full vanilla JS app we'll build:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Vanilla JS Users App</title>
    <style>
      body { font-family: sans-serif; max-width: 600px; margin: 40px auto; }
      .user { padding: 10px; border-bottom: 1px solid #eee; }
      .error { color: red; }
      .loading { color: gray; }
    </style>
  </head>
  <body>
    <h1>Users</h1>
    <div id="app"></div>
    <script>
      async function loadUsers() {
        const app = document.getElementById('app');

        // Show loading state
        app.innerHTML = '<p class="loading">Loading...</p>';

        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/users');
          const users = await response.json();

          // Clear loading message
          app.innerHTML = '';

          // Create a card for each user
          users.forEach(user => {
            const div = document.createElement('div');
            div.className = 'user';
            div.innerHTML = `
              <h3>${user.name}</h3>
              <p>${user.email}</p>
              <p>${user.company.name}</p>
            `;
            app.appendChild(div);
          });
        } catch (error) {
          app.innerHTML = '<p class="error">Failed to load users.</p>';
        }
      }

      loadUsers();
    </script>
  </body>
</html>
```

### 5. The Three States Every Data Fetch Has

Every time you fetch data, three things can happen:

| State | What to show |
|-------|-------------|
| **Loading** | Spinner, skeleton, "Loading..." text |
| **Success** | The actual data |
| **Error** | Error message, retry button |

This pattern appears in every React app. We're learning it now in plain JS so it's familiar later.

### 6. Why This Is Painful (And Why React Exists)

Notice what we're doing:
- Manually creating each element with `document.createElement`
- Manually setting properties with `.textContent` and `.innerHTML`
- Manually appending with `.appendChild`
- Manually handling loading/error states by swapping `innerHTML`

**The problems:**
- If data changes, we have to tear down and rebuild everything manually
- No way to "update" just one part of the UI
- Getting complex (nested elements, lists, conditionals) becomes a nightmare
- No reuse — this code only works for users

React solves all of this. Tomorrow you'll see how.

## Step-by-Step Walkthrough

1. Create a new folder `03-vanilla-fetch-app`
2. Create `index.html` inside it
3. Copy the full HTML from section 4 above into the file
4. Open it in your browser (double-click the file)
5. You should see 10 users loaded from the API
6. Open DevTools → Network tab → see the request to JSONPlaceholder
7. Now disconnect your internet and refresh — see the error state

## Try It Yourself

1. **Easy:** Change the API URL to `https://jsonplaceholder.typicode.com/posts` and display posts (title + body) instead of users.

2. **Medium:** Add a search box that filters users by name as you type. (Hint: Listen to the `input` event on the search box.)

3. **Challenge:** Instead of creating elements with `createElement`, build the HTML string directly and use `innerHTML`. Compare which approach feels cleaner.

## Common Mistakes & How to Fix Them

- **"CORS error"** — JSONPlaceholder allows CORS, so this shouldn't happen. If it does, you're likely using a different API that blocks browser requests
- **"app is null"** — Your script ran before the DOM loaded. Put `<script>` at the end of `<body>` or use `defer`
- **Nothing shows up** — Open DevTools Console. There's probably an error message. Read it — it tells you exactly what went wrong
- **Data looks like `[object Object]`** — You're calling `.toString()` on an object. Use `JSON.stringify()` or access a specific property like `user.name`

## Recap / Checklist

After today, you should be able to:

- [ ] Fetch data from a public API using async/await
- [ ] Create and append DOM elements with JavaScript
- [ ] Handle loading, success, and error states
- [ ] Explain why manual DOM manipulation is tedious (this is why React exists)
- [ ] Use DevTools Network tab to inspect API requests

## Useful Links

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [MDN: Document.createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: Handling Errors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)
