---
theme: default
title: "Session 25 - Demo Day"
info: |
  Present your capstone: format, rubric, feature checklist,
  explaining your code, handling questions, and where to go next.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Demo Day

You built it. Now show it.

<br>

### React SPA Course - Session 25

---

# Today's Goals

<br>

- Present your capstone in **3 minutes**
- Answer questions about your own code
- Know the rubric — you grade yourself first
- Verify the feature checklist, live, one last time
- Give and receive useful code review
- Leave with a plan for what to learn next

---

# The Format

```text
per student
  3 min   demo your app
  2 min   questions / code review
  ───────────────────────────
  5 min   total
```

```text
order of the day
  intro → presenters in order → feedback between → wrap-up
```

- Timer is real — practice to 3 minutes, not "about 3"
- Watch the others: steal ideas, give genuine feedback

> 💡 Start with the problem, not the code.

---
layout: center
---

# 1. Your 3 Minutes

Structure beats improvisation.

---

# The Script

```text
0:00  The problem (30s)
      what the app does, who it's for, which API

1:30  Live demo (1.5 min)
      the main user flow, 2-3 key features, mobile if responsive

2:30  Code walkthrough (1 min)
      your favorite component + one interesting technical decision

2:50  What you learned (30s)
      hardest bug you fixed + what you'd improve with more time
```

- **Problem first** — context makes every feature land better
- Demo the flow, not the file tree
- Practice out loud with a timer before you get here

---

# Do / Don't

```text
✅ explain WHY you chose things        ❌ read code line by line
✅ show data flow: api → context → UI  ❌ rush without explaining
✅ name trade-offs you considered      ❌ "I don't know" — say what you'd research
✅ own your learning                   ❌ blame opencode for your code
```

- "I used opencode for X, but I made sure I understood every line" — honest and strong
- You built a full React app from scratch. Act like it.

---
layout: center
---

# 2. The Rubric

Four columns, 25 points each.

---

# How You're Graded

| Criteria | Pts | What it means |
|---|---|---|
| **Functionality** | 25 | Meets the feature checklist: routes, API, context, responsive, deployed, tests |
| **Code Organization** | 25 | Clean folders, meaningful names, separated concerns |
| **UI Polish** | 25 | Consistent styling, responsive, loading/error states |
| **Code Understanding** | 25 | Explains decisions, knows what every line does |

```text
symmetry:  you can demo  →  functionality
           you can explain  →  code understanding
```

- The last column is the one people neglect — know your own code

---

# Feature Checklist Verification

```text
□ 2+ routes          navigate between pages on the live URL
□ API + loading/err  show the loading state, then the data
□ context            shared state visible across components
□ responsive         show the mobile viewport
□ deployed           GitHub Pages, live, incognito
□ 2+ tests           npm run test -- run — show the green
```

- Verify on the **deployed** site, right before you present
- Any red row: fix it now or put it in "what I'd improve"

---
layout: center
---

# 3. Handling Questions

Two minutes. Come prepared.

---

# The Four Questions

```text
Q  "Why this API?"
A  free, CORS-friendly, good docs — and it taught me the patterns.

Q  "Hardest part?"
A  [specific challenge] → [specific solution]. Name the bug, name the fix.

Q  "What would you add with more time?"
A  [feature] because [reason]. Also [polish area].

Q  "How did opencode help?"
A  [specific task]. I verified and understood everything it generated.
```

- Prepare these four **in advance** — they're the most-asked
- "I learned X but would research Y further" is a good answer, never a bad one

---

# Reviewing Others

```text
ask      about interesting patterns and decisions
suggest  improvements constructively — one or two, not a list
share    what you learned from their approach
be kind  everyone here built something from scratch
```

- Good feedback: "Have you considered X? Your Y made me think of..."
- You'll learn as much from four reviews as from your own demo

---
layout: center
---

# 4. After This Course

The end of the course, not of React.

---

# Where to Go Next

| Topic | What to learn | Why |
|---|---|---|
| **TypeScript** | Type safety for React | Catches bugs the compiler can see |
| **React Query** | Server state | Caching, refetching — less boilerplate |
| **Zustand** | Simple global state | Smaller API than Redux when context gets heavy |
| **Next.js** | Full-stack React | SSR, routing, the industry standard |
| **Testing** | Deeper suites | Coverage, CI, e2e with Playwright |
| **CSS-in-JS / Tailwind** | Other styling worlds | Compare approaches you now have the basics for |

---

# Keep Going

```text
1. keep building      2-3 more projects cement the skills
2. open source        beginner-friendly issues on GitHub
3. communities        Reactiflux Discord, r/reactjs
4. follow the news    react.dev/blog
5. teach others       explaining it is how you know it
```

- The capstone goes in your portfolio — update the README like a product
- Every project after this one gets easier. That's the whole point

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Presented my capstone in 3 minutes, problem first
- [ ] Walked through my code and explained my decisions
- [ ] Verified every feature checklist line on the live URL
- [ ] Answered questions about my technical choices
- [ ] Gave useful feedback on other projects
- [ ] Chose what to learn next

<br>

### Congratulations

You learned React by **building and shipping a real app**. That's the whole course.

---
layout: center
---

# Questions?

### Useful Links

- [React Roadmap](https://roadmap.sh/react)
- [React Interview Questions](https://github.com/sudheerj/reactjs-interview-questions)
- [Project Ideas](https://github.com/florinpop17/app-ideas)
- [Open Source Guide](https://opensource.guide/how-to-contribute/)
- [react.dev](https://react.dev)
