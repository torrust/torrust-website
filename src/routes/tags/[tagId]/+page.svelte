<script lang="ts">
	import { run } from 'svelte/legacy';

	import { page } from '$app/stores';
	import type { BlogPost } from '$lib/utils/types';
	import TagCard from '$lib/components/molecules/TagCard.svelte';

	const tagId = $page.params.tagId;

	let blogPosts: BlogPost[] = $state([]);

	run(() => {
		blogPosts = $page.data.posts;
	});
</script>

<div class="container">
	{#if blogPosts && blogPosts.length}
		<h1>{tagId}</h1>
		{#each blogPosts as post}
			{#if post?.tags}
				{#if post.tags && post.tags.includes(tagId)}
					<TagCard
						title={post?.title || 'Default title'}
						coverImage={post?.coverImage || 'Default image'}
						slug={post?.slug || 'Default slug'}
						excerpt={post?.excerpt || 'Default excerpt'}
						date={post?.date || 'Default date'}
					/>
				{/if}
			{/if}
		{/each}
	{/if}
</div>

<style lang="scss">
	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin: 0 auto;
		padding-inline: 2.5rem;

		h1 {
			padding: 2rem;
			text-align: center;
			font-size: 2rem;
		}
	}
</style>
