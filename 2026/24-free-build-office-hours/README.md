# Session 24 — Free Build / Office Hours

## What We're Learning Today

This is your buffer session. Use it to:
- Finish anything that ran over from previous weeks
- Get help with bugs
- Polish your capstone for Demo Day
- Work on any features you haven't completed yet

## Prerequisites

- Sessions 01-23 completed
- Capstone project deployed and mostly working

## Concepts

### 1. Priority Checklist for Demo Day

Work through these in order:

**Must have (minimum viable demo):**
- [ ] App loads without errors
- [ ] At least 2 routes that work
- [ ] Data fetched from external API
- [ ] Loading and error states handled
- [ ] Deployed and accessible on GitHub Pages

**Should have (good demo):**
- [ ] Context/global state working
- [ ] Responsive on mobile
- [ ] At least 2 tests passing
- [ ] Clean code (no console.logs, commented logic)

**Nice to have (great demo):**
- [ ] Skeleton loading states
- [ ] Keyboard accessibility
- [ ] Custom error boundary
- [ ] Dark mode toggle

### 2. Common Last-Minute Issues

**"My API stopped working"**
- Check if the API is still free and CORS-friendly
- Verify your API key (if required) is in .env
- Use opencode to debug: "My fetch to [URL] returns CORS error"

**"My routes break on GitHub Pages"**
- Verify you have the 404.html in public/
- Or switch to HashRouter (simpler, works everywhere)

**"Tests are failing"**
- Run `npm run test` and read the error messages
- Most common: query not found, async timing issue
- Use opencode: "My test fails with [error]. Here's the test code: [code]"

**"App looks broken on mobile"**
- Test with DevTools device toolbar (Ctrl+Shift+M)
- Fix viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Check for horizontal overflow: `body { overflow-x: hidden; }`

### 3. Using opencode for Final Fixes

```
> Review my MovieCard component for accessibility issues. 
> Here's the code: [paste code]
```

```
> My deployed site works on desktop but the navbar is broken on mobile. 
> Here's my Header.module.css: [paste CSS]
```

```
> I need to add a loading skeleton to my MovieList component. 
> Currently it shows nothing while loading. Here's the component: [paste code]
```

### 4. Quick Wins for Polish

**Add viewport meta tag** (if missing):
```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Add a favicon:**
```html
<!-- index.html -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

**Add a nice loading state:**
```jsx
function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
}
```

**Add an empty state:**
```jsx
function EmptyState({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <p>{message || 'Nothing to show here yet'}</p>
    </div>
  );
}
```

### 5. Time Management

If you have time left after fixing issues:

1. **Add one more feature** — but keep it simple
2. **Write one more test** — cover the most critical path
3. **Clean up your code** — remove dead code, add comments where helpful
4. **Practice your Demo Day presentation** — explain your code, not just demo it

### 6. Getting Help

If you're stuck on something specific:
1. Describe the problem clearly
2. Show what you've tried
3. Use opencode with full context
4. Ask a classmate or instructor

**Good help request:**
```
My MovieCard component doesn't re-render when the parent state changes.
I'm using React.memo. Here's the parent:
[parent code]
Here's the MovieCard:
[MovieCard code]
What am I doing wrong?
```

**Bad help request:**
```
My app is broken. Help.
```

## Step-by-Step Walkthrough

1. Review your capstone against the priority checklist (section 1)

2. Fix any "must have" items first

3. Work on "should have" items if time permits

4. Test on mobile using DevTools device toolbar

5. Run your tests and fix any failures

6. Do a final check:
   - All routes work
   - No console errors
   - Loading states display
   - Error states display

7. Commit and push any final changes

8. Prepare a 3-minute demo explanation:
   - What the app does
   - What API you used
   - What was the hardest part
   - What you'd improve with more time

## Try It Yourself

1. **Easy:** Go through the priority checklist and fix any missing "must have" items.

2. **Medium:** Add a loading skeleton to your main data view.

3. **Challenge:** Write one more test that covers the most critical user journey in your app.

## Common Mistakes & How to Fix Them

- **Trying to add too much** — Focus on making what you have work perfectly, not adding new features
- **Perfectionism** — Ship it! A working app with minor issues beats an unfinished "perfect" app
- **Not practicing the demo** — Rehearse explaining your code out loud
- **Forgetting to push** — `git push` before Demo Day!

## Recap / Checklist

After today, you should be able to:

- [ ] Complete the priority checklist for Demo Day
- [ ] Fix common last-minute issues
- [ ] Use opencode effectively for final fixes
- [ ] Prepare a concise demo explanation
- [ ] Have your capstone fully deployed and working

## Useful Links

- [Demo Day Preparation Tips](https://www.productschool.com/blog/job-search/how-to-give-a-great-demo/)

