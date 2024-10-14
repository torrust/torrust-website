<script lang="ts">
	import BlogPostCardRecent from './BlogPostCardRecent.svelte'; // Adjust the path as necessary
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import types for Histoire

	export let Hst: HstType; // Histoire context
</script>

<svelte:component
	this={Hst.Story}
	title="Atoms/BlogPostCardRecent"
	layout={{ type: 'grid', width: 400 }}
>
	<svelte:component this={Hst.Variant} title="Recent Blog Post Card 1">
		<BlogPostCardRecent
			title="Exploring Svelte: The Future of Web Development"
			author="John Doe"
			date="October 1, 2024"
		/>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Recent Blog Post Card 2">
		<BlogPostCardRecent
			title="JavaScript: The Good Parts"
			author="Jane Smith"
			date="September 25, 2024"
		/>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Recent Blog Post Card 3">
		<BlogPostCardRecent
			title="CSS Tricks for Modern Developers"
			author="Alice Johnson"
			date="September 15, 2024"
		/>
	</svelte:component>
</svelte:component>
