# React SPA Course — Planning Brief

**Format:** 50 hours total, delivered as 25 × 2-hour sessions, 3 days/week (Day 1 + Day 2 = content = 4h/week, Day 3 = exercise = 2h/week) → 6h/week over 8 weeks (48h) + 1 final 2h Demo Day = 50h.

**Audience:** Knows basic JS/HTML. Goal: teach core frontend concepts + React SPA fundamentals, culminating in a complete project deployed to GitHub Pages, with opencode taught as an AI pair-programming tool along the way.

**Currency check (Sept 2026):** Verified against React 19.2.7 (latest stable). No React 20 — hooks-based curriculum remains solid. Server Components / Actions don't apply (static GH Pages, no backend), so no restructuring needed.

**Working assumptions:**
- Vite as the build tool
- Function components + hooks only — no class components, no Redux (Context/useReducer covers state needs at this scope)
- CSS Modules as default styling approach
- One central project (course management app) that evolves across the course
- Session-specific exercises go in `code/` folders, not separate projects
- Slides built in Slidev, shared deps at repo root
- Backend: Supabase (free tier) introduced in Week 4 for real data persistence

---

## Project: Course Management App

**What:** A Udemy/Pluralsight-style course platform where the instructor (Mario) can post courses, and students can browse, enroll, and follow lessons.

**Why:** Real-world use case — the instructor can actually use this to publish courses after the class ends.

**Tech progression:**
| Phase | Weeks | Stack |
|---|---|---|
| 1. Vanilla JS | 1-3 | HTML/CSS/JS, localStorage, mock data |
| 2. React fundamentals | 2-5 | Vite + React, components, state, routing |
| 3. Real backend | 4+ | Supabase (auth, database, storage) |
| 4. Production | 7-8 | GitHub Pages deployment, testing |

**Data model (target):**
- `courses` — title, description, image, price, category, instructor
- `lessons` — title, content, video URL, course_id, order
- `enrollments` — user_id, course_id, progress
- `users` — auth + profile

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
- [ ] Session 03 — Vanilla JS Fetch Mini-App (exercise + start course platform)

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
| 1 | How the web works ✅ | Modern JS for React ✅ | Vanilla JS + fetch mini-app → **start course platform** |
| 2 | React intro, JSX, props | State, events, styling | Practice: component-driven UI |
| 3 | useEffect, data fetching | Forms, custom hooks | Practice → project milestone 1 |
| 4 | React Router / SPA nav | Project architecture | Build routing into course platform |
| 5 | Context API / useReducer | API layer patterns | Build state/data layer into course platform |
| 6 | Styling & layout | A11y + performance | Style/polish course platform |
| 7 | Git workflow + GH Pages deploy | opencode: setup & AI-assisted dev | Deploy course platform |
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
1. Complete Session 03 — build course platform starter in vanilla JS
2. Create slides for Session 03
3. Set up Supabase project for backend (Week 4)
4. Continue building slides as we go
