---
theme: default
title: "Session 20 - opencode: Setup & AI-Assisted Development"
info: |
  Installing opencode, TUI basics, plan vs build mode,
  diff review, and prompting with context.
  Part of the React SPA Course 2026.
highlighter: shiki
transition: slide-left
mdc: true
---

# opencode: Setup & AI-Assisted Development

An assistant that reads your code — you still sign off on it.

<br>

### React SPA Course - Session 20

---

# Today's Goals

<br>

- Install opencode and connect a model
- Learn the TUI: `@` files, `!` commands, `/` commands
- Plan mode vs build mode — and when to use which
- Read a diff line by line before you accept it
- Prompt with context: file, error, expected behaviour
- Know the four things you never hand over to the tool

---

# Where We Left Off

```text
Session 19  →  capstone pushed to GitHub, deployed by Actions
Session 20  →  the tool you'll use to fix it when it breaks
```

- Deployments fail in ways you haven't seen yet: `base`, 404s, CI logs
- Reading someone else's error message at 11pm is the hard part
- opencode reads the repo, the log, and your config — then proposes a fix

```text
the deal:  it does the reading and typing,
           you do the deciding and the verifying
```

> 💡 An assistant you don't verify is just a faster way to write bugs.

---

# The Format Today

```text
install → TUI → plan/build → diff review → prompting → build it
  20m      20m      25m           25m          20m        10m
```

- Every demo runs against **your capstone**, which is already on GitHub
- Nothing gets accepted today without reading the diff first
- We install once, then use one real task end to end

---
layout: center
---

# 1. What It Is

A coding agent in your terminal.

---

# What opencode Does

```text
reads      your project files, so answers are about YOUR code
explains   unfamiliar components, hooks, build output
edits      writes and changes files when you approve it
runs       shell commands (build, test, git) after asking you
explains   shows a diff of every proposed change before it lands
```

```bash
opencode          # starts in the current directory
```

- It's a CLI tool: no browser tab, no new IDE — it lives where you already work
- The conversation is stored as a **session** you can leave and resume

---

# What It Does Not Do

| It doesn't | Why that's you |
|---|---|
| Know your requirements | You know what the app must do |
| Choose your architecture | It can suggest patterns; you pick the one that fits |
| Judge performance trade-offs | You know what you're optimizing for |
| Secure your app | Never trust it with auth, secrets, or validation unreviewed |
| Replace understanding | If you can't explain it, you can't ship it |

```text
❌ "make my app better"          → it will happily invent work
✅ "this file does X, do Y"      → it can act on that
```

> 💡 Use it as a junior developer who types fast and never gets tired of questions.

---
layout: center
---

# 2. Install & First Run

Two commands, then it's on your machine.

---

# Install

```bash
# macOS / Linux
curl -fsSL https://opencode.ai/install | bash

# any platform with Node.js
npm install -g opencode-ai

# Windows
choco install opencode        # or: scoop install opencode
```

```bash
opencode --version             # confirms the install
```

- Pick **one** method — the install script and npm both provide `opencode`
- On Windows, WSL gives the best experience, but native install works

---

# Connect a Model

```bash
cd my-capstone
opencode
```

```text
then inside the TUI:

/connect     pick a provider, paste your API key
/init        analyze this project and create AGENTS.md
```

- `/connect` stores the key — you only do this once per machine
- Without it, the TUI has nothing to talk to
- Keys live in opencode's config, never in your project files

---

# The Project Handshake

```bash
git init                     # /undo and /redo work on top of git
opencode
/init                        # writes AGENTS.md
git add AGENTS.md
git commit -m "docs: add AGENTS.md for AI-assisted dev"
```

```markdown
# AGENTS.md
- Vite + React 19, function components and hooks only
- CSS Modules; design tokens live in src/index.css
- All fetch calls in src/api/ — never inside components
- Conventional Commits; never force-push to main
- Test with Vitest + React Testing Library
```

- `/init` drafts it, you edit it — it's your project's rulebook
- Commit it: every future session starts knowing the same rules

---
layout: center
---

# 3. The TUI

The vocabulary you need to drive it.

---

# Interface Terms

| Term | Meaning |
|---|---|
| TUI | terminal user interface — the whole app is text |
| session | one conversation; `/sessions` lists and resumes them |
| context | the files and rules the tool can see right now |
| tool | an action it takes: read a file, edit it, run a command |
| diff | exactly what a proposed change would do to your files |

```text
lower-right corner shows the current mode  →  Plan or Build
```

- Start a new topic with `/new` so old context doesn't leak in
- `/models` switches model; `/themes` changes how it looks

---

# The Four Input Tricks

```text
@src/App.jsx      attach a file — fuzzy search, content joins the chat
!npm run build    run a shell command, its output joins the chat
/init             create or update AGENTS.md
/help             the full command list
```

```text
"How does auth work in @src/context/AuthContext.jsx?"
```

