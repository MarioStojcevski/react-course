# Session 20 — opencode: Setup & AI-Assisted Development

## What We're Learning Today

opencode is an AI pair-programming tool that helps you write, debug, and understand code faster. Today we learn how to use it responsibly — as an assistant, not a replacement for understanding.

## Prerequisites

- Sessions 01-19 completed
- Capstone project deployed
- Terminal access

## Concepts

### 1. What Is opencode?

opencode is a CLI tool that:
- Explains unfamiliar code
- Helps with boilerplate and scaffolding
- Debugs errors by analyzing stack traces
- Assists with refactoring
- Generates tests

**It's not:** a magic button that writes your app for you. You still need to understand every line of code it generates.

### 2. Installing opencode

```bash
# Option 1: Curl install (Mac/Linux)
curl -fsSL https://opencode.ai/install | bash

# Option 2: npm install (all platforms)
npm i -g opencode-ai
```

After installation, authenticate:
```bash
opencode auth
```

### 3. TUI Basics — The Interface

```bash
# Start opencode in your project
opencode
```

**Key concepts:**
- **TUI (Terminal User Interface)** — runs in your terminal, not a browser
- **Conversation** — you type messages, opencode responds
- **Context** — opencode reads your project files to understand your code

### 4. Build vs Plan Mode

**Plan mode** — opencode thinks and plans before acting:
```
> How should I structure the authentication feature?
```

**Build mode** — opencode writes code:
```
> Create a login form component with email and password fields
```

### 5. The Golden Rule: Diff Review Is Mandatory

**NEVER accept code without reading it.** Every time opencode suggests changes:

1. Read the diff carefully
2. Understand what each change does
3. Ask questions if something is unclear
4. Only then accept the changes

```bash
# opencode shows you a diff before applying changes
# READ IT. UNDERSTAND IT. THEN ACCEPT.
```

### 6. Where opencode Helps Most

| Use Case | Example Prompt |
|----------|----------------|
| **Boilerplate** | "Create a React component with a form that has name and email fields" |
| **Debugging** | "I'm getting this error: [paste error]. What's wrong?" |
| **Explaining code** | "What does this useEffect hook do?" |
| **Refactoring** | "Simplify this component by extracting the form into a custom hook" |
| **Stack traces** | "Here's my error stack trace: [paste]. What's the root cause?" |

### 7. Where You Still Need to Understand

| Area | Why |
|------|-----|
| **Architecture decisions** | opencode can suggest, but you choose what fits your project |
| **Business logic** | opencode doesn't know your requirements |
| **Performance trade-offs** | You need to understand what you're optimizing |
| **Security** | Never trust AI with authentication, secrets, or data validation without review |

### 8. Effective Prompting

**Bad prompt:**
```
> Make my app better
```

**Good prompt:**
```
> This MovieCard component re-renders every time the parent state changes, 
> even when the movie data hasn't changed. How can I optimize it using React.memo?
```

**Better prompt (with context):**
```
> In src/components/MovieCard.jsx, the component receives `movie` and `onSelect` 
> props. The parent re-renders when search input changes. How can I prevent 
> unnecessary re-renders of MovieCard when the movie data hasn't changed?
```

### 9. Workflow: Using opencode in Practice

```
1.遇到 a problem or need
2. Describe it clearly to opencode
3. Read the suggested solution
4. Understand each line of code
5. Apply changes (if they make sense)
6. Test that everything still works
7. Commit with a meaningful message
```

### 10. Common opencode Workflows

**Explain unfamiliar code:**
```
> What does the useCallback hook do in this component?
```

**Debug an error:**
```
> I'm seeing "Cannot read property of undefined" in this line:
> const title = movie.title;
> The movie prop might be null. How should I handle this?
```

**Refactor:**
```
> This component is 200 lines long. How can I break it into smaller components?
```

**Write tests:**
```
> Write tests for the useFetch hook that covers loading, success, and error states
```

## Step-by-Step Walkthrough

1. Install opencode:
   ```bash
   npm i -g opencode-ai
   ```

2. Authenticate:
   ```bash
   opencode auth
   ```

3. Navigate to your capstone project:
   ```bash
   cd my-capstone
   ```

4. Start opencode:
   ```bash
   opencode
   ```

5. Try explaining a component:
   ```
   > Explain what this component does and how it works
   ```

6. Try debugging:
   ```
   > What could cause a "Failed to fetch" error in my API calls?
   ```

7. Try refactoring:
   ```
   > How can I extract the search logic from this component into a custom hook?
   ```

## Try It Yourself

1. **Easy:** Ask opencode to explain any component in your project. Verify its explanation matches your understanding.

2. **Medium:** Give opencode a stack trace from a bug in your project. Use its suggestion to fix the issue.

3. **Challenge:** Ask opencode to create a custom hook from duplicated logic in your components. Review the diff carefully before accepting.

## Common Mistakes & How to Fix Them

- **Blindly accepting code** — ALWAYS read the diff. If you don't understand it, ask opencode to explain
- **Using opencode for architecture** — opencode can suggest patterns, but you decide what fits your project
- **Not testing after changes** — Always run your app after applying opencode's suggestions
- **Vague prompts** — Be specific about what you want. Include file names, error messages, and context

## Recap / Checklist

After today, you should be able to:

- [ ] Install and authenticate opencode
- [ ] Navigate the TUI interface
- [ ] Use Plan and Build modes appropriately
- [ ] Write effective prompts with context
- [ ] Review diffs before accepting changes
- [ ] Know when to use opencode vs when to think for yourself

## Useful Links

- [opencode Documentation](https://opencode.ai/docs)
- [opencode GitHub](https://github.com/anomalyco/opencode)
- [Effective Prompting Guide](https://www.promptingguide.ai/)
