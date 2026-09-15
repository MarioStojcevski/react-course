# Session 21 — Deploy Capstone with opencode

## What We're Learning Today

Today you'll deploy your capstone to GitHub Pages, using opencode to help with any debugging or scripting needs along the way.

## Prerequisites

- Sessions 01-20 completed
- Capstone project ready for deployment
- opencode installed and authenticated
- GitHub repository created

## Concepts

### 1. Pre-Deployment Checklist

Before deploying, verify:

- [ ] App builds without errors: `npm run build`
- [ ] No console.log statements left
- [ ] No hardcoded localhost URLs
- [ ] `.env` is in `.gitignore`
- [ ] All routes work in development
- [ ] `base` is set correctly in `vite.config.js`
- [ ] 404.html is in `public/` folder

### 2. Build and Test Locally

```bash
# Build for production
npm run build

# Preview the build locally
npm run preview
```

This serves your built app at `http://localhost:4173`. Test all routes before deploying.

### 3. Using opencode for Deploy Debugging

If something goes wrong during deployment, use opencode:

```
> I'm getting a 404 error on my deployed GitHub Pages site when I refresh 
> on the /about route. My repo name is "my-capstone" and I'm using Vite. 
> What's wrong?
```

### 4. Common Deployment Issues and Fixes

**Issue: Blank page after deploy**
```
> My deployed site shows a blank page. The build succeeded. 
> I'm using Vite with base: '/my-capstone/'. What could be wrong?
```

**Issue: Assets not loading**
```
> My CSS and JS files are returning 404 on GitHub Pages. 
> The URLs look like /assets/index-abc123.js but my site is at 
> https://username.github.io/my-capstone/. What's the issue?
```

**Issue: Routing breaks on refresh**
```
> When I refresh on /about, GitHub Pages returns 404. 
> I have React Router with BrowserRouter. How do I fix this?
```

### 5. GitHub Actions Workflow (Review)

If you haven't set this up yet, create `.github/workflows/deploy.yml`:

```yaml
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
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

### 6. Post-Deployment Verification

After deployment, test:

- [ ] Homepage loads correctly
- [ ] All routes work (test direct URL access)
- [ ] Page refresh works on all routes
- [ ] API calls work (no CORS issues)
- [ ] Images and assets load
- [ ] Mobile responsive
- [ ] Loading states appear
- [ ] Error states work

### 7. Custom Domain (Optional)

If you have a custom domain:

1. Add a `CNAME` file in `public/` with your domain
2. Configure DNS to point to `username.github.io`
3. Update `base` in `vite.config.js` to `'/'`
4. Enable HTTPS in repo Settings → Pages

## Step-by-Step Walkthrough

1. Build your project:
   ```bash
   npm run build
   ```

2. Test the build locally:
   ```bash
   npm run preview
   ```

3. Fix any issues using opencode:
   ```
   > My build has these warnings: [paste warnings]. Should I fix them?
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "chore: prepare for deployment"
   git push
   ```

5. Check the Actions tab on GitHub for deployment status

6. Once deployed, visit your site and test everything

7. If something is broken, use opencode:
   ```
   > My deployed site at https://username.github.io/repo/ shows a blank page. 
   > The build log says success. What should I check?
   ```

## Try It Yourself

1. **Easy:** Deploy your capstone to GitHub Pages. Verify the homepage loads.

2. **Medium:** Test all routes on the deployed site. Fix any 404 errors using opencode.

3. **Challenge:** Add a custom 404 page that matches your app's design and redirects users back to the homepage.

## Common Mistakes & How to Fix Them

- **"Build succeeded but page is blank"** — Check `base` in vite.config.js matches your repo name exactly
- **Assets return 404** — The base path is wrong. Assets are relative to base
- **Deployment takes forever** — GitHub Actions has a queue. Wait 5-10 minutes, check the Actions tab for errors
- **CORS errors on deployed site** — Your API doesn't allow requests from GitHub Pages. Use a CORS proxy or choose a different API

## Recap / Checklist

After today, you should be able to:

- [ ] Build and test your app locally before deploying
- [ ] Set up GitHub Actions for automatic deployment
- [ ] Debug deployment issues using opencode
- [ ] Verify all routes and features work on the deployed site
- [ ] Handle common deployment problems

## Useful Links

- [GitHub Pages Deployment Guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Vite Deployment Options](https://vitejs.dev/guide/static-deploy.html)
- [opencode Documentation](https://opencode.ai/docs)
