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
				coverImage={post.coverImage}
				contributor={post.contributor}
			/>
		{/each}
	</div>
</div>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	.container {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		padding-top: 3rem;
		background: rgba(25, 25, 25, 1);
		color: rgba(245, 245, 245, 0.96);
		padding-bottom: 64px;
		box-sizing: border-box;

		@include bp.for-desktop-up {
			max-width: 1200px;
		}
	}

	.grid {
		padding-top: 3rem;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 20px;

		@include bp.for-phone-only {
			grid-template-columns: 1fr;
		}

		@include bp.for-tablet-landscape-up {
			grid-template-columns: 1fr 1fr;
		}

		@include bp.for-desktop-up {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}
</style>
