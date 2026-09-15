# Session 19 — Git Workflow & GitHub Pages Deploy

## What We're Learning Today

Code on your computer isn't safe — and nobody can see it. Today we learn proper Git workflow and deploy your capstone to GitHub Pages so the world can see it.

## Prerequisites

- Sessions 01-18 completed
- Capstone project polished and ready
- GitHub account

## Concepts

### 1. Git Basics Refresher

```bash
# Initialize a repo
git init

# Check status
git status

# Stage files
git add .              # stage everything
git add filename.js    # stage one file

# Commit
git commit -m "feat: add user authentication"

# Push to GitHub
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

### 2. Branching — Work Without Breaking Main

```bash
# Create and switch to a new branch
git checkout -b feature/dark-mode

# Make changes, commit them
git add .
git commit -m "feat: add dark mode toggle"

# Switch back to main
git checkout main

# Merge the feature branch
git merge feature/dark-mode

# Delete the feature branch (optional)
git branch -d feature/dark-mode
```

**Branch naming conventions:**
- `feature/description` — new features
- `fix/description` — bug fixes
- `chore/description` — maintenance tasks

### 3. GitHub Actions — Automated Deployment

Create a workflow file:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 4. Vite Config for GitHub Pages

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Must match your GitHub repo name
});
```

### 5. SPA Routing on GitHub Pages

GitHub Pages doesn't handle client-side routing by default. When users refresh a page like `/about`, GitHub returns 404.

**Solution 1: 404.html redirect (recommended)**
```html
<!-- public/404.html -->
<!DOCTYPE html>
<html>
  <head>
    <script>
      // Redirect all 404s to index.html with the path as a query param
      var pathSegmentsToKeep = 1; // Keep the repo name
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

**Solution 2: HashRouter (simpler)**
```jsx
import { HashRouter } from 'react-router-dom';

function Main() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}
// URLs become: yoursite.com/#/about instead of yoursite.com/about
```

### 6. Deployment Checklist

Before deploying:

- [ ] All `console.log` statements removed
- [ ] No hardcoded localhost URLs
- [ ] `.env` file is in `.gitignore`
- [ ] `base` is set correctly in `vite.config.js`
- [ ] App builds without errors: `npm run build`
- [ ] No broken routes on refresh (404.html or HashRouter)

### 7. Git Commit Best Practices

Use Conventional Commits:

```bash
git commit -m "feat: add movie search functionality"
git commit -m "fix: resolve cart total calculation"
git commit -m "style: improve responsive layout"
git commit -m "docs: update README with setup instructions"
```

**Why?** Clear commit history makes it easy to understand what changed and why.

## Step-by-Step Walkthrough

1. Initialize Git in your capstone:
   ```bash
   git init
   git add .
   git commit -m "feat: initial capstone project"
   ```

2. Create a repository on GitHub (don't initialize with README)

3. Push your code:
   ```bash
   git remote add origin https://github.com/username/capstone-project.git
   git push -u origin main
   ```

4. Create `.github/workflows/deploy.yml` (see section 4 above)

5. Update `vite.config.js` with your repo name as `base`

6. Create `public/404.html` for SPA routing (see section 5 above)

7. Push the changes:
   ```bash
   git add .
   git commit -m "chore: add GitHub Pages deployment"
   git push
   ```

8. Go to your repo → Settings → Pages → Ensure "GitHub Actions" is selected

9. Wait 2-3 minutes, then visit `https://username.github.io/repo-name/`

## Try It Yourself

1. **Easy:** Push your capstone to GitHub and enable GitHub Pages deployment.

2. **Medium:** Create a feature branch, add a small change, merge it, and verify the deployment updates.

3. **Challenge:** Set up the 404.html redirect and test that all routes work on page refresh.

## Common Mistakes & How to Fix Them

- **404 on page refresh** — You need the 404.html trick or HashRouter (see section 5)
- **Blank page after deploy** — Your `base` in vite.config.js doesn't match your repo name
- **Deployment not triggering** — Check that the workflow file is on the `main` branch and in `.github/workflows/`
- **"Permission denied"** — Go to repo Settings → Actions → General → Workflow permissions → Read and write permissions

## Recap / Checklist

After today, you should be able to:

- [ ] Initialize Git and push to GitHub
- [ ] Use branches for features
- [ ] Set up GitHub Actions for automatic deployment
- [ ] Configure Vite for GitHub Pages
- [ ] Handle SPA routing on GitHub Pages
- [ ] Follow commit message conventions

## Useful Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite: Deploying to GitHub Pages](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
