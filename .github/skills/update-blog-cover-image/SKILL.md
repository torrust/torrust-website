
---
name: update-blog-cover-image
description: Updates a blog post cover image path and file with SEO-friendly naming, then regenerates metadata and validates it in dev.
---

# Update Blog Cover Image

## When to use this skill

Use this skill when asked to change, replace, rename, or fix the cover image for an existing blog post.

This skill covers the full workflow:

- Renaming the image to an SEO-friendly filename
- Updating the post metadata cover image path
- Regenerating blog metadata JSON
- Restarting dev server when needed
- Verifying the new cover is rendered

## Key files involved

- `src/routes/blog/<post-slug>/metadata.ts`
- `static/images/posts/<post-slug>/...`
- `static/blogMetadata.json` (generated)
- `scripts/generateMetadata.ts`

## Steps

### 1. Identify the post slug and current metadata

Open the target post metadata file:

```bash
cat src/routes/blog/<post-slug>/metadata.ts
```

Confirm current `coverImage` value.

### 2. Place or rename the image in the post images folder

Use a descriptive, lowercase, kebab-case filename.

Good example:

```text
one-core-packet-processing-bottleneck-cover.webp
```

Rename if needed:

```bash
mv "static/images/posts/<post-slug>/<old name>.webp" \
   "static/images/posts/<post-slug>/<seo-friendly-name>.webp"
```

### 3. Update `coverImage` in metadata

Edit `src/routes/blog/<post-slug>/metadata.ts` so `coverImage` points to the new path:

```ts
coverImage: '/images/posts/<post-slug>/<seo-friendly-name>.webp';
```

### 4. Regenerate static metadata

The website reads blog metadata from `static/blogMetadata.json` at runtime.
After updating `metadata.ts`, regenerate:

```bash
npx tsx scripts/generateMetadata.ts
```

If this step is skipped, the old cover can keep appearing.

### 5. Restart dev server if already running

The metadata loader caches results in memory, so restart dev server after regeneration.

```bash
pkill -f "vite dev" || true
npm run dev
```

### 6. Validate the result

Check both metadata and rendered output.

```bash
rg -n "<post-slug>|<seo-friendly-name>.webp" static/blogMetadata.json
curl -I http://localhost:5173/images/posts/<post-slug>/<seo-friendly-name>.webp
curl -s http://localhost:5173/blog/<post-slug> | rg "<seo-friendly-name>.webp"
```

Expected:

- New filename appears in `static/blogMetadata.json`
- Image URL returns `200 OK`
- Blog HTML references the new filename

## Scope boundary

This skill is intentionally limited to in-repo implementation tasks for coding agents.

For standalone guidance on prompting external AI image models for blog banners, see:

- `docs/blog-cover-image-prompting.md`

## Troubleshooting

- **Still seeing old image in browser:** force refresh (`Ctrl+Shift+R`) or use an incognito window.
- **Page still references old cover:** regenerate metadata and restart dev server.
- **`Post not found` error:** run `npx tsx scripts/generateMetadata.ts` and restart dev server.

## Checklist

- [ ] Cover image file uses SEO-friendly filename
- [ ] `coverImage` in post metadata updated
- [ ] `static/blogMetadata.json` regenerated
- [ ] Dev server restarted (if previously running)
- [ ] New cover image confirmed in rendered blog page
