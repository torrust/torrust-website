---
name: add-blog-post
description: Creates a new blog post for the Torrust website. Use when asked to write, add, create, or publish a new blog post or article.
---

# Add Blog Post

## When to use this skill

Use this skill when asked to create, write, or publish a new blog post on the Torrust website.

## Directory structure

Each post lives in its own directory under `src/routes/blog/`:

```
src/routes/blog/<post-slug>/
├── metadata.ts        # Post metadata (title, date, tags, etc.)
├── +page.server.ts    # Server-side data loader (identical boilerplate for every post)
└── +page.svelte       # Post content as a Svelte component
```

## Steps

### 1. Create the post directory

```bash
mkdir src/routes/blog/<post-slug>
```

The slug must be kebab-case and must match the `slug` field in `metadata.ts`.

### 2. Create `metadata.ts`

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

### 3. Create `+page.server.ts` (copy verbatim)

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

### 4. Create `+page.svelte`

Use this template as the starting point:

```svelte
<script lang="ts">
  import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
  import Toc from '$lib/components/atoms/Toc.svelte';
  import Post from '$lib/components/organisms/Post.svelte';
  import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
  import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
  import Callout from '$lib/components/molecules/Callout.svelte';

  let { data } = $props();
  let currentPost = $derived(data.currentPost);
  let allPosts = $derived(data.allPosts);
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

  .wrapper {
    /* layout styles here */
  }
</style>
```

### 5. Add a cover image

Place the cover image at:

```
static/images/posts/<post-slug>/cover.webp
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
