---
name: run-checks
description: Runs the full quality check suite for the Torrust website. Use before committing or opening a PR to verify types, linting, and that the build succeeds.
---

# Run Checks

## When to use this skill

Use this skill before committing changes or opening a pull request to ensure everything passes.

## Steps

Run these in order:

```bash
# 1. Test locally in dev mode
npm run dev
# Open http://localhost:5173/ and verify the changes look correct

# 2. Type check (TypeScript + Svelte)
npm run check

# 3. Lint (Prettier format check + ESLint)
npm run lint

# 4. Production build
npm run build

# 5. Preview the production build
npm run preview
# Open http://localhost:4173/ and verify again
```

## Fix common issues

- **Type errors** — fix reported TypeScript/Svelte errors, then re-run `npm run check`
- **Lint errors** — run `npm run format` to auto-fix formatting, then re-run `npm run lint`
- **Build failures** — read the Vite output carefully; usually caused by type errors or missing imports

## Quick pre-commit shortcut

If you only need to verify types and lint (no full build):

```bash
npm run check && npm run lint
```
