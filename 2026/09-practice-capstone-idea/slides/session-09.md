---
theme: default
title: "Session 09 - Practice: Capstone Idea"
info: |
  Capstone day: pick a topic, plan the component tree, fetch a
  public API, and build list + detail with the patterns you know.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Practice: Capstone Idea

Weeks 1-3, one real app.

<br>

### React SPA Course - Session 09

---

# Today's Goals

<br>

- Choose your capstone topic — and its API
- Sketch the component tree **before** coding
- Reuse `useFetch` from Session 08, verbatim
- Fetch a public API → list → detail view
- Get the data flow working end-to-end
- No new concepts — everything combined

---

# Where We Left Off

Session 08 handed you a reusable fetch:

```jsx
const { data, loading, error } = useFetch(url);
```

- forms work, hooks work, state flows
- but the app was a throwaway

Today you point that machinery at a project you'll keep for six weeks.

> 💡 Nothing new today. The hard part is **choosing well** and staying scoped.

---
layout: center
---

# 1. The Assignment

Foundation only. Not the whole app.

---

# Today's Scope

| Today ✅ | Later |
|---|---|
| Fetch a list from a public API | Routing & navigation (Session 10) |
| Detail view via `selected` state | API/service layer (Session 14) |
| Loading, error, empty states | Styling pass (Session 16) |
| Folder structure ready to grow | Deploy to GitHub Pages (Session 19) |

<br>

- One endpoint, one list, one detail — that's the whole day
- Search and filter come as **exercises**, not prerequisites

> 💡 Scope creep kills practice days. If it isn't in the left column, skip it.

---

# What "Done" Looks Like

Four checkpoints. Verify each in the browser:

1. Your app fetches from your chosen API
2. A list of items renders (`.map()`, stable keys)
3. Clicking one item shows its detail view
4. A **Back** button returns to the list

<br>

```text
list  ──click──►  detail
  ◄──back──────────┘
```

> 💡 That toggle is `useState` from Session 05. Routing replaces it next week.

---
layout: center
---

# 2. Pick Your Topic

You'll stare at this codebase for six more weeks.

---

# What Makes a Good Capstone

| Trait | Why |
|---|---|
| 3-5 views or screens | Room to practice routing, state, layout |
| Data from an external API | Real loading/error/empty states |
| Search, filter, or details | Feature growth without a rewrite |
| A domain you actually like | Motivation beats novelty |

<br>

**Too small:** todo list, calculator, counter — already done in practice.
**Too big:** social network, anything needing auth or payments.

> 💡 Boring domain + rich API beats exciting domain + no API.

---

# Approved APIs

Free, CORS-friendly, built for browser requests:

| Domain | API | Key? |
|---|---|---|
| Movies | TMDB — themoviedb.org/documentation/api | 🔑 |
| Weather | Open-Meteo — open-meteo.com | no |
| Countries | REST Countries — restcountries.com | no |
| Space | NASA APOD — api.nasa.gov | 🔑 |
| Food | TheMealDB — themealdb.com | no |
| Games | RAWG — rawg.io/apidocs | 🔑 |
| Books | Open Library — openlibrary.org/developers/api | no |
| Pokemon | PokeAPI — pokeapi.co | no |

<br>

🔑 = free signup, key pasted into the URL.

---

# Keys, CORS, and Other Traps

- **CORS error** — the API blocks browser requests. Stick to this list.
- **Key required** — sign up, copy the key, follow the docs. Ten minutes, once.
- **Rate limits** — some APIs throttle. Cache in state; don't refetch on every render.
- **Weird field names** — `strMeal`, `poster_path`, `results[].name`. Map them once.

```jsx
// the shape you get ≠ the shape you want
const items = data.results; // normalize at the top, render below
```

> 💡 Pick your endpoint and open it in the browser tab **before** writing code.

---

# Decide Now

- Pick a domain **you'd still care about in week 6**
- Open its docs, find the "list" endpoint
- Paste it into the browser — confirm JSON comes back
- Write the URL on a sticky note. That's your `API_URL`.

<br>

Can't decide? Weather, countries, or pokemon — all keyless and instant.

> 💡 Perfect is the enemy of started. Ten minutes, then commit.

---
layout: center
---

# 3. Plan Before You Code

Five minutes of sketching saves an hour of refactoring.

---

# Sketch the Component Tree

```text
App
├── Header (navigation)
├── Home (featured items, search)
├── List (filtered grid of items)
├── Detail (single item view)
└── Footer
```

- Repeated or reusable markup → its own component
- One component, one job

<br>

**Today you build:** `List` + `Detail`, toggled by state.
**Today you stub:** `Header`, `Home`, `Footer`.

> 💡 Same tree as Session 06 — only the data source changed.

---

# Data Flow

```text
API
 ↓  fetch(url)
useEffect          ← Session 07
 ↓  setData(...)
State              ← Session 05
 ↓  props
Components         ← Session 04
 ↓  onSelect / onClick
UI updates
```

- Every component receives data through props
- State lives as high as it needs to — today that's `App`
- Actions travel up as callbacks: `onSelect={setSelected}`

> 💡 If you can point at which arrow broke, you can debug the whole app.

---

# Three Building Blocks

Everything today is one of these three:

```jsx
// 1. Fetch and display
const [items, setItems] = useState([]);
useEffect(() => { /* fetch */ }, []);
return items.map(item => <Card key={item.id} item={item} />);
```

