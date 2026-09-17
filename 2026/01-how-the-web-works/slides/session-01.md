---
theme: default
title: "Session 01 — How the Web Works"
info: |
  Understanding what happens when you type a URL and press Enter.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# How the Web Works

The internet isn't magic — it's just computers talking to each other.

<br>

### React SPA Course — Session 01

---
layout: two-cols
---

# Today's Goals

By the end of this session you will be able to:

- Explain the client-server model
- Name HTTP methods and status codes
- Describe the browser rendering pipeline
- Use Chrome DevTools to inspect a page
- Run `npm init` and `npm install`
- Use `import` / `export` to split code

::right::

<br><br>

### The Big Picture

```
You type a URL
      ↓
Browser asks a server
      ↓
Server sends back files
      ↓
Browser renders pixels
```

---

# The Client-Server Model

When you visit a website, your **browser** (client) asks a remote computer (server) for a page.

```text
Your Browser (Client)  ←—— asks for page ——→  Google's Server
Your Browser (Client)  ←—— gets HTML back ——  Google's Server
```

<br>

### The Restaurant Analogy

| You (Client) | Restaurant |
|---|---|
| Look at the menu | See the page |
| Place an order | Send a request |
| Kitchen prepares food | Server processes request |
| Waiter brings your meal | Server sends response |

---
layout: center
---

# HTTP — The Language of the Web

**HyperText Transfer Protocol** — how clients and servers talk.

---

# HTTP Methods

Every request has a **method** — what you want to do.

<br>

| Method | What it does | Example |
|---|---|---|
| `GET` | Give me data | Loading a page |
| `POST` | Here's new data | Submitting a form |
| `PUT` | Update this data | Editing a profile |
| `DELETE` | Remove this data | Deleting a post |

<br>

> 💡 For now, focus on **GET** and **POST**. That covers 90% of what you'll do.

---

# HTTP Status Codes

The server responds with a **status code** — what happened.

<br>

| Code | Meaning | When |
|---|---|---|
| `200` | OK | Everything worked |
| `301` | Moved | Page moved permanently |
| `404` | Not Found | Page doesn't exist |
| `500` | Server Error | Server broke |

<br>

### Try It Now

1. Open Chrome DevTools (**F12**)
2. Go to the **Network** tab
3. Visit any website
4. See every request your browser makes

---
layout: center
---

# What the Browser Actually Does

The browser doesn't just "show" HTML. It goes through steps.

---

# The Browser Pipeline

```text
HTML  →  DOM Tree  ─┐
                     ├→  Render Tree  →  Layout  →  Paint  →  Pixels
CSS   → CSSOM Tree ─┘
```

<br>

| Step | What happens |
|---|---|
| **Parse HTML** | Build the DOM (structure) |
| **Parse CSS** | Build the CSSOM (styles) |
| **Render** | Combine DOM + CSSOM into layout |
| **Paint** | Draw pixels on screen |

<br>

> 💡 When something looks wrong, you need to know which step broke.

---

# DOM vs CSSOM

<br>

### DOM (Document Object Model)

The **structure** of the page. Every HTML tag becomes a node in a tree.

```html
<body>
  <h1>Hello</h1>
  <p>World</p>
</body>
```

```text
body
├── h1 → "Hello"
└── p  → "World"
```

<br>

### CSSOM (CSS Object Model)

The **styles** applied to those nodes. Browsers calculate this from your CSS.

---

# Dev Tools — Your X-Ray Vision

Chrome DevTools is the most important tool you'll learn today.

<br>

| Shortcut | Tab | What it does |
|---|---|---|
| `F12` | — | Opens DevTools |
| — | **Elements** | See and edit the live DOM |
| — | **Console** | Run JavaScript commands |
| — | **Network** | See every request |
| — | **Sources** | Debug JavaScript |

<br>

### Exercise

Open DevTools → Console → type:

```js
document.title
```

You just queried the DOM with JavaScript.

---

# npm — Node Package Manager

**npm** installs tools other people wrote.

```bash
npm init -y          # creates package.json
npm install react    # downloads React into node_modules/
```

<br>

### What gets created?

| File/Folder | Purpose |
|---|---|
| `package.json` | Project config — lists dependencies and scripts |
| `node_modules/` | Where packages live (don't touch this) |
| `package-lock.json` | Exact versions of everything installed |

<br>

> 💡 Don't memorize this. Just know where things are.

---

# Module Systems — Import / Export

Modern JavaScript splits code into files.

<br>

```js
// math.js — exporting
export function add(a, b) {
  return a + b;
}
```

```js
// app.js — importing
import { add } from './math.js';

console.log(add(2, 3)); // 5
```

<br>

**Why?** Nobody puts all their code in one file. Modules keep things organized and reusable.

---
layout: center
---

# Hands-On Time

Let's build something small.

---
layout: two-cols
---

# Create Your First Page

1. Open VS Code
2. Create a folder `01-web-basics`
3. Create `index.html`:

::right::

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p id="demo"></p>
    <script>
      document.getElementById('demo')
        .textContent = 
        'JavaScript changed this!';
    </script>
  </body>
</html>
```

---

# What Just Happened?

<br>

1. Browser parsed the HTML → built the DOM
2. Found the `<h1>` and `<p>` → added them to the tree
3. Hit the `<script>` → ran the JavaScript
4. JavaScript found the `<p>` by its `id`
5. Changed its text content
6. Browser re-rendered → you see the new text

<br>

### Now try this

Open DevTools → Elements tab → see how the `<p>` tag now contains text.

Right-click the paragraph → **Inspect** → you're looking at the live DOM.

---

# Try It Yourself

<br>

| Level | Task |
|---|---|
| 🟢 Easy | Change the `<h1>` text, refresh the browser. What changed? |
| 🟡 Medium | Add a `<style>` tag that makes the heading red. Check Elements tab. |
| 🔴 Challenge | Add a `<script>` that sets `document.title = 'My Page'` |

<br>

> 💡 If nothing shows up, make sure the file ends in `.html`, not `.txt`.

---

# Common Mistakes

<br>

| Problem | Fix |
|---|---|
| "Nothing shows up" | File must end in `.html`, not `.txt` |
| "Cannot read property of null" | Put `<script>` at the end of `<body>`, not `<head>` |
| Changes not showing | Hard refresh: `Ctrl+Shift+R` (browsers cache old files) |

---
layout: center
---

# Recap

---

# What We Covered Today

<br>

- ✅ **Client-Server model** — browser asks, server responds
- ✅ **HTTP** — methods (GET/POST) and status codes (200/404/500)
- ✅ **Browser pipeline** — parse → render → paint
- ✅ **DOM vs CSSOM** — structure vs styles
- ✅ **DevTools** — your X-ray vision (`F12`)
- ✅ **npm** — `init`, `install`, `package.json`
- ✅ **Modules** — `import` / `export`

<br>

### Next Session

**Modern JavaScript for React** — destructuring, arrow functions, async/await.

---
layout: center
---

# Questions?

<br>

### Useful Links

- [MDN: How the Web Works](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_does_the_Internet_work)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [MDN: HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [npm Docs](https://docs.npmjs.com/)
