---
name: add-component
description: Creates a new Svelte UI component for the Torrust website. Use when asked to add, create, or build a new reusable UI component, widget, or UI element.
---

# Add Component

## When to use this skill

Use this skill when asked to create a new reusable UI component for the Torrust website.

## Component tiers

Place the new component in the correct directory based on its complexity:

| Tier          | Directory                        | Description                                             |
| ------------- | -------------------------------- | ------------------------------------------------------- |
| **Atom**      | `src/lib/components/atoms/`      | Basic building blocks: Button, Card, Image, Tag, etc.   |
| **Molecule**  | `src/lib/components/molecules/`  | Combinations of atoms: BlogPostCard, Callout, CodeBlock |
| **Organism**  | `src/lib/components/organisms/`  | Complex sections: Header, Footer, Hero, Post            |
| **Singleton** | `src/lib/components/singletons/` | Unique, one-off components: SearchBar, ShareButton      |

## Steps

### 1. Create the component file

Use kebab-case for the filename. Inside the component, use **Svelte 5 runes syntax**:

```svelte
<script lang="ts">
  // Use $props() instead of export let
  interface Props {
    label: string;
    variant?: 'primary' | 'secondary';
  }

  let { label, variant = 'primary' }: Props = $props();

  // Use $state, $derived, $effect for reactivity
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<div class="my-component">
  {label}
</div>

<style lang="scss">
  @use '$lib/scss/breakpoints.scss' as bp;

  .my-component {
    /* component styles */
  }
</style>
```

**Style guidelines:**

- Use Tailwind utility classes where possible
- Keep custom `<style>` blocks minimal
- Use Sass (`lang="scss"`) only when needed for variables/mixins

**TypeScript guidelines:**

- Always type props via an interface
- Always type function parameters and return values (strict mode is on)
- Single quotes, no semicolons (Prettier enforces this)

### 2. Add a Histoire story (optional but recommended)

Create a `*.story.svelte` file alongside the component to preview it in isolation:

```svelte
<script lang="ts">
  import { Story, Template } from 'histoire/client';
  import MyComponent from './MyComponent.svelte';
</script>

<Story name="Default">
  <Template>
    <MyComponent label="Hello" />
  </Template>
</Story>
```

Run `npm run story:dev` to open the Histoire storybook.

### 3. Export the component (if publicly available)

If the component should be importable as `$lib/...`, export it from `src/lib/index.ts`:

```typescript
export { default as MyComponent } from './components/atoms/MyComponent.svelte';
```

### 4. Verify and lint

```bash
npm run check   # TypeScript + Svelte type checking
npm run lint    # Prettier + ESLint
```
