---
theme: default
title: "Session 19 - Git Workflow & GitHub Pages Deploy"
info: |
  Git basics, branching, GitHub remotes, Vite base,
  GitHub Actions deploys, and the SPA 404 problem.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# Git Workflow & GH Pages Deploy

Your capstone, on the internet, for anyone to open.

<br>

### React SPA Course - Session 19

---

# Today's Goals

<br>

- The `add → commit → push` loop until it's a reflex
- Branches: change things without breaking `main`
- Conventional commit messages that mean something
- Push to GitHub, deploy with GitHub Actions
- Vite `base` — the one setting that blanks your site
- The SPA 404 problem, and both fixes for it

---

# Where We Left Off

```text
Session 16  →  responsive layout, design tokens
Session 17  →  semantic HTML, keyboard, memo, lazy routes
Session 18  →  design audit + polish pass, shippable
Session 19  →  put it on the internet
```

- The app is polished — and it exists **only on your laptop**
- Nobody can open it, nobody can review it, Demo Day has no link
- One wrong `rm` or one bad merge and a week of work is gone

> 💡 Deploying is the moment a project stops being homework.

---

# The Format Today

```text
repo  →  branch  →  push  →  build  →  Actions  →  404 fix  →  verify
 15m      15m       15m      20m        25m          20m         10m
```

- Repo first, deploy last — push after every step, not at the end
- We deploy at the end of class even if the app isn't "perfect"
- Every command on these slides goes in your capstone, not a scratch folder

---
layout: center
---

# 1. Git Basics

Four commands, 90% of the time.

---

# The Mental Model

```text
working tree      staging area        commit            remote
edits you make  →  git add         →  git commit    →  git push
  (untracked)       (what goes in)     (snapshot)       (GitHub)
```

- `git status` tells you exactly which bucket every file is in
- `git add .` stages everything, `git add src/App.jsx` stages one file
- A commit is a snapshot **with a message** — it's free, make many

```bash
git status     # before AND after every commit
git diff       # the exact lines you're about to commit
```

---

# Your First Commit

```bash
cd my-capstone
git init                 # creates .git, starts a branch
git branch -M main       # name it main (master → main)

git status               # what changed since the last commit
git add .                # stage everything — check .gitignore first
git commit -m "feat: initial capstone project"
git log --oneline        # your history starts here
```

- Nothing is saved until you commit — closing the laptop saves nothing
- `git branch -M main` just renames; run it once, right after `init`
- `git log --oneline` is your "what did I do this week" button

---

# What Belongs in the Repo

```text
✅ src/   public/   index.html   vite.config.js   package.json   README.md
✅ .env.example            ← variable names, empty values

❌ node_modules/           ← npm install rebuilds it (500 MB)
❌ dist/                   ← npm run build rebuilds it
❌ .env                    ← your keys live here
```

```text
# .gitignore
node_modules
dist
.env
.env.local
```

- If `git status` lists `node_modules`, fix `.gitignore` **now**
- Committed a `.env` by accident? The key is leaked — rotate it, don't just `git rm`

---

# Conventional Commits

| Prefix | Use it for | Example message |
|---|---|---|
| `feat` | new user-facing behaviour | `feat: add dark mode toggle` |
| `fix` | something was broken | `fix: cart total rounds wrong` |
| `style` | formatting, no logic change | `style: fix button spacing` |
| `docs` | README, comments | `docs: add setup steps` |
| `refactor` | same behaviour, new code | `refactor: extract useProducts hook` |
| `test` | adding tests | `test: cover loading state` |
| `chore` | tooling, deps, CI | `chore: add deploy workflow` |

```bash
git commit -m "updates"          # ❌ tells future-you nothing
git commit -m "fix: cart total"  # ✅ searchable in six months
```

---

# One Commit, One Change

```text
❌  "feat: add filter, fix typo, bump vite, restyle cards"
     → nothing is revertable on its own

✅  "feat: filter products by category"
✅  "style: align filter chips with the grid"
✅  "chore: bump vite to 6.0"
     → revert any one of them without losing the rest
```

- Small commits make `git diff` reviewable and merges nearly conflict-free
- Before committing, read your own diff — you'll catch a stray `console.log`

---

# Reading History & Backing Out

