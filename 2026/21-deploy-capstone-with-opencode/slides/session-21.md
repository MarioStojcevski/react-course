---
theme: default
title: "Session 21 - Deploy Capstone with opencode"
info: |
  Pre-deploy checks, build and preview, shipping with
  Actions, and debugging the deployed site with opencode.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Deploy Capstone with opencode

Ship it, then debug it with the tool you learned yesterday.

<br>

### React SPA Course - Session 21

---

# Today's Goals

<br>

- Run the pre-deploy checklist and actually clear it
- Build and preview like the GitHub runner will
- Push, watch Actions, read the log when it goes red
- Debug the live site with a prompt template
- Fix the three classic deploy failures
- Verify the deployed site, not the local one

---

# Where We Left Off

```text
Session 19  →  git workflow, GitHub Actions, the SPA 404 fix
Session 20  →  opencode: install, diff review, prompting
Session 21  →  both at once — deploy, break, debug, redeploy
```

- You have a repo and a workflow — but the live URL may still be a blank page
- Session 19's failures are exactly what today is for
- New: opencode reads your config and the error **with you**

```text
19 → how deployment works
20 → how to ask for help
21 → deployment when it doesn't work
```

> 💡 The first deploy is a guess. Debugging it is the skill.

---

# The Format Today

```text
checklist → build → push → watch → debug → verify → ship
   15m       20m     10m     15m      30m      20m     10m
```

- Nothing goes out until the local checklist is clean
- If it breaks, we debug with a template — not with random guessing
- The session ends with a live URL you've verified yourself

---

layout: center
---

# 1. Pre-Deploy Checklist

Green locally first. Always.

---

# Before You Touch GitHub

```text
□ npm run build            finishes with no errors
□ npm run preview          loads, console clean
□ no console.log in src/   grep -r "console.log" src/
□ no localhost URLs        grep -r "localhost" src/
□ .env gitignored          and .env.example committed
□ base set in vite.config  matches the repo name
□ package-lock.json        committed (CI runs npm ci)
□ routes work in preview   including refresh on a deep route
```

```bash
npm run build && npm run preview
```

- Every unchecked box is a bug you'll debug on the live site instead

---

# Env Vars Don't Travel

```text
VITE_* values are baked into the JS at build time
the GitHub runner has no .env — it's gitignored
→ import.meta.env.VITE_API_URL is undefined in production
```

```js
// ✅ public values only, safe to ship
const API_URL = 'https://dummyjson.com';

// ❌ a secret here is readable by anyone: View Source
const API_KEY = import.meta.env.VITE_API_KEY;
```

- Anything in the bundle is public — a static site has no server to hide behind
- DummyJSON needs no key: hardcode the public base URL or commit a public `.env`
- A secret must live on a backend, not in a `VITE_` variable

---

# Build & Preview

```bash
npm run build      # → dist/
npm run preview    # → http://localhost:4173
```

```text
preview respects vite's `base`
  base: '/my-capstone/'   →   http://localhost:4173/my-capstone/
  wrong base shows up HERE, before GitHub ever sees it
```

```text
check in dist/index.html:
  <script src="/my-capstone/assets/index-abc123.js">
                    ^^^^^^^^^^^^^^ must be your repo name
```

- Test a deep route in preview with refresh — that's the 404 case
- If assets 404 in preview, they will 404 in production

---

layout: center
---

# 2. Ship It

One push, then watch the machine work.

---

# Push

```bash
git add .
git commit -m "chore: prepare for deployment"
git push
```

```text
repo → Actions tab → "Deploy to GitHub Pages" → latest run
  build job    checkout → npm ci → npm run build → upload dist
  deploy job   publish dist to Pages
  green ✓      live URL in the job summary
```

- The run only starts for pushes to `main`
- First run 2-3 minutes, later runs about a minute
- Green build but old site? Hard-refresh; the deploy job's URL is authoritative

---

# Read the Log When It's Red

```text
1. click the red X on the job
2. expand the failing STEP (npm run build, not checkout)
3. scroll to the FIRST error — later errors are usually fallout
4. copy the file, line, and message verbatim
```

```text
error during build:
Could not resolve "./Cart.module.css" from src/pages/Cart.jsx
   ^ file                  ^ line        ^ what it expected
```

