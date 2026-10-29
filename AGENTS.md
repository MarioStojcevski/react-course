# AGENTS.md

## What this repo is

Teaching materials for a 25-session React SPA course (instructor: Mario).
`2026/` is the active course; `2024/` is last year's course, reference only.
This is a content repo, not an app: no root lint/test/typecheck tooling exists.

## Layout

Each session lives at `2026/NN-topic-name/` with up to three parts:

- `slides/session-NN.md` — Slidev deck (all 25 exist)
- `code/` — session exercise/app code (only 01, 02, 03, 05 have real code; the rest are empty placeholders)
- `README.md` — student handout, consistent format (Concepts → Try It Yourself → Common Mistakes → Recap checklist)

Planning doc: `2026/react-course-brief.md`. Its progress log lags the repo; trust the files.

## Slides (Slidev)

Slidev deps live only at the repo root. Always run from the root:

```
npm run slides:05        # preview one session
npm run slides:build     # build (pass the entry file like the scripts do)
```

- The `slides:NN` script must point at `2026/<folder>/slides/session-NN.md`. When adding a session, add its script to root `package.json`.
- Do not run `slidev` from inside a session folder; it creates stray `slides/node_modules` caches (several sessions already have one locally).
- Deck frontmatter convention: `theme: default`, `highlighter: shiki`, `transition: slide-left`, `mdc: true`.
- Files are UTF-8 with em dashes; PowerShell console output may mangle them — that's display, not the file.

## Session code

- Exercises go in the session's `code/` folder, not separate projects (per the brief).
- Session `05-state-events-styling/code/` is a standalone Vite + React 18 app (React 18, Vite 5, CSS Modules). It has its own `package.json`: `npm install` then `npm run dev` from that folder.
- Course conventions being taught: function components + hooks only, CSS Modules, no Redux, Vite, DummyJSON API (no key needed). Keep demo code consistent with these.
- Vanilla-JS-era sessions (01–03) use plain HTML/JS files opened directly in a browser.

## Git / contributions

- Student solutions arrive as PRs from branches named `solution/NN-username` (e.g. `solution/03-mariostojcevski`) and are merged into `main`.
- Root `.gitignore` covers `node_modules/`, `dist/`, `.DS_Store` only; don't commit dev logs or local caches.
