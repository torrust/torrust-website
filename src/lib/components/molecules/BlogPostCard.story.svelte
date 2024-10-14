<script lang="ts">
	import BlogPostCard from './BlogPostCard.svelte'; // Adjust the path as necessary
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import types for Histoire

	export let Hst: HstType; // Histoire context
</script>

<svelte:component this={Hst.Story} title="Atoms/BlogPostCard" layout={{ type: 'grid', width: 400 }}>
	<svelte:component this={Hst.Variant} title="Default Blog Post Card">
		<BlogPostCard
			title="Understanding Svelte"
			slug="understanding-svelte"
			date="2024-10-07"
			contributor="John Doe"
			coverImage="https://via.placeholder.com/150"
		/>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Blog Post Card Without Image">
		<BlogPostCard
			title="Exploring the JavaScript Ecosystem"
			slug="exploring-javascript-ecosystem"
			date="2024-09-30"
			contributor="Jane Smith"
			showImage={false}
		/>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Blog Post Card Without Date">
		<BlogPostCard
			title="CSS Tricks for Modern Web Development"
			slug="css-tricks-modern-web-dev"
			date="2024-09-30"
			contributor="Alice Johnson"
			showImage={true}
		/>
	</svelte:component>
</svelte:component>
