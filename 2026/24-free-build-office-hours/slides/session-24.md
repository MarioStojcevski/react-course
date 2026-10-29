---
theme: default
title: "Session 24 - Free Build / Office Hours"
info: |
  Buffer session: work the Demo Day priority checklist,
  fix last-minute issues, polish, and rehearse your demo.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Free Build / Office Hours

Finish it. Fix it. Rehearse it.

<br>

### React SPA Course - Session 24

---

# Today's Goals

<br>

- Work the **priority checklist** — must have before should have
- Fix the classic last-minute issues (API, routes, tests, mobile)
- Get unblocked fast with a good help request
- Polish: loading, empty, viewport, favicon
- Rehearse your 3-minute demo out loud

---

# The Rules Today

```text
1. must have  →  should have  →  nice to have     (in that order)
2. one bug at a time — verify, then move on
3. no new features after the checklist is green
4. commit and push before you leave
```

- The day ends with a **working deployed app**, not a perfect one
- Perfectionism is the enemy of Demo Day

> 💡 A working app with small flaws beats an unfinished perfect one.

---
layout: center
---

# 1. Priority Checklist

Work top to bottom. Stop skipping rows.

---

# Must Have — Minimum Viable Demo

```text
□ app loads without errors        (console clean on the live URL)
□ at least 2 routes that work     (deep link + refresh)
□ data from an external API       (not hardcoded)
□ loading and error states shown  (all three outcomes)
□ deployed on GitHub Pages        (live, incognito-tested)
```

- These are rubric lines — missing one costs points publicly
- Test each on the **deployed** URL, not localhost

---

# Should Have — Good Demo

```text
□ context / global state working  (cart, favorites, theme)
□ responsive on mobile            (320px, real site)
□ 2+ tests passing                (npm run test -- run)
□ clean code                      (no console.log, no dead files)
```

- Every "should" you skip is visible in the rubric's polish column
- The test run takes 10 seconds — just do it

---

# Nice to Have — Great Demo

```text
□ skeleton loading states          □ keyboard accessibility
□ custom error boundary           □ dark mode toggle
```

- Only after must + should are **all** green
- Pick at most one — timeboxed. The demo matters more

---
layout: center
---

# 2. Last-Minute Fires

The four that show up the night before.

---

# Fire: "My API stopped working"

```text
check 1   is it still free / CORS-friendly?
check 2   key or base URL in .env? is .env gitignored but .env.example committed?
check 3   VITE_* values are baked at build time — rebuild after changing them
```

```text
opencode: "My fetch to https://... returns a CORS error.
           Here's the call site: [paste code]. What should I check first?"
```

- DummyJSON needs no key — a hardcoded public base URL is fine
- A secret belongs on a backend, never in a `VITE_` variable

---

# Fire: "Routes break on GitHub Pages"

```text
check 1   public/404.html present?   (the redirect half)
check 2   decode script in index.html?  (the other half)
check 3   vite base matches the repo name
check 4   simplest fallback: HashRouter — works everywhere
```

- Session 19 covered both fixes — pick one, verify with a hard refresh
- Refresh on a deep route on the **live URL** is the test

---

# Fire: "Tests are failing"

```bash
npm run test -- run
```

```text
query not found      → component text changed, update the selector
async timing         → use findBy*, not getBy* for loaded data
act() warning        → await the interaction before asserting
```

```text
opencode: "My test fails with [error]. Here's the test: [paste]. Fix?"
```

- Two passing tests is the rubric line — don't debug a third one today

---

# Fire: "App looks broken on mobile"

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

```text
Ctrl+Shift+M          DevTools device toolbar
320px                 the width that exposes every overflow
overflow-x: hidden    the last-resort body rule — fix the real culprit first
```

- Check the navbar first — it's the most-seen component
- Test the **live** site, not the dev server

---
layout: center
---

# 3. Polish That Counts

Small fixes, visible everywhere.

