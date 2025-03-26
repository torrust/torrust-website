<script lang="ts">
	import BlogPostCard from '$lib/components/molecules/BlogPostCard.svelte';
	import type { BlogPost } from '$lib/utils/types';

	interface Props {
		posts: BlogPost[];
	}

	let { posts }: Props = $props();
</script>

<div class="container">
	<div class="grid">
		{#each posts as post}
			<BlogPostCard
				slug={post.slug}
				title={post.title}
				date={post.date}
				contributor={post.contributor}
				coverImage={post.coverImage}
			/>
		{/each}
	</div>
</div>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	.container {
		color: rgba(245, 245, 245, 0.8);
		background: rgba(25, 25, 25, 1);
		padding-bottom: 64px;
	}

	.grid {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 20px;

		@include bp.for-tablet-portrait-up {
			grid-template-columns: 1fr 1fr;
		}

		@include bp.for-desktop-up {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}
</style>