- One failed step stops the rest — the first error is the real one
- Run the same command locally: `npm run build` reproduces most CI failures

---

layout: center
---

# 3. Debugging with opencode

Symptom → evidence → hypothesis → smallest fix → re-test.

---

# The Prompt Template

```text
Deployed: https://username.github.io/my-capstone/
Symptom:  <what you see, status code, console error>
Works:    `npm run preview` locally, all routes OK
Config:   Vite, base '/my-capstone/', BrowserRouter
File:     @vite.config.js, @public/404.html
Tried:    <what you already changed>
What should I check first?
```

```text
❌ "my deploy is broken"
✅ URL + symptom + config + file + what you tried
```

- The URL matters: it shows the base segment and the route
- "What should I check first?" gets a ranked list, not a wall of code

---

# The Debug Loop

```text
1. reproduce      the exact URL, in a fresh tab, with console open
2. classify       blank page / asset 404 / route 404 / workflow / CORS
3. prompt         template above, attach the file with @
4. read           the suggested diff — does it address YOUR symptom?
5. smallest fix   one change, not a rewrite
6. redeploy       commit, push, watch the run
7. re-test        the SAME url, the SAME way
```

```text
a fix that isn't verified on the live URL is a hypothesis, not a fix
```

---

# Three Prompts That Work

| Symptom | Prompt |
|---|---|
| Blank page | "Deployed site is blank. Build succeeds, `base: '/my-capstone/'`. No console errors. What should I check first?" |
| Assets 404 | "CSS/JS return 404: `/assets/index-abc123.js`. Site is at `username.github.io/my-capstone/`. What's wrong?" |
| Refresh 404 | "Refresh on `/about` returns GitHub's 404. React Router BrowserRouter, Vite. How do I fix it?" |

- Each prompt gives: state, evidence, config — three facts, no fluff
- Attach the actual file with `@` so the answer is about your setup

---

layout: center
---

# 4. The Classic Failures

Four symptoms, four first checks.

---

# Symptom → Fix

| Symptom | First check | Fix |
|---|---|---|
| Blank page, clean console | `base` in `vite.config.js` | `base: '/repo-name/'`, rebuild, push |
| Assets 404 (`/assets/...`) | same as above | same — asset URLs are built from `base` |
| Refresh on deep route → 404 | no 404.html, or decode missing | Session 19: HashRouter or **both** 404 halves |
| Actions tab empty | file path / branch | `.github/workflows/deploy.yml` on `main` |
| Deploy step denied | Pages source | Settings → Pages → Source: GitHub Actions |
| `npm ci` fails | lockfile | `npm install` locally, commit `package-lock.json` |

```text
in order of likelihood:  base  →  404 fix  →  workflow  →  permissions
```

---

# Local vs Live

```text
works locally, broken live
  ├─ base wrong            → assets 404, styles gone
  ├─ .env not on the runner → VITE_* undefined in the bundle
  ├─ API blocks the origin → CORS error in the live console
  └─ cache                 → hard-refresh, then incognito test
```

```text
broken in both
  └─ a real bug — debug it locally, deploy the fix
```

- Open the live console: the browser tells you which branch of that tree you're on
- CORS reads "No 'Access-Control-Allow-Origin' header" — the API's problem, not React's
- DummyJSON allows CORS; a self-hosted API usually doesn't until you configure it

---

# Don't Chase the Wrong Thing

```text
❌ rewriting components because the site is blank
❌ reinstalling node_modules because of a 404 on /assets/
❌ switching to HashRouter before checking `base`
```

```text
✅ blank page            →  look at network tab: did index.html load?
✅ index.html loads      →  did the JS/CSS load? (base)
✅ assets load           →  then it's routing (404 fix) or a runtime error
```

- Follow the load order: HTML → CSS/JS → route → data
- Stop at the first thing that fails — that's the fix, not the fifth thing

---

layout: center
---

# 5. Verify the Live Site

If you didn't test it live, you didn't deploy it.

---

# Post-Deploy Verification

```text
□ homepage loads — styles, fonts, images resolve
□ every route opens from a direct URL (type it, don't click)
□ refresh on a deep route → correct page, not GitHub's 404
□ API data arrives; loading, empty, and error states all show
□ images load (asset paths follow `base`)
□ 320px and 768px on the real site
□ console has no CORS or 404 errors
□ incognito window opens it — no cached lies
□ a second device or a classmate's laptop can open the URL
```