- `@` beats pasting: it attaches the real current file, not your memory of it
- `!` keeps you in one place — you don't tab away to run the build
- `/undo` reverts the last change (and its file edits), `/redo` puts it back

---

# Permissions

```text
opencode asks before it:
  ✎ edits a file
  ⚙ runs a shell command
```

```text
read what you are approving:
  "edit src/api/products.js"   → is that the file you meant?
  "run: npm install left-pad"  → would you run this yourself?
```

- "Allow" means **you** are running it — the tool just typed it
- Approving blindly is the same as running a script you never read
- If a request is unrelated to your ask, deny it and rephrase

---
layout: center
---

# 4. Plan Before Build

Talk first, type second.

---

# Two Modes, One Key

```text
Plan mode    reads, analyzes, proposes — changes NO files
Build mode   edits files and runs commands
Tab          toggles between them (indicator, lower right)
```

```text
Plan mode prompt:
  "I want to add a saved-cart feature. Where would state live,
   which files change, and what breaks? Don't edit anything yet."
```

- Plan mode is the safe place to be wrong
- Switch to Build only after the plan matches what you'd have written

---

# The Conversation That Works

```text
1. you:   describe the task, name the files
2. it:    a plan — files, order, risks
3. you:   "what about the loading state? and don't touch Cart.jsx"
4. it:    revised plan
5. you:   Tab → Build → "go ahead"
6. it:    a diff, then the edits
7. you:   read diff → run app → commit
```

```text
anything over one file  →  plan first
the obvious one-liner    →  build straight away
```

- Iterating on a plan costs seconds; reverting a bad build costs a commit

---
layout: center
---

# 5. The Golden Rule

Read the diff. Every single time.

---

# Anatomy of a Diff

```diff
// src/components/Cart.jsx
- const total = items.reduce((a, b) => a + b.price, 0);
+ const total = items.reduce(
+   (sum, item) => sum + item.price * item.qty,
+   0
+ );
```

```text
- lines   what is there now
+ lines   what it proposes
context   the untouched lines around it — check they still make sense
```

- The claim is "quantity was missing" — does the `+` line actually fix that?
- Nothing else changed? Scan the rest of the diff for surprises

---

# The Review Checklist

```text
□ does every hunk match what I asked for?
□ did it delete behaviour I still need?
□ are imports, props and handlers still wired up?
□ did it hardcode anything — ports, URLs, keys?
□ can I explain each hunk out loud, without the tool?
```

```bash
npm run dev      # does it still work?
npm run build    # does it still build?
git diff         # read it once more, in your own repo
```

```text
then:  accept  →  run  →  commit yourself, with a real message
```

- If you can't explain a hunk, ask it to explain it — then re-read the diff
- The tool may offer to commit; write the message yourself

---

# When It's Wrong

```text
you:  that broke the loading state — Cart shows "undefined"
      revert it

/undo            removes the last change AND its file edits
/redo            puts it back (needs a git repo — Session 19)
```

```text
better: /undo, then re-prompt with what you learned
  "qty is optional on some products — guard it with ?? 1
   and keep the loading branch as it was"
```

- `/undo` is why Session 19 came first: git is the safety net under this tool
- Never patch a bad change on top of a bad change — undo, then re-ask

---
layout: center
---

# 6. Prompting

The input quality is the output quality.

---

# Bad, Good, Better

```text
❌ bad
   Make my app better.

✅ good
   MovieCard re-renders on every keystroke in the search box.
   How can I stop that?

➕ better
   @src/components/MovieCard.jsx receives `movie` and `onSelect`.
   The parent holds the query state, so the list re-renders on each
   keystroke. How do I stop MovieCard re-rendering when `movie`
   hasn't changed — and explain why the fix works?
```

```text
file (@) + symptom + expected behaviour + what you already tried
```

---

# Paste the Evidence

```text
✅  the exact error
    TypeError: Cannot read properties of undefined (reading 'price')
      at Cart total (src/components/Cart.jsx:24:38)

✅  the console warning
    Warning: Each child in a list should have a unique "key" prop.

✅  the failing command + its output
    npm run build  →  error during build: Could not resolve "./theme"
```

```text
❌ "it doesn't work"
   → three questions back before anything useful happens
```

- Copy the message, don't paraphrase it — line numbers and stack frames matter
- Say what you expected instead: "expected the cart to show 3 items"

---

# Rules of Thumb

| Do | Don't |
|---|---|
| One problem per prompt | Bundle five issues into one |
| Name the file with `@` | Make it hunt for "the component" |
| Say what you tried | Assume it knows your last hour |
| Ask for the explanation | Accept code you can't read |
| Keep it in scope | Let it "while I'm here" refactor |

```text
follow-up prompts are free:
  "why did you choose that?"
  "what does this line do?"
  "what happens if the API returns []?"
```

---
layout: center
---

# 7. Where to Use It

Strong in some places, useless in others.

---

# Where It Helps Most