```jsx
// 2. Pass data down
<App> → items as props → <List> → <Card item={item} />
```

```jsx
// 3. Respond to a click
function handleSelect(item) { setSelected(item); }
```

> 💡 Three patterns, six weeks of project. Learn them once, reuse them forever.

---

# File Structure

Start organized from the first commit:

```text
my-capstone/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Card.jsx
│   │   └── Card.module.css
│   ├── hooks/
│   │   └── useFetch.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── package.json
```

- `components/` — UI only, one file per component
- `hooks/` — reusable stateful logic, never JSX

> 💡 Moving files later is chores. Front-loading the folders is free.

---
layout: center
---

# 4. Build the Foundation

Hook, card, list, detail — four files.

---

# Step 1: Project + Folders

```bash
npm create vite@latest my-capstone -- --template react
cd my-capstone && npm install
mkdir -p src/components src/hooks
```

```text
src/
├── hooks/useFetch.js   ← step 2
├── components/Card.jsx ← step 3
└── App.jsx             ← step 4
```

---

# Step 2: `src/hooks/useFetch.js`

```jsx
import { useState, useEffect } from 'react';

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

- Session 08's hook — paste it verbatim, change nothing
- `url` in the dep array: new URL → new request

---

# Step 3: `src/components/Card.jsx`

```jsx
import styles from './Card.module.css';

function Card({ item, onSelect }) {
  return (
    <div className={styles.card} onClick={() => onSelect(item)}>
      <img src={item.image} alt={item.title} />
      <h3>{item.title}</h3>
      <p>{item.subtitle}</p>
    </div>
  );
}

export default Card;
```

- Two props in: the data, and the callback that sends the click **up**
- Adapt `item.image` / `item.title` to your API's real field names

> 💡 A clickable `<div>` works today; Session 17 makes it a real `<button>`.

---

# Step 4: `src/App.jsx` — Logic

```jsx
import { useState } from 'react';
import useFetch from './hooks/useFetch';
import Card from './components/Card';

const API_URL = 'https://restcountries.com/v3.1/all?fields=name,flags,population';

function App() {
  const { data: items, loading, error } = useFetch(API_URL);
  const [selected, setSelected] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <div>{/* JSX next slide */}</div>;
}

export default App;
```

- Keyless endpoint — swap in yours after it works
- One piece of state: `selected` is either an item or `null`

---

# Step 4: `src/App.jsx` — JSX

```jsx
if (selected) {
  return (
    <div>
      <button onClick={() => setSelected(null)}>← Back</button>
      <h2>{selected.name}</h2>
      <p>{selected.population}</p>
    </div>
  );
}

return (
  <div>
    <h1>My Capstone</h1>
    <div className={styles.grid}>
      {items.map(item => (
        <Card key={item.id} item={item} onSelect={setSelected} />
      ))}
    </div>
  </div>
);
```

- Ternary by state: `selected ? detail : list`
- `setSelected` passed straight down — no wrapper function needed

---

# Run It

- `npm run dev`
- ✅ Loading message flashes, then the list appears
- ✅ Click a card → detail view with a **Back** button
- ✅ Back → list is still there, state intact
- ✅ Console free of errors and warnings

<br>

> 💡 If the list is empty, open the network tab. The bug is almost always the URL.

---

# Now Make It Yours

The scaffold works. Point it at **your** API:

```jsx
// 1. change the URL
const API_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=YOUR_KEY';

// 2. normalize the shape once
const items = data?.results ?? [];

// 3. rename fields in Card.jsx to match
//    movie.poster_path, movie.title, movie.release_date
```

- Keep `useFetch`, `App`, and the list/detail toggle untouched
- Only the URL, the field names, and the labels change

> 💡 Skeleton stays, data swaps. That's what reusable code buys you.

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

Build on your own capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Pick your API, fetch data, show the first 10 items in a list. |
| 🟡 Medium | Detail view — click an item and show everything the API knows about it. |
| 🔴 Challenge | Search input filtering the list by name (state only, no routing). |

<br>

**Bonus:** empty state when the search returns nothing.

> 💡 Easy before Medium. Verify in the browser before moving on.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| CORS error in the console | API blocks browser calls — stick to the approved list |
| 401 / "invalid key" | TMDB and RAWG need a free key — follow their docs |
| Blank screen, no error | Field names don't match — `console.log(data)` first |
| Everything renders at once | `.map()` returned a flat list — check your wrapper div |
| Trying to do too much | Today: fetch + list + detail. Routing is Session 10 |

> 💡 Almost every bug today is a URL or a field name. Log the data before the JSX.

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Choose a capstone topic and its API
- [ ] Sketch the component tree before coding
- [ ] Fetch data from a public API with `useFetch`
- [ ] Display a list of items with `.map()` and keys
- [ ] Show a detail view from `selected` state
- [ ] Leave a folder structure ready to grow

<br>

### Next Session

**Session 10 — React Router & SPA Navigation** — real URLs, real pages.

---
layout: center
---

# Questions?

### Useful Links

- [TMDB API Documentation](https://www.themoviedb.org/documentation/api)
- [PokeAPI Documentation](https://pokeapi.co/docs/v2)
- [React: Thinking in React](https://react.dev/learn/thinking-in-react)
- [React: Start a New React Project](https://react.dev/learn/start-a-new-react-project)