```bash
git log --oneline -10        # what happened recently
git diff                     # edits not staged yet
git diff --staged            # edits you already staged

git restore src/App.jsx      # throw away local edits to one file
git restore --staged file.js # unstage it, keep the edits
git reflog                   # every commit you've been on — the rescue net
```

```text
lost a commit you needed?     git reflog  →  git switch -c rescue <sha>
```

- `git restore` on a file discards **uncommitted** work — it's the one
  destructive command on this slide, so read `git status` first

---
layout: center
---

# 2. Branching

Try things without breaking the app everyone clones.

---

# The Branch Loop

```bash
git checkout -b feature/dark-mode    # new branch + switch to it
# ... edit files, then:
git add .
git commit -m "feat: add dark mode toggle"

git checkout main                    # back to the safe branch
git merge feature/dark-mode          # bring the work in
git branch -d feature/dark-mode      # delete it — it's merged
```

```text
git switch -c feature/dark-mode   # same thing, newer spelling
git switch main                   # same as git checkout main
```

- One branch per feature or fix — they cost nothing
- `main` only ever moves forward through a merge you chose to do

---

# Branch Names

| Branch | Meaning |
|---|---|
| `feature/dark-mode` | a new capability |
| `fix/cart-total` | something broken |
| `chore/update-deps` | maintenance, no behaviour change |
| `docs/readme` | documentation only |

```text
rules of the road
  one branch  =  one change  =  one merge
  never commit to main while a branch is open
  delete the branch after merging — the name lives on in history
```

- If a branch has three unrelated commits, it should have been three branches

---

# Conflicts Are Normal

```text
<<<<<<< HEAD
total: $24.99
=======
total: €24.99
>>>>>>> feature/dark-mode
```

```bash
git merge feature/dark-mode
# CONFLICT (content): Merge conflict in Cart.jsx

# open the file, pick the answer, delete every marker
git add Cart.jsx
git commit -m "merge: keep USD in cart totals"
```

- Two branches edited the same lines → git can't guess your intent
- After resolving, search the file for `<<<<<<<` — none may remain
- Conflicts mean two sessions touched one file, not that you broke git

---
layout: center
---

# 3. The Remote

Your laptop is a backup point, not the source of truth.

---

# Create the Repo & Push

```bash
# github.com → New repository → name it → NO readme, NO .gitignore
git remote add origin https://github.com/username/my-capstone.git
git push -u origin main        # -u: next time plain `git push` is enough

git remote -v                  # where does origin point?
```

- The GitHub repo must be **empty** — a README means you pull before you push
- `git remote -v` is the first thing to check when a push fails

---

# The Daily Loop

```bash
git status
git add .
git commit -m "feat: filter by category"
git push
```

```text
push at the end of every working block — not the end of the week
push before class ends          ← your laptop is not a backup
never: git push --force origin main   ← rewrites history others may have
```

- Pushing is also what triggers the deploy: **no push, no site**
- Commit messages are how you'll reconstruct "what changed before Demo Day"

---
layout: center
---

# 4. Build Like CI Will

If `npm run build` fails here, it fails in the cloud.

---

# Build & Preview

```bash
npm run build      # → dist/   fails on real errors
npm run preview    # → http://localhost:4173
```

```text
dist/
├── index.html
├── assets/index-abc123.js
└── assets/index-def456.css
```

- `npm run dev` ≠ production: dev server, unminified, different routing
- `preview` serves the built `dist/` — test deep links here first
- Preview with a hard refresh: any missing asset shows up as a 404 in console

---

# The `base` Setting

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/my-capstone/',     // must equal the repo name
});
```

```text
site URL     username.github.io/my-capstone/
base         '/my-capstone/'
asset URL    /my-capstone/assets/index-abc123.js
```

- Session 11 introduced this — today it decides whether the site loads
- Wrong or missing `base` → blank page + every asset 404s
- Custom domain later → `base: '/'`

> 💡 Set `base` before the first deploy, not during the deploy panic.

---
layout: center
---

# 5. Auto-Deploy with Actions

Every push to `main` becomes a deploy.

---

# The Workflow File (1/2)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]        # feature branches never deploy

permissions:
  contents: read            # may read the repo...
  pages: write              # ...publish the site...
  id-token: write           # ...and prove it's allowed to

concurrency:
  group: "pages"
  cancel-in-progress: false # never kill a deploy halfway
```

