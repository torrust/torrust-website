# Blog Cover Image Prompting

This document explains how to prompt external generative AI image models to create cover images for Torrust blog posts.

Use this as independent author documentation, separate from coding-agent skills.

## Required banner constraints

- Size: 1774 x 887
- Keep top text-safe band: at least 200 px with no text
- Keep bottom text-safe band: at least 200 px with no text

These safe bands help the website layout keep title and overlays readable.

## Recommended reusable prompt template

```text
I want you to create a cover image for the following Torrust blog post.
- The size must be 1774 x 887.
- Leave two horizontal bands at the top and bottom of at least 200 px with no text.

Article:
<paste full article here>
```

## After image generation

1. Export as webp when possible.
2. Rename to an SEO-friendly filename in kebab-case.
3. Place under "static/images/posts/post-slug/".
4. Update coverImage in "src/routes/blog/post-slug/metadata.ts".
5. Regenerate metadata with: npx tsx scripts/generateMetadata.ts.
6. Restart dev server if already running.
7. Validate that the new image appears in the rendered blog page.
