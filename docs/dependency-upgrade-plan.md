# Dependency Upgrade Plan

This document tracks the step-by-step plan for upgrading the Torrust website dependencies,
starting with the compatible patch/minor updates already applied and then tackling each
remaining major-version bump in a dedicated branch and PR.

## Status Overview

| Package                                  | Current | Target       | Status  | Branch                              |
| ---------------------------------------- | ------- | ------------ | ------- | ----------------------------------- |
| Patch / minor updates (all except below) | various | latest minor | ✅ Done | `chore/update-dependencies-2026-04` |
| `vite`                                   | 8.x     | 8.x          | ✅ Done | `chore/upgrade-vite-8`              |
| `@sveltejs/vite-plugin-svelte`           | 7.x     | 7.x          | ✅ Done | `chore/upgrade-vite-8`              |
| `svelte-sitemap`                         | 3.x     | 3.x          | ✅ Done | `chore/upgrade-svelte-sitemap-3`    |
| `typescript`                             | 6.x     | 6.x          | ✅ Done | `chore/upgrade-typescript-6`        |
| `@types/node`                            | 25.x    | 25.x         | ✅ Done | `chore/upgrade-typescript-6`        |

---

## Phase 0 — Patch & minor updates ✅

**Branch:** `chore/update-dependencies-2026-04`  
**PR:** open against `develop`

All non-breaking updates applied. All checks pass (`format`, `lint`, `check`, `build`).

---

## Phase 1 — vite 7 → 8 + @sveltejs/vite-plugin-svelte 6 → 7 ✅

These two must be bumped together: `@sveltejs/vite-plugin-svelte` v7 requires `vite ^8`.

**Branch:** `chore/upgrade-vite-8`

**Result:** completed successfully. `npm run lint`, `npm run check`, and `npm run build` pass.

**Steps:**

1. Create branch `chore/upgrade-vite-8`
2. Bump versions:
   ```bash
   npm install -D vite@^8 @sveltejs/vite-plugin-svelte@^7
   ```
3. Check `vite.config.ts` for any removed/renamed Vite 8 APIs  
   (see [Vite 8 migration guide](https://vite.dev/guide/migration))
4. Check `svelte.config.js` for vite-plugin-svelte v7 breaking changes  
   (see [@sveltejs/vite-plugin-svelte changelog](https://github.com/sveltejs/vite-plugin-svelte/blob/main/packages/vite-plugin-svelte/CHANGELOG.md))
5. Run `npm run check && npm run lint && npm run build`
6. Fix any issues
7. Commit and open PR

**Known risks / things to verify:**

- Vite 8 dropped `server.force` option — check `vite.config.ts`
- `vite-plugin-imagemin` peer compatibility with Vite 8 (may need upgrade or workaround)
- HMR and SSR behaviour changes in Vite 8

---

## Phase 2 — svelte-sitemap 2 → 3 ✅

This was a smaller, isolated change.

**Branch:** `chore/upgrade-svelte-sitemap-3`

**Result:** completed successfully. `npm run lint`, `npm run check`, and `npm run build` pass, and `build/sitemap.xml` is generated.

**Steps:**

1. Create branch `chore/upgrade-svelte-sitemap-3`
2. Bump version:
   ```bash
   npm install -D svelte-sitemap@^3
   ```
3. Read the [svelte-sitemap v3 changelog](https://github.com/bartholomej/svelte-sitemap/blob/master/CHANGELOG.md) for breaking changes
4. Update `package.json` `postbuild` script or any sitemap configuration if the CLI interface changed
5. Run `npm run build` and verify `build/sitemap.xml` is generated correctly
6. Commit and open PR

**Known risks / things to verify:**

- CLI argument changes in v3
- Output format differences in the generated sitemap
- v3 suggests moving from CLI options to a config file (not required for current setup)

---

## Phase 3 — TypeScript 5 → 6 ✅

TypeScript 6 is a significant release with stricter type checking.

**Branch:** `chore/upgrade-typescript-6`

**Result:** completed successfully. `npm run lint`, `npm run check`, and `npm run build` pass with no additional code changes required.

**Steps:**

1. Create branch `chore/upgrade-typescript-6`
2. Bump version:
   ```bash
   npm install -D typescript@^6 @types/node@^25
   ```
3. Read the [TypeScript 6 breaking changes](https://devblogs.microsoft.com/typescript/)
4. Run `npm run check` and fix all new type errors
5. Update `tsconfig.json` if needed (new `target`/`lib` defaults, removed options)
6. Run full suite: `npm run check && npm run lint && npm run build`
7. Commit and open PR

**Known risks / things to verify:**

- Stricter type narrowing may reveal latent type errors
- `verbatimModuleSyntax` may become default — check `tsconfig.json`
- `@typescript-eslint` packages may need re-aligning with TS 6 types
- `@types/node` v25 may introduce typing changes for used Node APIs

---

## General checklist for each phase

Before opening each PR, run the full quality suite:

```bash
npm run format
npm run lint
npm run check
npm run build
npm run preview   # manual visual verification
```

Check for `npm audit` issues introduced by the new versions.