- The path is the feature: `.github/workflows/deploy.yml` on `main`
- `concurrency` keeps two rapid pushes from fighting over the site

---

# The Workflow File (2/2)

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci                  # lockfile-exact install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }

  deploy:
    needs: build                     # only if build succeeded
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

- Two jobs: `build` makes `dist/`, `deploy` publishes it
- `npm ci` needs a committed `package-lock.json` — commit it

---

# Turn It On

```text
1. commit the workflow file, push
2. repo → Settings → Pages → Source: "GitHub Actions"
3. repo → Actions tab → watch "Deploy to GitHub Pages"
4. green ✓ → the live URL is in the deploy job summary
```

- Nothing deploys until Settings → Pages says GitHub Actions
- First run 2-3 minutes, later runs about a minute
- Red X? Click the job → read the first failing step, not the last

---

# When Actions Goes Red

| Log says | Cause | Fix |
|---|---|---|
| `npm ci` fails | lockfile out of sync | `npm install` locally, commit `package-lock.json` |
| `npm run build` fails | the same error you'd see locally | run `npm run build` locally first |
| deploy step 403 / denied | Pages not enabled, or token perms | Settings → Pages → GitHub Actions; Settings → Actions → Workflow permissions → Read and write |
| no workflow at all | wrong path or wrong branch | `.github/workflows/deploy.yml` on `main` |

- The log names the file and line — paste **that** into opencode tomorrow

---
layout: center
---

# 6. The SPA 404 Problem

The homepage works. Everything else 404s on refresh.

---

# Why It Happens

```text
local dev:    /product/41  →  Vite serves index.html  →  React Router routes
GitHub Pages: /product/41  →  no such file            →  404
```

- GitHub Pages is a **static file server** — it has never heard of React Router
- It serves files that exist, and `/product/41` is not a file
- Clicking links works because routing happens in the browser (no request)
- **Refresh** or paste the URL into a new tab → the request goes to the server

---

# Fix A: HashRouter

```jsx
import { HashRouter } from 'react-router-dom';

function Main() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}
```

```text
before:  username.github.io/my-capstone/product/41
after:   username.github.io/my-capstone/#/product/41
```

- Everything after `#` never reaches the server — refresh always works
- Zero config, works on any static host
- URLs are uglier; switching later changes every link you've shared

---

# Fix B: 404.html Redirect (1/2)

```html
<!-- public/404.html — every unknown path lands here -->
<script>
  var keep = 1;                 // segments to keep: the repo name
  var l = window.location;
  l.replace(
    l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
    l.pathname.split('/').slice(0, 1 + keep).join('/') + '/?/' +
    l.pathname.slice(1).split('/').slice(keep).join('/')
      .replace(/&/g, '~and~') +
    (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
    l.hash
  );
</script>
```

```text
/product/41   →   /my-capstone/?/product/41     page loads, no 404
```

- GitHub serves `public/404.html` for missing paths — that's the hook
- `keep = 1` because your site lives under the repo-name segment

---

# Fix B: 404.html Redirect (2/2)

```html
<!-- index.html, top of <head>: turn the query back into a path -->
<script>
  (function (l) {
    if (l.search[1] === '/') {
      var decoded = l.search.slice(1).split('&')
        .map(function (s) { return s.replace(/~and~/g, '&'); })
        .join('?');
      window.history.replaceState(null, null,
        l.pathname.slice(0, -1) + decoded + l.hash);
    }
  })(window.location);
</script>
```

```text
/?/product/41   →   /product/41    React Router sees the real route
```

- **Both halves are required** — redirect alone lands on the home page
  with a weird `?/product/41` URL instead of the product

---

# Pick One

|  | HashRouter | 404.html trick |
|---|---|---|
| URL shape | `/#/product/41` | `/product/41` |
| Setup | swap one import | two HTML snippets |
| Refresh on deep route | works | works |
| Rename the repo | unaffected | recheck the `keep` segment |
| Demo Day link | fine | nicer |

```text
choose one before the end of class
half-configured  →  broken in production only, never in dev
```

---
layout: center
---

# 7. Deploy Checklist

Run it before you push the workflow.

---

# Before You Push

```text
□ npm run build passes with no errors
□ npm run preview: no 404s in the console, deep routes load
□ no console.log left in src/
□ no http://localhost:... anywhere in src/     (grep for it)
□ .env is gitignored, .env.example is committed
□ vite.config.js base matches the repo name exactly
□ public/404.html exists (if you kept BrowserRouter)
□ package-lock.json committed
□ README says how to run it — and has the live URL
```

