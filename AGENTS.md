# AGENTS.md

This file provides context and instructions for AI coding agents working on the Torrust website.

## Project Overview

The Torrust website is a static site built with SvelteKit, featuring:

- Information about the Torrust project and its BitTorrent tracker and index implementations
- Blog posts about BitTorrent technology, development guides, and project updates
- Community resources and contributor profiles
- Responsive, privacy-friendly design with no external tracking or analytics
- Image optimization with automatic WebP/AVIF conversion
- Search functionality using FlexSearch

**Tech Stack:**

- SvelteKit with @sveltejs/adapter-static
- TypeScript (strict mode enabled)
- Tailwind CSS with plugins (@tailwindcss/typography, @tailwindcss/forms, @tailwindcss/container-queries)
- MDsveX for Markdown processing with Svelte components
- Vite 6.x for bundling
- Histoire for component development and isolation
- Sass for advanced styling (variables, mixins, functions)
- Rehype plugins for enhanced HTML processing (autolink-headings, external-links, slug)
- rehype-pretty-code for syntax highlighting
- vite-plugin-imagemin for image optimization
- svelte-sitemap for sitemap generation

**Key Dependencies:**

- Svelte 5 (using runes syntax: `$state`, `$derived`, `$effect`)
- highlight.js for code syntax highlighting
- dateformat for date/time formatting
- reading-time for post reading time estimation
- FlexSearch for client-side search
- @iconify/svelte for SVG icons
- @melt-ui/svelte for accessible UI components

## Setup Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Available at http://localhost:5173/

# Build for production
npm run build

# Preview production build
npm run preview

# Open component storybook (Histoire)
npm run story:dev
```

## Code Quality Commands

```bash
# Run all checks (TypeScript + Svelte)
npm run check

# Watch mode for checks
npm run check:watch

# Format code
npm run format

# Lint code (includes Prettier check + ESLint)
npm run lint
```

**Before committing:** Always run `npm run lint` to ensure code quality standards are met.

## Code Style Guidelines

- **TypeScript:** Strict mode enabled, always type function parameters and return types
- **Formatting:** Prettier handles all formatting (single quotes, no semicolons for TypeScript/JavaScript)
- **Svelte:** Use Svelte 5 runes syntax (`$state`, `$derived`, `$effect`, etc.)
- **CSS:** Use Tailwind utility classes; custom CSS only when necessary
- **File naming:** kebab-case for files and directories

## Project Structure

```text
src/
  lib/
    components/
      atoms/          # Basic UI elements (Button, Card, Image, Tag, etc.)
      molecules/      # Composed components (BlogPostCard, Callout, CodeBlock)
      organisms/      # Complex sections (Header, Footer, Hero, Post)
      singletons/     # Unique, one-off components
    constants/        # Application constants
    data/            # Static data (features, metadata, posts)
    icons/           # SVG icon components
      socials/       # Social media icons
    scss/            # Sass stylesheets (variables, mixins, functions)
    stores/          # Svelte stores (contributorsStore)
    utils/           # Utility functions (cache, date, search, types)
  routes/
    (home)/          # Home page layout and content
    (pages)/         # Static pages (about, community, self-host, etc.)
    api/             # API endpoints (server-side)
    blog/            # Blog posts (MDsveX files) and listings
      [post-slug]/
        +page.svelte   # Post display component
        +page.server.ts # Server-side data loading
        metadata.ts    # Post metadata
    contributor/     # Contributor profile pages
    tags/            # Tag filtering pages
  app.css            # Global CSS and Tailwind directives
  app.html           # HTML template
static/
  favicons/          # Favicon files
  images/
    contributors/    # Contributor photos
    posts/           # Blog post images
  blogMetadata.json  # Generated blog metadata (created during build)
scripts/
  generateMetadata.ts # Generates blog post metadata
.github/
  workflows/
    deploy.yml       # GitHub Pages deployment
    test.yml         # CI testing workflow
