# AGENTS.md

This file provides context and instructions for AI coding agents working on the Torrust website.

## Skills

Common tasks are documented as [Agent Skills](https://agentskills.io/) in `.github/skills/`. When asked to perform one of these tasks, load the relevant skill for step-by-step instructions:

- [**add-blog-post**](.github/skills/add-blog-post/SKILL.md) — Create or publish a new blog post
- [**add-component**](.github/skills/add-component/SKILL.md) — Add a new Svelte UI component
- [**update-contributors**](.github/skills/update-contributors/SKILL.md) — Refresh the contributors list from the Torrust GitHub org
- [**deploy-site**](.github/skills/deploy-site/SKILL.md) — Deploy the site to GitHub Pages
- [**run-checks**](.github/skills/run-checks/SKILL.md) — Run the full quality check suite before committing
- [**dev-debug**](.github/skills/dev-debug/SKILL.md) — Debug and troubleshoot page changes using the Vite dev server

> **Authoring note:** skill `description` fields must be ≤ 160 characters (the Front Matter CMS enforces this as an SEO limit).

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

Blog posts live in `src/routes/blog/[post-slug]/`. See [`.github/skills/add-blog-post/SKILL.md`](.github/skills/add-blog-post/SKILL.md) for the full guide on creating a post, including file templates and metadata regeneration.

## Managing Contributors List

The contributors displayed on the homepage are maintained in a static list in `src/lib/constants/constants.ts`. See [`.github/skills/update-contributors/SKILL.md`](.github/skills/update-contributors/SKILL.md) for the full guide on refreshing the list, including token setup.

## Image Optimization

- Use the `<Image />` component instead of `<img />` for automatic optimization
- Images are converted to WebP and AVIF formats during build
- Source images can be PNG, JPG, etc. (optimization happens at build time)

## Testing Instructions

See [`.github/skills/run-checks/SKILL.md`](.github/skills/run-checks/SKILL.md) for the full checklist to run before committing.

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

See [`.github/skills/deploy-site/SKILL.md`](.github/skills/deploy-site/SKILL.md) for automatic and manual deployment instructions.

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

See [`.github/skills/add-blog-post/SKILL.md`](.github/skills/add-blog-post/SKILL.md).

### Adding a new component

See [`.github/skills/add-component/SKILL.md`](.github/skills/add-component/SKILL.md).

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
