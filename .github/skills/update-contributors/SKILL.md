---
name: update-contributors
description: Updates the contributors list on the Torrust website homepage. Use when asked to refresh, update, or sync the contributors list from the Torrust GitHub org.
---

# Update Contributors

## When to use this skill

Use this skill when asked to update, refresh, or sync the contributors shown on the Torrust website homepage.

## Background

The contributors displayed on the homepage are maintained in a static list in `src/lib/constants/constants.ts`. A local script fetches contributors from the GitHub API and updates that file.

**Why static?** The GitHub API rate-limits anonymous requests to 60/hour, which would break the live site. The list is updated manually instead.

## Steps

### 1. Obtain a GitHub fine-grained personal access token (required for Torrust org)

Classic tokens are **not** accepted by the Torrust organization.

1. Go to **GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Click **Generate new token** and configure it:
   - **Token name:** "Torrust Contributors Script"
   - **Expiration:** 90 days (recommended)
   - **Resource owner:** Select `torrust`
   - **Repository access:** Public Repositories (read-only)
   - **Permissions:**
     - Repository permissions → Metadata: Read-only (set automatically)
     - Organization permissions → Members: Read-only
3. Click **Generate token** and copy it immediately.

### 2. Run the update script

```bash
# With a GitHub token (recommended — 5,000 requests/hour)
GITHUB_TOKEN=your_token_here npm run update-contributors

# Without a token (anonymous — 60 requests/hour, may hit rate limits)
npm run update-contributors
```

### 3. What the script does

1. Fetches all repositories from the Torrust GitHub organization
2. Fetches contributors from each repository
3. Deduplicates contributors by username
4. Updates `defaultContributorsList` in `src/lib/constants/constants.ts`

### 4. Verify and commit

```bash
npm run dev         # check the homepage at http://localhost:5173/
npm run lint        # ensure code style
git diff src/lib/constants/constants.ts  # review the changes
```

Commit with a message like `chore: update contributors list`.