```

**Component Organization:**

- **Atoms:** Basic building blocks (Button, Card, Image, Tag)
- **Molecules:** Combinations of atoms (BlogPostCard, Callout)
- **Organisms:** Complex sections (Header, Footer, Hero)
- **Singletons:** Unique components (SearchBar, ShareButton)

## Managing Blog Posts

**File Structure:**

Blog posts live in `src/routes/blog/[post-slug]/`. Each post directory contains exactly three files:

| File              | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| `metadata.ts`     | Typed post metadata (title, date, tags, etc.)                  |
| `+page.server.ts` | Server-side data loader (identical boilerplate for every post) |
| `+page.svelte`    | Post content written as a Svelte component                     |

**`metadata.ts` format:**

```typescript
export const metadata = {
  title: 'Post Title',
  slug: 'post-slug', // must match the directory name
  contributor: 'Author Name',
  contributorSlug: 'author-slug', // matches a directory under src/routes/contributor/
  date: '2024-01-15T12:00:00.000Z', // ISO 8601
  coverImage: '/images/posts/post-slug/cover.webp',
  excerpt: 'Brief description for listings and SEO.',
  tags: ['Rust', 'BitTorrent'] // title-case tags
};
```

**`+page.server.ts` boilerplate** (copy verbatim for every post):

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

**`+page.svelte` structure:**

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
        <p>...</p>
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
  /* styles here */
</style>
```

Look at an existing post (e.g. `src/routes/blog/vortex-rust-bittorrent-client-review/`) as a full reference implementation.

**Heading IDs for the Table of Contents:**

The `<Toc />` component auto-generates a table of contents from `<h2>` and `<h3>` elements inside the `id="toc-contents"` div. Every heading must have a matching `id` attribute:

```svelte
<h2 id="my-section">My Section</h2>
```

**Supported content components:**

| Component     | Import                                       | Usage                                                                     |
| ------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| `<Callout>`   | `$lib/components/molecules/Callout.svelte`   | `<Callout type="info">...</Callout>` (types: `info`, `warning`, `danger`) |
| `<CodeBlock>` | `$lib/components/molecules/CodeBlock.svelte` | Fenced code with syntax highlighting                                      |
| `<Image>`     | `$lib/components/atoms/Image.svelte`         | Optimised images (preferred over `<img>`)                                 |

**Images:**

- Place images in `static/images/posts/my-new-post/`
- Reference them as `/images/posts/my-new-post/image.png`
- Use `<Image src="..." alt="..." />` for automatic WebP/AVIF optimisation
- Cover image should be named `cover.webp` and placed in the same folder

### ⚠️ Critical: regenerate metadata during development

`static/blogMetadata.json` drives the blog listing page and search. It is generated automatically by `npm run build`, but during development you must run it manually after adding or modifying a post's `metadata.ts`:

```bash
npx tsx scripts/generateMetadata.ts
```

Without this step the new post will not appear at `/blog`.

## Managing Contributors List

The contributors displayed on the homepage are maintained in a static list in `src/lib/constants/constants.ts`.

**Why Static?**
The GitHub API has a rate limit of 60 requests/hour for anonymous users, which would cause issues for a public website. Instead, we use a local script to update the list manually.

**How to Update:**

```bash
# Update contributors list from GitHub API
npm run update-contributors

# With GitHub token for higher rate limits (REQUIRED for Torrust org)
GITHUB_TOKEN=your_token_here npm run update-contributors
```

**Creating a GitHub Token:**

The Torrust organization requires a **fine-grained personal access token** (classic tokens are not allowed).

1. Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click "Generate new token"
3. Configure the token:
   - **Token name**: "Torrust Contributors Script"
   - **Expiration**: Your preference (90 days recommended)
   - **Resource owner**: Select "torrust" from the dropdown
   - **Repository access**: "Public Repositories (read-only)"
   - **Permissions**:
     - Repository permissions → Metadata: Read-only (automatically set)
     - Organization permissions → Members: Read-only (for accessing org repos)
4. Click "Generate token" and copy it
5. Use it with: `GITHUB_TOKEN=your_token_here npm run update-contributors`

**What the Script Does:**

1. Fetches all repositories from the Torrust GitHub organization
2. Fetches contributors from each repository
3. Deduplicates contributors by username
4. Updates the `defaultContributorsList` in `src/lib/constants/constants.ts`

**Note:** Without a token, the script uses anonymous access (60 requests/hour), which may hit rate limits. With a fine-grained token, you get 5,000 requests/hour.

## Image Optimization

