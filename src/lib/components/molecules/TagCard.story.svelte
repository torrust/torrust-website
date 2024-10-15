<script lang="ts">
	import TagCard from './TagCard.svelte'; // Adjust the import path as necessary
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import Histoire types

	export let Hst: HstType; // Histoire context

	// Example post data
	const examplePost = {
		title: 'Exploring the Depths of Svelte',
		coverImage: '/images/svelte-cover.jpg', // Replace with a valid image path
		excerpt:
			'Svelte is a modern JavaScript framework for building user interfaces. This post dives deep into its core features and benefits.',
		slug: 'exploring-svelte-depths',
		tags: ['Svelte', 'JavaScript', 'Framework'],
		readingTime: '4 min read',
		date: '2024-10-05',
		showImage: true
	};
</script>

<svelte:component this={Hst.Story} title="Atoms/TagCard" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Default Tag Card">
		<TagCard
			title={examplePost.title}
			coverImage={examplePost.coverImage}
			excerpt={examplePost.excerpt}
			slug={examplePost.slug}
			tags={examplePost.tags}
			readingTime={examplePost.readingTime}
			date={examplePost.date}
			showImage={examplePost.showImage}
		/>
	</svelte:component>
</svelte:component>