| Use case | Prompt shape |
|---|---|
| Boilerplate | "Create a contact form: name, email, message, validation errors." |
| Debugging | "This error on line 24: `<paste>`. What's wrong?" |
| Explaining code | "What does this useEffect do and when does it re-run?" |
| Refactoring | "Extract the search logic into a custom hook." |
| Stack traces | "Root cause of this trace, and the smallest fix?" |
| Deploy failures | "Blank page at `user.github.io/repo/`, Vite `base: '/repo/'` — check?" |

- Explaining unfamiliar code is the highest-value, lowest-risk use
- Refactors and bugs are where the diff review earns its keep

---

# Where You Stay in Charge

| Area | Why it's yours |
|---|---|
| Architecture | It suggests; you own the consequences for the next 6 weeks |
| Business logic | It doesn't know your rules — it will invent plausible ones |
| Performance trade-offs | Session 17: measure first, then decide |
| Security | Auth, secrets, validation: review every line, no exceptions |
| Commit messages | You were there; write it |

```text
rule: it proposes, you dispose — and you can only dispose
      if you understand what it wrote
```

---
layout: center
---

# Build It

Six steps, end to end, on your capstone.

---

# Step 1: Install & Connect

- Install with the method that matches your OS
- `opencode --version` confirms it
- `opencode` → `/connect` → paste your API key

---

# Step 2: Init the Project

```bash
cd my-capstone && git init
opencode
/init
```

- Edit `AGENTS.md`: stack, folder rules, commit conventions
- Commit it — it's project documentation, not a scratch file

---

# Step 3: Ask It to Explain

- Pick a component you wrote weeks ago and haven't touched since
- Ask for an explanation with `@src/...`
- Check its account against your own — where it's wrong, tighten `AGENTS.md`

---

# Step 4: Fix One Real Bug

- Take a real console error or failing build from your capstone
- Paste the evidence, ask for the smallest fix
- Read the diff hunk by hunk before accepting anything

---

# Step 5: Plan Something Bigger

- Tab into Plan mode for a multi-file task (a new route, a new context)
- Poke holes in the plan until it matches what you'd build
- Tab to Build, accept, then run the app

---

# Step 6: Verify & Commit

```bash
npm run dev        # the feature works
npm run build      # it still builds
git diff           # the change is small and readable
git commit -m "feat: <what you actually did>"
```

- ✅ You can explain every changed line
- ✅ No unrelated files in `git diff`
- ✅ Nothing secret in the diff

---
layout: center
---

# Try It Yourself <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

On your capstone, not the demo.

---

# Exercises <span style="display:inline-block;background:#fbbf24;color:#111;font-weight:700;padding:0.15em 0.6em;border-radius:999px;font-size:0.5em;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;margin-left:0.5em;">Exercise</span>

| Level | Task |
|---|---|
| 🟢 Easy | Ask opencode to explain one component. Verify it matches your understanding, sentence by sentence. |
| 🟡 Medium | Feed it a real error from your capstone. Read the diff, accept, run, commit. |
| 🔴 Challenge | Duplicate logic in two components → Plan mode for a custom hook, then build it, reviewing every hunk. |

<br>

**Bonus:** break something on purpose, `/undo` it, `/redo` it — prove you can get your work back.

> 💡 Easy first. The challenge is judged on your diff review, not on whether it works.

---

# Common Mistakes

| Problem | Fix |
|---|---|
| Accepted code you can't explain | Stop: `/undo`, ask for an explanation, re-read the diff |
| "It doesn't work" prompts | File + error text + expected behaviour + what you tried |
| No run after the change | `npm run dev` before you accept the next thing |
| Secrets pasted into chat | Keys and tokens never enter a prompt — rotate anything you shared |
| It chose your architecture | Plan mode for suggestions; you decide what fits |
| It committed for you | You write the commit message, you run `git commit` |
| `/undo` does nothing | No git repo — Session 19, `git init` first |
| Changes pile up across topics | `/new` when you switch problems; old context skews answers |

---
layout: center
---

# Recap

---

# What We Covered Today

- [ ] Installed opencode and connected a model
- [ ] Started it in a project and generated `AGENTS.md`
- [ ] Used `@` file references, `!` commands, and `/` commands
- [ ] Switched between Plan and Build mode with Tab
- [ ] Reviewed diffs line by line before accepting
- [ ] Prompted with file, symptom, and expected behaviour
- [ ] Named the decisions that stay mine

<br>

### Next Session

**Session 21 — Deploy Capstone with opencode** — ship the app, then debug the deploy with the tool you just learned.

---
layout: center
---

# Questions?

### Useful Links

- [opencode Docs](https://opencode.ai/docs)
- [Rules / AGENTS.md](https://opencode.ai/docs/rules)
- [Permissions](https://opencode.ai/docs/permissions)
- [Keybinds](https://opencode.ai/docs/keybinds)
- [Prompting Guide](https://www.promptingguide.ai/)
