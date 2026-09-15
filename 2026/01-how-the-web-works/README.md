# Session 01 — How the Web Works

## What We're Learning Today

The internet isn't magic — it's just computers talking to each other using agreed-upon rules. Today we'll understand what happens when you type a URL and press Enter, so you can reason about problems instead of just guessing.

## Prerequisites

- A browser (Chrome recommended)
- A text editor (VS Code recommended)
- Node.js installed (v18+) — run `node -v` in terminal to check

## Concepts

### 1. Client-Server Model

When you visit a website, your browser (the **client**) asks a remote computer (the **server**) for a page. The server sends back HTML, CSS, and JavaScript files. That's it — no magic.

```
Your Browser (Client)  ←——— asks for page ———→  Google's Server
Your Browser (Client)  ←——— gets HTML back ———  Google's Server
```

**Think of it like a restaurant:**
- You (client) look at the menu and order
- The waiter (HTTP request) takes your order to the kitchen
- The kitchen (server) prepares your food
- The waiter brings back your meal (HTTP response)

### 2. HTTP — The Language of the Web

HTTP (HyperText Transfer Protocol) is how clients and servers talk. Every request has:

- **A method** — what you want to do:
  - `GET` = give me data (loading a page)
  - `POST` = here's new data (submitting a form)
- **A URL** — where to get it from
- **A status code** — what happened:
  - `200 OK` = success
  - `404 Not Found` = page doesn't exist
  - `500 Server Error` = the server broke

**Try it:** Open Chrome DevTools (F12) → Network tab → visit any website. You'll see every request your browser makes.

### 3. What the Browser Actually Does

When the browser gets HTML back, it doesn't just show it. It:

1. **Parses** the HTML → builds a tree of elements (the DOM)
2. **Parses** the CSS → figures out how things should look (the CSSOM)
3. **Renders** → combines DOM + CSSOM into a visual layout
4. **Paints** → draws pixels on your screen

```
HTML  →  DOM Tree  ─┐
                     ├──→  Render Tree  →  Layout  →  Paint  →  Pixels on screen
CSS   → CSSOM Tree ─┘
```

**Why this matters:** When something looks wrong on a page, you need to know which step broke. Is the HTML wrong? The CSS? Did JavaScript change something after render?

### 4. DOM vs CSSOM

- **DOM (Document Object Model)** — the structure of the page. Every HTML tag becomes a node in a tree. JavaScript can read and change this tree.
- **CSSOM (CSS Object Model)** — the styles applied to those nodes. Browsers calculate this from your CSS files.

### 5. Dev Tools — Your X-Ray Vision

Chrome DevTools is the most important tool you'll learn today.

- **F12** or **Ctrl+Shift+I** opens DevTools
- **Elements tab** — see and edit the live DOM
- **Console tab** — run JavaScript commands
- **Network tab** — see every request your browser makes
- **Sources tab** — debug JavaScript step by step

**Exercise:** Open DevTools → Console → type `document.title` and press Enter. You just queried the DOM with JavaScript.

### 6. npm and package.json

**npm** (Node Package Manager) installs tools other people wrote. When you start a project:

```bash
npm init -y          # creates package.json
npm install react    # downloads React into node_modules/
```

**package.json** is your project's manifest — it lists:
- Project name and version
- Dependencies (libraries you need)
- Scripts (commands to run)

**Don't memorize this.** Just know that `node_modules/` is where packages live and `package.json` is the list of what's installed.

### 7. Module Systems — Import/Export

Modern JavaScript splits code into files. You use `import` and `export` to connect them:

```javascript
// math.js — exporting
export function add(a, b) {
  return a + b;
}

// app.js — importing
import { add } from './math.js';

console.log(add(2, 3)); // 5
```

**Why?** Nobody puts all their code in one file. Modules keep things organized and reusable.

## Step-by-Step Walkthrough

1. Open VS Code
2. Create a new folder called `01-web-basics`
3. Create a file called `index.html` with this content:

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
      document.getElementById('demo').textContent = 'JavaScript changed this!';
    </script>
  </body>
</html>
```

4. Open this file in your browser (double-click it or drag it into Chrome)
5. Open DevTools (F12) → Elements tab → see how the `<p>` tag now contains text
6. Right-click the paragraph → Inspect → you're looking at the live DOM

## Try It Yourself

1. **Easy:** Change the `<h1>` text in your HTML file, refresh the browser. What changed?
2. **Medium:** Add a `<style>` tag that makes the heading red. Check the Elements tab — where did the styles appear?
3. **Challenge:** Add a second `<script>` tag that changes the page title to "My Page". (Hint: `document.title = 'My Page'`)

## Common Mistakes & How to Fix Them

- **"Nothing shows up when I open the file"** — Make sure the file ends in `.html`, not `.txt`
- **DevTools say "Cannot read property of null"** — Your script ran before the HTML loaded. Put `<script>` at the end of `<body>`, not in `<head>`
- **Changes not showing up** — Hard refresh: Ctrl+Shift+R (browsers cache old files)

## Recap / Checklist

After today, you should be able to:

- [ ] Explain what a client and server are
- [ ] Name 3 HTTP status codes and what they mean
- [ ] Describe what the browser does with HTML (parse → render → paint)
- [ ] Open Chrome DevTools and inspect the DOM
- [ ] Use `npm init` and `npm install`
- [ ] Use `import`/`export` to split code into files

## Useful Links

- [MDN: How the Web Works](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_does_the_Internet_work)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [MDN: HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [npm Documentation](https://docs.npmjs.com/)
