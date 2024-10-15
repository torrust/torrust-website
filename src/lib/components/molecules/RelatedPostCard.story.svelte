<script lang="ts">
	import RelatedPostCard from './RelatedPostCard.svelte'; // Adjust the import path as necessary
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import Histoire types

	export let Hst: HstType; // Histoire context

	// Example post data
	const examplePost = {
		title: 'Understanding Svelte and Its Benefits',
		excerpt:
			'Svelte is a modern framework that compiles to optimized JavaScript at build time. This post explores its advantages and unique features.',
		slug: 'understanding-svelte-benefits',
		tags: ['Svelte', 'JavaScript', 'Framework'],
		readingTime: '5 min read',
		date: '2024-10-01'
	};
</script>

<svelte:component
	this={Hst.Story}
	title="Atoms/RelatedPostCard"
	layout={{ type: 'grid', width: 600 }}
>
	<svelte:component this={Hst.Variant} title="Default Related Post Card">
		<RelatedPostCard
			title={examplePost.title}
			excerpt={examplePost.excerpt}
			slug={examplePost.slug}
			tags={examplePost.tags}
			readingTime={examplePost.readingTime}
			date={examplePost.date}
		/>
	</svelte:component>
</svelte:component>