---

# After You Deploy

```text
□ live URL loads — styles, fonts, images all resolve
□ refresh on a deep route → correct page, not 404
□ paste a deep URL into a fresh tab → correct page
□ API calls succeed from the deployed origin
□ open it at 320px on the real site, not just devtools
□ incognito window (no cache) opens it fine
□ the Actions run for your last push is green
```

<br>

> 💡 Test the deployed site, not the memory of the deployed site.

---
layout: center
---

# Build It

Seven steps. Repo first, live URL last.

---

# Step 1: The Repo

```bash
git init && git branch -M main
git add . && git commit -m "feat: initial capstone project"
```

- Confirm `.gitignore` blocks `node_modules`, `dist`, `.env`
- `git status` clean before you go further

---

# Step 2: GitHub & First Push

- Create an empty repo on GitHub (no README, no `.gitignore`)
- `git remote add origin <url>` then `git push -u origin main`
- Verify on github.com: the files are there

---

# Step 3: Branch, Merge, Push

- `git checkout -b feature/<something small>` — a real change
- Commit it with a conventional message, merge to `main`, push
- Confirm `git log --oneline` tells the story in three lines

---

# Step 4: Build + `base`

- `base: '/your-repo-name/'` in `vite.config.js`
- `npm run build` then `npm run preview`
- Refresh a deep route in preview; check the console for 404s

---

# Step 5: The Workflow

- Add `.github/workflows/deploy.yml` (both jobs from the slides)
- Settings → Pages → Source: **GitHub Actions**
- Push and watch the Actions tab — first run takes a couple of minutes

---

# Step 6: The 404 Fix

- HashRouter: change one import, push, re-test
- Or 404.html: `public/404.html` **and** the decode script in `index.html`
- Refresh a deep route on the **live** site until it survives

---

# Step 7: Verify Live

- ✅ Homepage loads with correct styles (`base` is right)
- ✅ Deep route refresh works on the live URL
- ✅ API data loads, loading and error states still show
- ✅ 320px and 768px on the real site
- ✅ Link works in an incognito window

<br>

> 💡 If only step 7 fails, the fix is almost always `base` or the 404 half.

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Push your capstone to GitHub, enable Pages via Actions, put the live URL in your README. |
| 🟡 Medium | Feature branch → real change → merge → confirm Actions redeploys it. |
| 🔴 Challenge | Deep-link refresh works on every route: HashRouter **or** 404.html + decode script. |

<br>

**Bonus:** break `base` on purpose, deploy the blank page, then fix it and redeploy — so you recognise it forever.

> 💡 Easy first. The challenge needs a refresh on a deep URL, not a green build.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| `remote origin already exists` | `git remote -v` to inspect, `git remote set-url origin <url>` |
| Blank page after deploy | `base` doesn't match the repo name — fix, rebuild, push |
| Assets return 404 | Same cause as the blank page; hard-refresh after fixing |
| Deep route 404s on refresh | HashRouter or 404.html **plus** the decode script |
| Actions tab is empty | Workflow must be `.github/workflows/deploy.yml` on `main` |
| Deploy step denied | Settings → Pages → Source: GitHub Actions |
| `node_modules` committed | Fix `.gitignore`, then `git rm -r --cached node_modules` |
| History rewritten on `main` | Never `--force` push shared branches; recover via `git reflog` |
| Conflict markers in production | Search `<<<<<<<` before every commit |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Ran `add → commit → push` until it was automatic
- [ ] Kept `main` working with feature branches and merges
- [ ] Wrote conventional commit messages
- [ ] Built and previewed production output locally
- [ ] Set Vite `base` to match the repo name
- [ ] Deployed with a GitHub Actions workflow
- [ ] Fixed the SPA refresh-404 with HashRouter or 404.html

<br>

### Next Session

**Session 20 — opencode: Setup & AI-Assisted Development** — install the AI pair-programming tool you'll use to debug this deploy.

---
layout: center
---

# Questions?

### Useful Links

- [GitHub Pages](https://docs.github.com/en/pages)
- [Vite: Static Deploy](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [spa-github-pages](https://github.com/rafgraph/spa-github-pages)