- Use the `<Image />` component instead of `<img />` for automatic optimization
- Images are converted to WebP and AVIF formats during build
- Source images can be PNG, JPG, etc. (optimization happens at build time)

## Testing Instructions

Currently, the project uses:

- Type checking via `npm run check`
- Linting via `npm run lint`
- Manual testing in development mode

**When making changes:**

1. Run `npm run dev` and test locally
2. Run `npm run check` to verify types
3. Run `npm run lint` to verify code style
4. Build with `npm run build` to ensure production build works
5. Test the production build with `npm run preview`

## Build Process

The build process:

1. Generates blog metadata (`tsx scripts/generateMetadata.ts`)
   - Creates `static/blogMetadata.json` with post metadata
   - Extracts front matter from blog posts
   - Calculates reading times
2. Builds static site with Vite
   - SvelteKit adapter-static generates HTML pages
   - Processes MDsveX files (Markdown with Svelte)
   - Applies Tailwind CSS
3. Optimizes images with vite-plugin-imagemin
   - Converts images to WebP and AVIF formats
   - Only when using `<Image />` component
4. Generates sitemap for SEO (`svelte-sitemap`)
   - Domain: <https://torrust.com/>
   - Includes all static pages and blog posts

Output directory: `build/`

**Build artifacts:**

- Static HTML pages
- Optimized images in WebP/AVIF
- JavaScript bundles (app, immutable chunks)
- `sitemap.xml` for search engines
- `blogMetadata.json` for search functionality

## Deployment

**GitHub Pages (Automatic):**

- Deployment triggered on push to `develop` branch
- Workflow: `.github/workflows/deploy.yml`
- Build artifact is uploaded and deployed to GitHub Pages
- URL: <https://torrust.com/> (via CNAME)

**Workflow Steps:**

1. Checkout code
2. Install dependencies with npm
3. Run build (`npm run build`)
4. Create `.nojekyll` file in `build/` directory
5. Upload artifacts to GitHub Pages
6. Deploy to production environment

**Manual Deployment:**

```bash
npm run build && npm run deploy
```

**Deployment Requirements:**

- GitHub Pages must be enabled in repository settings
- CNAME file must exist in root for custom domain
- Workflow has `pages: write` and `id-token: write` permissions

## Blog Metadata Generation

The `scripts/generateMetadata.ts` script:

- Scans all blog posts in `src/routes/blog/`
- Extracts front matter (title, date, excerpt, etc.)
- Calculates reading time for each post
- Generates `static/blogMetadata.json`
- Runs automatically during `npm run build`

**Usage:**

```bash
tsx scripts/generateMetadata.ts
```

This metadata is used for:

- Blog post listings
- Search functionality (FlexSearch)
- RSS feed generation
- SEO meta tags

## Common Tasks

### Adding a new blog post

1. Create a new directory: `src/routes/blog/my-new-post/`
2. Add `metadata.ts` with required fields (see **Managing Blog Posts** above)
3. Add `+page.server.ts` (copy boilerplate verbatim from any existing post)
4. Add `+page.svelte` with post content (use an existing post as a reference)
5. Place cover image at `static/images/posts/my-new-post/cover.webp`
6. Regenerate metadata so the post appears in the listing:

   ```bash
   npx tsx scripts/generateMetadata.ts
   ```

7. Run `npm run dev` and verify the post appears at `http://localhost:5173/blog`
8. Run `npm run check` and `npm run lint` before committing

### Adding a new component

1. Create component in `src/lib/components/`
2. Consider adding a story in `src/lib/components/*.story.svelte` for Histoire
3. Export from `src/lib/index.ts` if it should be publicly available

### Updating styles

- Modify `src/app.css` for global styles
- Update `tailwind.config.ts` for Tailwind configuration
- Most styling should be done with Tailwind utilities

## Security Considerations

- No external tracking or analytics
- No external resource loading (privacy-friendly)
- Static site generation means no server-side vulnerabilities
- Keep dependencies updated regularly

## Conventions

- **Commits:** Use conventional commits format (e.g., `feat:`, `fix:`, `docs:`, `chore:`)
- **Branches:** Use descriptive names (e.g., `feature/add-blog-post`, `fix/navigation-bug`)
- **PRs:** Provide clear description of changes and reference any related issues
