# React SPA Course — Planning Brief

**Format:** 50 hours total, delivered as 25 × 2-hour sessions, 3 days/week (Day 1 + Day 2 = content = 4h/week, Day 3 = exercise = 2h/week) → 6h/week over 8 weeks (48h) + 1 final 2h Demo Day = 50h.

**Audience:** Knows basic JS/HTML. Goal: teach core frontend concepts + React SPA fundamentals, culminating in a complete project deployed to GitHub Pages, with opencode taught as an AI pair-programming tool along the way.

**Currency check (Sept 2026):** Verified against React 19.2.7 (latest stable). No React 20 — hooks-based curriculum remains solid. Server Components / Actions don't apply (static GH Pages, no backend), so no restructuring needed.

**Working assumptions:**
- Vite as the build tool
- Function components + hooks only — no class components, no Redux (Context/useReducer covers state needs at this scope)
- CSS Modules as default styling approach
- One central project (store app) that evolves across the course
- Session-specific exercises go in `code/` folders, not separate projects
- Slides built in Slidev, shared deps at repo root
- API: [DummyJSON](https://dummyjson.com) — free, no key, CORS-friendly

---

## Project: Store App (DummyJSON)

**What:** An e-commerce-style store app using DummyJSON as the backend. Products, users, carts, search, filtering — all the dynamic patterns students need.

**Why:** DummyJSON provides rich, real-world data (100+ products, categories, users, auth) without any backend setup. Students learn API patterns that transfer to any real project.

**Tech progression:**
| Phase | Weeks | Stack |
|---|---|---|
| 1. Vanilla JS | 1-3 | HTML/CSS/JS, fetch from DummyJSON |
| 2. React fundamentals | 4-6 | Vite + React, components, state, routing |
| 3. Advanced React | 7-8 | Context, hooks, testing, deployment |

**DummyJSON endpoints we'll use:**
- `GET /products` — list products (pagination, search, categories)
- `GET /products/:id` — single product
- `GET /products/categories` — list categories
- `GET /products/category/:name` — filter by category
- `POST /auth/login` — user login
- `GET /users/:id` — user profile
- `POST /carts/add` — add to cart

**Data model (mapped to DummyJSON):**
- Products → `/products` (title, description, image, price, category, rating)
- Categories → `/products/categories`
- Users → `/users` + `/auth/login`
- Cart → `/carts`

**Required feature checklist:**
- At least 2 routes (Week 4)
- Data fetched from an API with loading/error states (Week 3)
- One piece of shared/global state via Context (Week 5)
- Responsive layout + basic accessibility pass (Week 6)
- Deployed and live on GitHub Pages (Week 7)
- At least 2 tests (Week 8)

---

## Project Structure

```
react-course/
├── package.json              # Shared Slidev deps
├── 2026/
│   ├── course-platform/      # THE project (evolves all course)
│   │   ├── src/
│   │   ├── index.html
│   │   └── package.json
│   ├── 01-how-the-web-works/
│   │   ├── slides/
│   │   │   └── session-01.md
│   │   ├── code/
│   │   │   └── index.html    # DOM manipulation starter
│   │   └── README.md
│   ├── 02-modern-js-for-react/
│   │   ├── slides/
│   │   │   └── session-02.md
│   │   ├── code/
│   │   │   ├── modern-js.js  # Practice with TODOs
│   │   │   └── solutions.js  # Instructor reference
│   │   └── README.md
│   ├── 03-vanilla-js-fetch-mini-app/
│   │   ├── slides/
│   │   ├── code/             # Course platform vanilla JS version
│   │   └── README.md
│   └── ... (22 more sessions)
```

---

## Progress Log

### Completed
- [x] Session 01 — How the Web Works (slides + code)
- [x] Session 02 — Modern JavaScript for React (slides + code)

### Current
- [ ] Session 03 — Vanilla JS Fetch Mini-App (exercise + start store app)

### Upcoming
- [ ] Session 04 — React Intro, JSX, Props
- [ ] Session 05 — State, Events, Styling
- [ ] Session 06 — Practice: Component-Driven UI
- [ ] Session 07 — useEffect, Data Fetching
- [ ] Session 08 — Forms, Custom Hooks
- [ ] Session 09 — Practice: Project Milestone 1
- [ ] Session 10 — React Router / SPA Nav
- [ ] Session 11 — Project Architecture
- [ ] Session 12 — Build Routing into Project
- [ ] Session 13 — Context API / useReducer
- [ ] Session 14 — API Layer Patterns
- [ ] Session 15 — Build State/Data Layer into Project
- [ ] Session 16 — Styling & Layout
- [ ] Session 17 — A11y + Performance
- [ ] Session 18 — Style/Polish Project
- [ ] Session 19 — Git Workflow + GH Pages Deploy
- [ ] Session 20 — opencode: Setup & AI-Assisted Dev
- [ ] Session 21 — Deploy Project with opencode
- [ ] Session 22 — Project Review + Debugging Clinic
- [ ] Session 23 — Testing Basics + Error Handling
- [ ] Session 24 — Free Build / Office Hours
- [ ] Session 25 — Demo Day

---

## Curriculum Overview

| Week | Day 1 (2h) | Day 2 (2h) | Day 3 (2h exercise) |
|---|---|---|---|
| 1 | How the web works ✅ | Modern JS for React ✅ | Vanilla JS + fetch mini-app → **start store app** |
| 2 | React intro, JSX, props | State, events, styling | Practice: component-driven UI |
| 3 | useEffect, data fetching | Forms, custom hooks | Practice → project milestone 1 |
| 4 | React Router / SPA nav | Project architecture | Build routing into store app |
| 5 | Context API / useReducer | API layer patterns | Build state/data layer into store app |
| 6 | Styling & layout | A11y + performance | Style/polish store app |
| 7 | Git workflow + GH Pages deploy | opencode: setup & AI-assisted dev | Deploy store app |
| 8 | Project review + debugging clinic | Testing basics + error handling | Free build / office hours |
| 9 | **Demo Day** (single 2h session) | | |

---

## Slidev Setup

- Shared deps at repo root (`@slidev/cli`, `@slidev/theme-default`)
- One markdown file per session in `slides/` folder
- Run any session: `npm run slides:XX` (e.g., `npm run slides:02`)
- All slides share the same theme and config

---

## Suggested Next Steps
1. Complete Session 03 — build store app starter in vanilla JS
2. Create slides for Session 03
3. Continue building slides as we go
