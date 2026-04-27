---
name: add-blog-post
description: Creates a new blog post for the Torrust website. Use when asked to write, add, create, or publish a new blog post or article.
---

# Add Blog Post

## When to use this skill

Use this skill when asked to create, write, or publish a new blog post on the Torrust website.

Before implementation starts, a GitHub issue must exist for the article and you must create a branch from that issue using the [create-issue-branch](../create-issue-branch/SKILL.md) skill.

## Directory structure

Each post lives in its own directory under `src/routes/blog/`:

```
src/routes/blog/<post-slug>/
├── metadata.ts        # Post metadata (title, date, tags, etc.)
├── +page.server.ts    # Server-side data loader (identical boilerplate for every post)
└── +page.svelte       # Post content as a Svelte component
```

## Steps

### 1. Create and switch to the issue branch (required)

Before creating any blog files, create a branch that starts with the issue number:

```bash
git checkout -b <issue-number>-<short-description>
```

Example:

```bash
git checkout -b 42-add-nf-conntrack-overflow-article
```

This ensures the blog post work is traceable to the issue from the start.

### 2. Create the post directory

```bash
mkdir src/routes/blog/<post-slug>
```

The slug must be kebab-case and must match the `slug` field in `metadata.ts`.

### 3. Create `metadata.ts`

```typescript
export const metadata = {
  title: 'Post Title',
  slug: 'post-slug', // must match the directory name exactly
  contributor: 'Author Name',
  contributorSlug: 'author-slug', // matches a directory under src/routes/contributor/
  date: '2024-01-15T12:00:00.000Z', // ISO 8601 format
  coverImage: '/images/posts/post-slug/cover.webp',
  excerpt: 'Brief description shown in listings and used for SEO.',
  tags: ['Rust', 'BitTorrent'] // title-case tags
};
```

### 4. Create `+page.server.ts` (copy verbatim)

This boilerplate is identical for every post — never modify it:

```typescript
import { getMetadata } from '$lib/data/metadata';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const slug = url.pathname.split('/').filter(Boolean).pop();
  if (!slug) throw new Error('Slug could not be determined.');

  const metadata = await getMetadata();
  const currentPost = metadata.find((post) => post.slug === slug);

  if (!currentPost) throw new Error(`Post not found: ${slug}`);

  return { currentPost, allPosts: metadata };
};
```

### 5. Create `+page.svelte`

Use this template as the starting point. **Copy it exactly** — do not reorder the script block or change the style section.

> **Critical:** In the `<script>` block, `$props()` and `$derived()` must come **before** the imports. Reversing the order causes a Svelte compile error.

> **Critical:** Scss breakpoint mixins are `bp.for-desktop-up`, `bp.for-tablet-landscape-up`, and `bp.for-phone-only`. Do **not** use `bp.md`, `bp.lg`, or any other names — they do not exist and will cause a Sass compile error.

```svelte
<script lang="ts">
  let { data } = $props();
  let currentPost = $derived(data.currentPost);
  let allPosts = $derived(data.allPosts);
  import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
  import Toc from '$lib/components/atoms/Toc.svelte';
  import Post from '$lib/components/organisms/Post.svelte';
  import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
  import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
  import Callout from '$lib/components/molecules/Callout.svelte';
</script>

<Post
  title={currentPost.title}
  slug={currentPost.slug}
  coverImage={currentPost.coverImage}
  date={currentPost.date}
  tags={currentPost.tags}
  excerpt={currentPost.excerpt}
  contributor={currentPost.contributor}
  contributorSlug={currentPost.contributorSlug}
>
  <PagesWrapper>
    <div class="wrapper">
      <Toc class="toc" />
      <div id="toc-contents" class="content-preview">
        <!-- Post content goes here -->
        <h2 id="introduction">Introduction</h2>
        <p>Your intro paragraph...</p>
      </div>
    </div>
  </PagesWrapper>
  <PrevNextPost currentPage={currentPost.slug} {allPosts} />
  <div class="related-posts-container">
    <h2>Related Posts:</h2>
    <div class="grid">
      {#each data.allPosts.slice(0, 3) as post}
        <a href="/blog/{post.slug}">
          <BlogPreview post_data={post} />
        </a>
      {/each}
    </div>
  </div>
</Post>

<style lang="scss">
  @use '$lib/scss/breakpoints.scss' as bp;

  /* ── Layout ──────────────────────────────────────────── */

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    position: relative;
    max-width: 1150px;
  }

  .content-preview {
    flex: 1;
    word-break: keep-all;
    padding-top: 2rem;
  }

  /* ── Typography ──────────────────────────────────────── */

  h2 {
    font-size: 1.8rem;
    font-weight: bold;
  }

  h2:not(:first-of-type) {
    padding-top: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    padding-top: 1.25rem;
  }

  h4 {
    font-size: 1.25rem;
    font-weight: bold;
    padding-top: 1rem;
  }

  p {
    font-size: 1rem;
    padding-top: 1rem;
    color: rgba(245, 245, 245, 0.8);
    word-break: keep-all;
  }

  a {
    word-break: keep-all;
    color: rgba(254, 13, 0, 1);
  }

  ul,
  ol {
    display: flex;
    flex-direction: column;
    list-style-type: disc;
    margin: 0;
    padding-left: 1.5rem;
    word-break: keep-all;
  }

  ol {
    list-style-type: decimal;
  }

  ul li,
  ol li {
    margin: 0.25rem 0;
    word-break: keep-all;
  }

  blockquote {
    border-left: 4px solid rgba(254, 13, 0, 0.6);
    padding: 0.5rem 1rem;
    margin: 1rem 0;
    color: rgba(245, 245, 245, 0.7);
    font-style: italic;
  }

  code {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1rem 0;

    code {
      background: none;
      padding: 0;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  th,
  td {
    padding: 0.6rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    text-align: left;
    color: rgba(245, 245, 245, 0.8);
  }

  th {
    background-color: rgba(0, 0, 0, 0.3);
    font-weight: 600;
  }

  .content-preview > p,
  .content-preview > ul,
  .content-preview > ol,
  .content-preview > h2,
  .content-preview > h3,
  .content-preview > h4 {
    margin-bottom: 1rem;
  }

  /* ── Related posts ───────────────────────────────────── */

  .related-posts-container {
    display: flex;
    flex-direction: column;
    color: rgba(245, 245, 245, 0.96);
    margin: 0 auto;
    text-align: center;
    padding-top: 2rem;

    @include bp.for-desktop-up {
      max-width: 1176px;
    }
  }

  .grid {
    padding-top: 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
    padding-inline: 2.5rem;

    @include bp.for-phone-only {
      grid-template-columns: 1fr;
    }

    @include bp.for-tablet-landscape-up {
      grid-template-columns: 1fr 1fr;
    }

    @include bp.for-desktop-up {
      grid-template-columns: 1fr 1fr 1fr;
      padding-inline: 0;
    }
  }

  /* ── Responsive wrapper + TOC ────────────────────────── */

  @include bp.for-desktop-up {
    .wrapper {
      flex-direction: row;
      gap: 4rem;
    }

    .wrapper :global(.toc) {
      position: sticky;
      top: 4rem;
      height: min-content;
    }

    .content-preview {
      overflow-y: auto;
      padding-top: 0rem;
    }
  }
</style>
```