---

# Quick Wins

```jsx
// loading state — never a blank frame
function LoadingSpinner() {
  return (
    <div className={styles.center}>
      <div className={styles.spinner} />
      <p>Loading...</p>
    </div>
  );
}

// empty state — "no results" is a state, not an error
function EmptyState({ message }) {
  return <p className={styles.center}>{message || 'Nothing to show here yet'}</p>;
}
```

```html
<!-- index.html: favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

- Loading, empty, error: every data view has three versions
- This is exactly what Session 18 and the rubric's polish column reward

---

# Cleanliness Pass

```bash
grep -r "console.log" src/     # remove stragglers
grep -r "localhost" src/       # nothing local ships
git status                     # nothing uncommitted
```

```text
□ dead components deleted
□ commented-out code removed
□ folder structure matches Session 11
□ .env gitignored, .env.example committed
□ README updated with what the app does
```

> 💡 The reviewer reads your repo. Clean it like they will.

---
layout: center
---

# 4. Getting Unblocked

Ask like a professional.

---

# A Good Help Request

```text
My ProductCard doesn't re-render when the cart state changes.
I'm using React.memo. Here's the parent: [parent code]
Here's ProductCard: [component code]
What am I doing wrong?
```

```text
❌ "My app is broken. Help."
✅ symptom + code + what you already tried
```

- With opencode: attach the files with `@`, give the error verbatim
- With a human: 30 seconds of context saves 5 minutes of back-and-forth

---

# Timebox Everything

```text
20 min  stuck on one bug  →  ask for help, note it, move on
15 min  one nice-to-have  →  if it isn't done, it isn't happening
10 min  demo rehearsal    →  non-negotiable, every student
```

- The checklist order **is** the priority order
- Anything unfinished gets a line in "what I'd improve" — that's a demo answer, not a failure

---
layout: center
---

# 5. Rehearse the Demo

Three minutes, out loud, today.

---

# Your 3-Minute Script

```text
0:00  problem     what the app does, for whom, which API
1:30  live demo   main user flow, 2-3 features, mobile if responsive
2:30  code        your favorite component + one interesting decision
2:50  wrap        hardest bug you fixed + what you'd improve
```

- Practice **out loud** with a timer — reading silently lies to you
- Have a backup: screenshots or a short screen recording

> 💡 If you can't explain a line of your code, don't ship it yet.

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

Your capstone, your checklist.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Clear every "must have" row on the priority checklist. |
| 🟡 Medium | Add a loading skeleton to your main data view. |
| 🔴 Challenge | One more test covering the critical user journey. |

<br>

**Bonus:** record your 3-minute demo, watch it back, cut everything that rambles.

> 💡 Must have first. Never start a challenge with a red must-have row.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| Adding new features today | Checklist first — features after Demo Day |
| Perfectionism, nothing ships | Working > flawless; note ideas for "what I'd improve" |
| Fixing on localhost only | Verify every fix on the live URL |
| Never rehearsed | Timer + out loud. Reading silently isn't practicing |
| Uncommitted work | `git push` before you leave — every session |
| "I don't know my own code" | Walk your data flow: api → context → page |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Worked the priority checklist top to bottom
- [ ] Fixed the classic last-minute fires: API, routes, tests, mobile
- [ ] Polished loading, empty, and favicon details
- [ ] Passed the cleanliness pass — no stray logs, nothing uncommitted
- [ ] Asked for help with a structured request
- [ ] Rehearsed my 3-minute demo with a timer

<br>

### Next Session

**Session 25 — Demo Day** — present your capstone, answer questions, collect feedback.

---
layout: center
---

# Questions?

### Useful Links

- [Demo Day: How to Give a Great Demo](https://www.productschool.com/blog/job-search/how-to-give-a-great-demo/)
- [GitHub Pages](https://docs.github.com/en/pages)
- [Vitest](https://vitest.dev/)
