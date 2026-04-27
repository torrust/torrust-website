---
name: create-pull-request
description: Opens a GitHub Pull Request from the current branch, linking it to the related issue when the branch name starts with an issue number.
---

# Create Pull Request

## When to use this skill

Use this skill when asked to open, create, or submit a Pull Request (PR) for the current branch.

## Prerequisites

- All changes are committed and the branch has been pushed to the remote.
- The full quality check suite passes (see [run-checks](./../run-checks/SKILL.md)).

## Steps

### 1. Run checks before opening the PR

```bash
npm run lint
npm run check
```

Fix any errors before continuing.

### 2. Push the branch (if not already pushed)

```bash
git push -u origin $(git branch --show-current)
```

### 3. Detect the linked issue from the branch name

Check the current branch name to determine whether it is linked to a GitHub issue:

```bash
git branch --show-current
```

If the branch name starts with a number followed by a hyphen (e.g. `42-add-dark-mode-toggle`), extract the issue number:

```bash
BRANCH=$(git branch --show-current)
ISSUE=$(echo "$BRANCH" | grep -oP '^\d+')
echo $ISSUE   # prints the issue number, or nothing if not an issue branch
```

- If `$ISSUE` is non-empty → the PR **must** be linked to that issue (see step 5).
- If `$ISSUE` is empty → no automatic issue link is required.

### 4. Write the PR title and body

**Title** — follow Conventional Commits style, concise and descriptive:

```
feat: add dark mode toggle
fix: header overlaps on mobile
docs: update contributor guide
chore: upgrade SvelteKit to v2
```

**Body template:**

```markdown
## Summary

<!-- What does this PR do? One or two sentences. -->

## Changes

## <!-- Bullet list of notable changes -->

-

## Related issue

Closes #<issue-number>

## Checklist

- [ ] `npm run lint` passes
- [ ] `npm run check` passes
- [ ] Manually tested in the browser (if UI changes)
```

> If the branch is **not** linked to an issue, omit the "Related issue" section entirely.

### 5. Open the PR via GitHub CLI

```bash
gh pr create \
  --base develop \
  --title "<PR title>" \
  --body "$(cat <<'EOF'
## Summary

<summary>

## Changes

- <change 1>
- <change 2>

Closes #<issue-number>
EOF
)"
```

Or open the GitHub web UI directly:

```bash
gh pr create --web
```

> The default target branch for this project is **`develop`**, not `main`.

### 6. Verify the PR is linked to the issue

After the PR is created:

1. Open the PR on GitHub.
2. In the right sidebar under **Development**, confirm the issue is listed as linked.
3. If it is missing, add `Closes #<issue-number>` to the PR description — GitHub picks this up automatically.

Accepted closing keywords: `Closes`, `Fixes`, `Resolves` (case-insensitive).

## Checklist

- [ ] `npm run lint` and `npm run check` pass
- [ ] Branch is pushed to the remote
- [ ] PR targets `develop`
- [ ] PR title follows Conventional Commits style
- [ ] PR body includes `Closes #<issue-number>` when branch starts with an issue number
- [ ] Issue appears as linked in the GitHub sidebar after PR is created