- Clicking through your own nav proves nothing — **type the URL**
- The console is part of the checklist, not an afterthought

---

# Custom Domain (Optional)

```text
1. add public/CNAME containing  yourdomain.com
2. DNS: point your domain at username.github.io
3. vite.config.js → base: '/'
4. repo → Settings → Pages → enable HTTPS
```

```text
/CNAME is a file, not a setting — it deploys with your site
base: '/' because the repo-name segment is gone now
```

- Verify the old repo URL still redirects, then test every route again
- Skip it entirely — the GitHub URL is fine for Demo Day

---

layout: center
---

# Build It

Six steps to a verified live URL.

---

# Step 1: Clear the Checklist

- Build, preview, grep for `console.log` and `localhost`
- Confirm `.env` rules and `base` are right
- Nothing ships with a dirty working tree

---

# Step 2: Preview Deep Routes

- `npm run preview`, then refresh a deep route in that tab
- Console clean? Assets resolve?
- If it's broken here, it's broken live — fix it now

---

# Step 3: Push

- `chore: prepare for deployment` → `git push`
- Actions tab: watch `build` then `deploy`
- Green? Take the URL from the job summary

---

# Step 4: Verify Live

- Run the full verification list — type every URL by hand
- Check the console on the live origin, not just locally
- Test at 320px on the real site

---

# Step 5: Debug If It's Broken

- Classify the symptom first (blank / asset / route / workflow)
- Use the prompt template with the live URL attached
- Read the diff: one change that addresses your symptom

---

# Step 6: Redeploy & Re-test

```bash
git add .
git commit -m "fix: <the actual fix>"
git push
```

- ✅ Actions green for this commit
- ✅ The **same** URL now behaves — hard-refresh, then incognito
- ✅ Deep routes, API, and mobile still pass

<br>

> 💡 A green build is not a fix. The re-test is the fix.

---

layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Deploy your capstone and verify the homepage loads from the live URL in incognito. |
| 🟡 Medium | Type every deep route by hand on the live site. Fix any 404 with the opencode prompt template. |
| 🔴 Challenge | Ship a designed 404 page that still performs the redirect — deep links must keep working. |

<br>

**Bonus:** record a 60-second walk of the live site for Demo Day: home → deep route → refresh → mobile.

> 💡 Easy first. The challenge must survive a refresh, not just look good.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| Works in preview, blank live | Compare the URL segment to `base` — they must match |
| Assets 404 after deploy | Wrong `base`, or the browser cached the old HTML — hard-refresh |
| Actions green, site stale | Check the latest run's URL; caches survive a redeploy |
| `npm ci` fails in CI | Commit `package-lock.json` |
| API works locally, fails live | Console CORS message, or `VITE_*` value missing at build time |
| Pushed, nothing happened | Workflow path and branch: `.github/workflows/deploy.yml` on `main` |
| Deep link still 404s | 404.html **and** the decode script, or HashRouter |
| opencode "fixed" it, still broken | Re-test the same URL; give it the live URL next time |
| Secret in the repo | Rotate the key first, remove it second |

---

layout: center
---

# Recap

---

# What We Covered Today

- [ ] Cleared a pre-deploy checklist before touching GitHub
- [ ] Understood that `VITE_*` values are baked in at build time
- [ ] Built and previewed with the correct `base`
- [ ] Pushed and read an Actions log to the first real error
- [ ] Debugged the live site with a structured opencode prompt
- [ ] Diagnosed the classic blank page, asset 404, and route 404
- [ ] Verified every route, state, and viewport on the deployed URL

<br>

### Next Session

**Session 22 — Capstone Review + Debugging Clinic** — group debugging: stale closures, missing deps, and the bugs you've been living with.

---

layout: center
---

# Questions?

### Useful Links

- [GitHub Pages](https://docs.github.com/en/pages)
- [Vite: Static Deploy](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions](https://docs.github.com/en/actions)
- [opencode Docs](https://opencode.ai/docs)
- [spa-github-pages](https://github.com/rafgraph/spa-github-pages)
