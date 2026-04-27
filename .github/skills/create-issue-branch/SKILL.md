---
name: create-issue-branch
description: Creates a new git branch for a GitHub issue following naming conventions with issue number as prefix.
---

# Create Issue Branch

## When to use this skill

Use this skill when asked to create a new git branch for a GitHub issue, start work on an issue, or check out a new feature/fix branch tied to an issue.

## Branch naming convention

Branches must follow this pattern:

```
<issue-number>-<short-description>
```

- **`<issue-number>`** — the GitHub issue number (integer, no leading zeros)
- **`<short-description>`** — kebab-case summary of the work (3–6 words, no punctuation)

### Examples

| Issue | Description               | Branch name                     |
| ----- | ------------------------- | ------------------------------- |
| #42   | Add dark mode toggle      | `42-add-dark-mode-toggle`       |
| #101  | Header overlaps on mobile | `101-header-overlaps-on-mobile` |
| #7    | Update contributor guide  | `7-update-contributor-guide`    |
| #55   | Upgrade SvelteKit to v2   | `55-upgrade-sveltekit-v2`       |
| #88   | Extract search utils      | `88-extract-search-utils`       |

### Rules

- Always prefix with the **issue number** so the branch is traceable to the GitHub issue.
- Use **lowercase only** — no uppercase letters.
- Use **hyphens** (`-`) to separate words inside the description — never underscores or spaces.
- Keep the description **short and meaningful** (≤ 50 characters total for the whole branch name is ideal).
- Do **not** include `#` in the branch name.
- Do **not** include the issue title verbatim if it is long — shorten it.

## Steps

### 1. Identify the issue number

Before creating the branch, confirm:

- The GitHub issue number (e.g., `42`)
- A short kebab-case description of the change

### 2. Ensure the base branch is up to date

```bash
git checkout develop
git pull origin develop
```

> The default base branch for this project is `develop` (not `main`).

### 3. Create and switch to the new branch

```bash
git checkout -b <issue-number>-<short-description>
```

Example:

```bash
git checkout -b 42-add-dark-mode-toggle
```

### 4. Verify the branch was created

```bash
git branch --show-current
```

The output should match the pattern exactly.

### 5. Push the branch to the remote (optional — do only when ready to open a PR)

```bash
git push -u origin <branch-name>
```

> Do **not** push an empty branch. Make at least one commit first.

## Commit message convention

Once on the branch, commits should follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

Example:

```
feat(ui): add dark mode toggle to header
```

Reference the issue in the commit body or footer when relevant:

```
feat(ui): add dark mode toggle to header

Closes #42
```

## Checklist

- [ ] Branch name starts with the issue number
- [ ] Description is kebab-case, lowercase, and concise
- [ ] Branch was created from an up-to-date `develop` base
- [ ] Branch name verified with `git branch --show-current`
