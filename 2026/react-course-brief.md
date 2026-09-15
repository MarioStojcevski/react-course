# React SPA Course — Planning Brief

**Format:** 50 hours total, delivered as 25 × 2-hour sessions, 3 days/week (Day 1 + Day 2 = content = 4h/week, Day 3 = exercise = 2h/week) → 6h/week over 8 weeks (48h) + 1 final 2h Demo Day = 50h.

**Audience:** Knows basic JS/HTML. Goal: teach core frontend concepts + React SPA fundamentals, culminating in a complete project deployed to GitHub Pages, with opencode taught as an AI pair-programming tool along the way.

**Currency check (Sept 2026):** Verified against React 19.2.7 (latest stable). No React 20 — hooks-based curriculum remains solid. Server Components / Actions don't apply (static GH Pages, no backend), so no restructuring needed. Three targeted additions folded in below: `useEffectEvent` (Week 8), React Compiler mention (Week 6), Actions namecheck (Week 3).

**Working assumptions (revisit if needed):**
- Vite as the build tool
- Function components + hooks only — no class components, no Redux (Context/useReducer covers state needs at this scope)
- CSS Modules as default styling approach (swap for Tailwind if preferred)
- Students choose their capstone project topic by end of Week 1; from Week 4 onward, "exercise" days build directly into that project rather than throwaway practice
- Slides built in Slidev, one deck per session, deployed to GitHub Pages (doubles as a live example of the Week 7 deployment lesson)

---

## 1. Curriculum Overview

| Week | Day 1 (2h) | Day 2 (2h) | Day 3 (2h exercise) |
|---|---|---|---|
| 1 | How the web works | Modern JS for React | Vanilla JS + fetch mini-app |
| 2 | React intro, JSX, props | State, events, styling | Practice: component-driven UI |
| 3 | useEffect, data fetching | Forms, custom hooks | Practice → **pick capstone idea** |
| 4 | React Router / SPA nav | Project architecture | Build routing into capstone |
| 5 | Context API / useReducer | API layer patterns | Build state/data layer into capstone |
| 6 | Styling & layout | A11y + performance (memo, lazy load) | Style/polish capstone |
| 7 | Git workflow + GH Pages deploy | opencode: setup & AI-assisted dev | Deploy capstone (with opencode) |
| 8 | Capstone review + debugging clinic | Testing basics + error handling | Free build / office hours (buffer) |
| 9 | **Demo Day** (single 2h session): presentations, code review, next steps | | |

### Week-by-week detail

**Week 1 — The web and JS you need for React**
- Day 1: client-server model, HTTP, DOM vs CSSOM, browser rendering pipeline (parse→render→paint), dev tools deep-dive, npm/package.json, module systems
- Day 2: destructuring, spread/rest, arrow functions, template literals, array methods (map/filter/reduce/find), promises, async/await, fetch, JSON
- Day 3: vanilla JS app — fetch a public API, render to DOM by hand (no React yet) — sets up the "why React" pain point

**Week 2 — React fundamentals I**
- Day 1: why SPA/React, Vite setup, JSX, function components, props, lists + keys
- Day 2: useState, event handling, conditional rendering, component composition, CSS Modules intro
- Day 3: throwaway practice app (todo-list style) — state/props too fresh to build into capstone yet

**Week 3 — React fundamentals II**
- Day 1: useEffect, hooks vs lifecycle thinking, fetching data in components, loading/error/empty states
- Day 2: controlled forms, basic validation, lifting state up, first custom hook (e.g. useFetch), **5-min namecheck of Actions (useActionState/useFormStatus/useOptimistic)** — not core given 50h budget, but students should recognize them when they see them elsewhere
- Day 3: apply fetch/useEffect to capstone idea for the first time — **capstone topic chosen this week**

**Week 4 — Routing & architecture**
- Day 1: React Router — routes, Link/NavLink, nested routes, dynamic params, useNavigate
- Day 2: folder structure conventions, presentational vs container components, env variables, **configure `base` in vite.config.js for GH Pages now** (avoids deploy-day surprise)
- Day 3: build routing/navigation into capstone

**Week 5 — State & data layer**
- Day 1: Context API, useReducer, when to lift state vs reach for Context
- Day 2: dedicated services/api layer instead of scattered fetch calls, error handling patterns
- Day 3: build global state/data layer into capstone

**Week 6 — Styling, accessibility, performance**
- Day 1: styling strategy, responsive layout (flexbox/grid), design consistency
- Day 2: accessibility basics (semantic HTML, labels, focus), React.memo/useMemo/useCallback (taught conceptually — why re-renders happen), **React Compiler mention** (stable since Oct 2025, does most of this automatically in modern projects), React.lazy/Suspense
- Day 3: style/polish pass on capstone

