````skill
---
name: dev-debug
description: Debug and troubleshoot website changes using the Vite dev server. Use when a page fails to load, shows a 500 error, or looks broken after editing.
---

# Dev Debug

## When to use this skill

Use this skill whenever you are making changes to pages, components, or styles and need to verify the result in the browser — especially before running the full pre-commit check suite.

This iterative loop catches runtime errors (Sass compile errors, Svelte component errors, missing imports, broken markup) that `npm run check` and `npm run lint` do **not** catch.

## The core pattern

1. Start the dev server **once** in a background terminal
2. Edit files
3. After each edit, poll the dev server terminal for errors and check the HTTP status of the affected page
4. Fix any errors before moving on
5. Only run the full `run-checks` suite when all pages look correct

---

## Steps

### 1. Start the dev server in the background

Start `npm run dev` as a background process so you can continue making edits while it runs:

```bash
npm run dev
```

> Run this as a **background terminal** (not a blocking foreground command). The server will stay running across all your edits. Note the port it binds to — usually `5173`, but if that is in use it will try `5174`, `5175`, etc. Check the startup output.

### 2. After each file edit, check for errors

**Check the dev server terminal output** for Vite SSR errors printed after your change was hot-reloaded:

Look for lines like:

```
[vite] (ssr) Error when evaluating SSR module /src/routes/...
[vite] (ssr) page reload src/routes/...   ← good, means no error
[500] GET /blog/your-post-slug            ← bad, page failed
[200] GET /blog/your-post-slug            ← good
```

**Check the HTTP status** of the page you changed:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/blog/your-post-slug
```

- `200` — page loaded correctly
- `500` — Vite/Svelte/Sass error; read the dev server terminal for the full message

### 3. Read the error and fix it

Vite prints the full error including file path and line number. Common errors:

#### Sass undefined mixin

```
[sass] Undefined mixin.
  @include bp.md {   ← wrong name
```

**Fix:** Use only valid mixin names from `$lib/scss/_breakpoints.scss`:
`bp.for-phone-only`, `bp.for-tablet-portrait-up`, `bp.for-tablet-portrait-down`,
`bp.for-tablet-landscape-up`, `bp.for-tablet-landscape-down`, `bp.for-desktop-up`.
Never invent names like `bp.md`, `bp.lg`, `bp.sm`.

#### Svelte compile error / missing import

```
Error: 'SomeComponent' is not defined
```

**Fix:** Add the missing import in the `<script>` block.

#### `$props()` / `$derived()` order error

In Svelte 5 rune-mode files, `$props()` and `$derived()` must come **before** import statements:

```svelte
<script lang="ts">
  let { data } = $props();          // ← must be first
  let currentPost = $derived(...);  // ← before imports
  import Foo from '...';
</script>
```

#### Missing module / wrong import path

```
Cannot find module '$lib/components/...'
```

**Fix:** Check the exact component path with:

```bash
find src/lib/components -name "ComponentName.svelte"
```

#### Metadata not found / post returns 404

The `+page.server.ts` loader throws if the slug is not in `static/blogMetadata.json`. After adding or renaming a post, regenerate metadata:

```bash
npx tsx scripts/generateMetadata.ts
```

Then reload the page.

### 4. Confirm the fix

After each fix, re-check:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/blog/your-post-slug
```

Expect `200`. Check the dev server output again — no new `[vite] (ssr) Error` lines should appear after the most recent page reload.

### 5. Run the full check suite when done

Once all pages load correctly, run the full quality suite before committing:

```bash
npm run check   # TypeScript + Svelte type checking
npm run lint    # Prettier format check + ESLint
```

See the `run-checks` skill for the complete pre-commit checklist.

---

## Quick reference

| Symptom | Likely cause | Fix |
|---|---|---|
| HTTP 500 on a page | Sass/Svelte compile error | Read dev server terminal for details |
| `Undefined mixin` | Wrong breakpoint mixin name | Use `bp.for-desktop-up` etc. |
| `is not defined` | Missing import | Add import in `<script>` block |
| Page loads but looks broken | Missing style rules | Compare with a working post's `<style>` block |
| Post returns 404 | Metadata not regenerated | Run `npx tsx scripts/generateMetadata.ts` |
| Infinite Prettier failures | File not formatted | Run `npm run format` then retry commit |

````
