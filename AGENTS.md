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

- Blog posts are in `src/routes/blog/[post-slug]/` directories
- Each post has:
  - `+page.svelte` - Main content (MDsveX)
  - `+page.server.ts` - Server-side data loading
  - `metadata.ts` - Post metadata export

**Front Matter (YAML):**
Required fields:

```yaml
---
title: 'Post Title'
date: '2024-01-15'
excerpt: 'Brief description for listings and SEO'
categories: ['Development', 'BitTorrent']
cover_image: '/images/posts/post-slug/cover.webp'
author: 'Author Name'
---
```

Optional fields:

- `updated`: "2024-01-20" - Last update date
- `tags`: ["rust", "tracker"] - Additional tags

**Workflow:**

1. Use Front Matter VS Code extension for easier management
2. Create post directory: `src/routes/blog/my-new-post/`
3. Add front matter and content
4. Place images in `static/images/posts/my-new-post/`
5. Reference images: `/images/posts/my-new-post/image.png`
6. Use `<Image />` component for automatic optimization
7. Run `npm run dev` to preview
8. Metadata is auto-generated during build

**Supported Content:**

- Standard Markdown syntax
- Svelte components inline
- Code blocks with syntax highlighting
- Images with automatic optimization
- Links with automatic external link handling

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

1. Create a new `.md` file in `src/routes/blog/`
2. Add required front matter (title, date, excerpt, etc.)
3. Write content using Markdown and Svelte components as needed
4. Add cover image to `static/images/blog/`
5. Test locally with `npm run dev`

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