#### Valid Sass breakpoint mixins

The only mixin names defined in `$lib/scss/_breakpoints.scss` are:

| Mixin                                   | Applies to                          |
| --------------------------------------- | ----------------------------------- |
| `@include bp.for-iphone-se`             | iPhone SE and similar small screens |
| `@include bp.for-phone-only`            | Small phones only                   |
| `@include bp.for-tablet-portrait-up`    | Tablet portrait and above           |
| `@include bp.for-tablet-portrait-down`  | Below tablet portrait               |
| `@include bp.for-tablet-landscape-up`   | Tablet landscape and above          |
| `@include bp.for-tablet-landscape-down` | Below tablet landscape              |
| `@include bp.for-desktop-up`            | Desktop and above                   |

Never invent names like `bp.md`, `bp.lg`, `bp.sm` — they will cause a Sass compile error and a 500 page load error.

### 5. Add a cover image

Place the cover image under `static/images/posts/<post-slug>/`. Use an **SEO-friendly filename** — a descriptive kebab-case name that reflects the post topic, not a generic name like `cover.webp`:

```
static/images/posts/<post-slug>/descriptive-kebab-case-name.webp
```

For example, for a post about submitting trackers to newTrackon:

```
static/images/posts/submitting-trackers-to-newtrackon/submitting-bittorrent-tracker-to-newtrackon.webp
```

Update `coverImage` in `metadata.ts` to match the exact filename you chose:

```typescript
coverImage: '/images/posts/<post-slug>/descriptive-kebab-case-name.webp',
```

- Preferred format: WebP
- Additional post images go in the same folder
- Reference images in content as `/images/posts/<post-slug>/filename.ext`
- Use `<Image src="..." alt="..." />` instead of `<img />` for automatic WebP/AVIF optimisation

### 6. Regenerate blog metadata

`static/blogMetadata.json` drives the blog listing page and search. Run this after adding or modifying any post:

```bash
npx tsx scripts/generateMetadata.ts
```

Without this step the new post will **not** appear at `/blog`.

### 7. Verify and lint

```bash
npm run dev          # check the post at http://localhost:5173/blog/<post-slug>
npm run check        # TypeScript + Svelte type checking
npm run lint         # Prettier + ESLint
```

## Content guidelines

### Headings and Table of Contents

`<Toc />` auto-generates a table of contents from `<h2>` and `<h3>` elements inside the `id="toc-contents"` div. Every heading **must** have a matching `id` attribute:

```svelte
<h2 id="my-section">My Section</h2><h3 id="my-subsection">My Subsection</h3>
```

### Available content components

| Component     | Import                                       | Usage                                                                     |
| ------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| `<Callout>`   | `$lib/components/molecules/Callout.svelte`   | `<Callout type="info">...</Callout>` (types: `info`, `warning`, `danger`) |
| `<CodeBlock>` | `$lib/components/molecules/CodeBlock.svelte` | Fenced code with syntax highlighting                                      |
| `<Image>`     | `$lib/components/atoms/Image.svelte`         | Optimised images (preferred over `<img>`)                                 |

## Reference

Look at `src/routes/blog/vortex-rust-bittorrent-client-review/` as a complete reference implementation.
