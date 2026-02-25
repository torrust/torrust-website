---
name: deploy-site
description: Deploys the Torrust website to GitHub Pages. Use when asked to deploy, publish, or release the site, or to set up the deployment workflow.
---

# Deploy Site

## When to use this skill

Use this skill when asked to deploy the Torrust website to production (GitHub Pages).

## Automatic deployment (recommended)

Deployment is triggered automatically when you push to the `develop` branch:

1. The `.github/workflows/deploy.yml` workflow runs
2. Installs dependencies and runs `npm run build`
3. Creates a `.nojekyll` file in `build/`
4. Uploads the build artifact and deploys to GitHub Pages

The live site is available at <https://torrust.com/>.

## Manual deployment

```bash
npm run build && npm run deploy
```

## Requirements

- GitHub Pages must be enabled in the repository settings
- A `CNAME` file must exist at the repo root for the custom domain
- The workflow requires `pages: write` and `id-token: write` permissions

## Verify the deployment

After deploying, check <https://torrust.com/> to confirm the changes are live.