**Week 7 — Shipping it, with AI assistance**
- Day 1: Git/GitHub workflow, GitHub Pages deployment (gh-pages package or GH Actions), SPA-on-GH-Pages routing gotcha (404.html trick or HashRouter)
- Day 2: opencode — install (`curl -fsSL https://opencode.ai/install | bash` or `npm i -g opencode-ai`), auth, TUI basics, `build` vs `plan` agent modes, workflow (explain unfamiliar code, scoped refactors, **diff review is mandatory, not optional**), where it helps (boilerplate, tests, stack-trace tracing) vs. where understanding still has to be theirs
- Day 3: deploy capstone to GH Pages, using opencode for debugging/deploy scripting where useful

**Week 8 — Debugging, testing, polish**
- Day 1: group debugging clinic — stale closures (fixed with **useEffectEvent**, not the old useRef workaround), missing dep arrays, key warnings, basename issues
- Day 2: React Testing Library basics (2-3 meaningful tests per project), error boundaries
- Day 3: open build time / office hours — buffer for whatever ran over

**Week 9 — Demo Day (2h)**
Deploy verification, live demos, quick code review per student, "where to go next" (TypeScript, React Query, Zustand/Redux Toolkit, Next.js)

---

## 2. Slidev Plan

- **One repo, one deck per session** (`slides/session-01-how-the-web-works.md` ... `session-25-demo-day.md`) — keeps sessions self-contained and reorderable
- **Shared theme/config** at repo root — one syntax highlighting theme, one font/branding setup, reused across all decks
- **Slide anatomy per session**: title/objectives slide → concept slides (short, code-heavy, minimal bullets) → live-code marker slides ("switch to editor now") → recap slide → link to that session's exercise repo
- **Pacing markers**: rough minute-count per slide in speaker notes, to self-check pacing live within the 2h block
- **Deployment**: export Slidev to static HTML, deploy to GitHub Pages — doubles as a real-world example of the exact workflow taught in Week 7
- **Code demo strategy** (decide before building): embedded/editable code blocks in Slidev for short snippets vs. alt-tabbing to VS Code once multi-file structure matters (Week 4+)

---

## 3. Capstone Project Spec

**Brief given to students (Week 1):** Build a small React SPA (3-5 views) consuming a public API of their choice, deployed to GitHub Pages by Week 7, polished by Week 8.

**Required feature checklist** (mapped to curriculum, so nothing taught goes unused):
- At least 2 routes (Week 4 — routing)
- Data fetched from an external API with loading/error states (Week 3)
- One piece of shared/global state via Context (Week 5)
- Responsive layout + basic accessibility pass (Week 6)
- Deployed and live on GitHub Pages (Week 7)
- At least 2 tests (Week 8)

**Approved API shortlist (to build out):** 6-8 free, CORS-friendly, no-secret-key APIs spanning different domains (movies, weather, countries, space, food, games, etc.) — matters because the app is static/no backend, so any API requiring a hidden key or blocking CORS breaks on GitHub Pages.

**Milestone checkpoints:** Each Day 3 exercise from Week 4 onward *is* a milestone — routing in (Wk4), state/data layer in (Wk5), styled (Wk6), deployed (Wk7) — so progress is visible weekly rather than crunched at the end.

**Demo Day rubric (to formalize):** functionality against the checklist, code organization, UI polish, and the student's ability to explain their own code — including anything opencode helped generate.

---

## 4. Additional Checkpoints Identified (not yet built out)

- **Environment/Day 0 setup checklist** — Node version, Git, GitHub account, VS Code + extensions, opencode install — handle *before* Session 1 so it doesn't eat into the first content block
- **Starter/solution repos per session** — a clone-able starter + a solution branch for each Day 3 exercise
- **Reference/cheat sheets** — hooks cheat sheet, git workflow cheat sheet, deploy checklist
- **Logistics/communication channel** — async Q&A channel, submission/review method (GitHub Classroom-style works well given Git is already being taught)
- **Demo Day rubric** — formalize the criteria above if there's any grade/certificate/completion outcome attached
- **Pacing notes per slide deck** — minute-marks to keep sessions inside their 2h window

---

## Suggested Next Steps
1. Flesh out the approved API shortlist + capstone rubric in detail
2. Build Session 1's Slidev deck as a template for the rest
3. Draft the Day 0 environment setup checklist to send students before the course starts
4. Set up the starter-repo template structure (used for both exercises and capstone scaffolding)
