<script lang="ts">
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import SearchBar from '$lib/components/singletons/SearchBar.svelte';
	import { page } from '$app/stores';
	import type { BlogPost } from '$lib/utils/types';

	interface Props {
		data: {
			allPosts: BlogPost[];
		};
	}

	let { data }: Props = $props();
	let { allPosts: blogPosts = [] } = data || {};
	let searchTerm = $state('');

	type Post = {
		title: string;
		date: string;
		contributor: string;
		slug: string;
	};

	// Default to an empty array if blogPosts is undefined
	let posts = $state<Post[]>([]);

	if (blogPosts && blogPosts.length > 0) {
		posts = blogPosts.filter((post: BlogPost) => {
			const title = post?.title ?? '';
			const contributor = post?.contributor ?? '';
			const excerpt = post?.excerpt ?? '';

			return (
				title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				contributor.toLowerCase().includes(searchTerm.toLowerCase()) ||
				excerpt.toLowerCase().includes(searchTerm.toLowerCase())
			);
		});
	}
</script>

<div class="container">
	<div class="header">
		<h1>Blog</h1>
		<SearchBar bind:searchTerm {blogPosts} />
	</div>

	{#if posts && posts.length > 0}
		<div class="grid">
			{#each posts as post}
				<a href="/blog/{post.slug}">
					<BlogPreview post_data={post} />
				</a>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		padding-top: 3rem;
		background: rgba(26, 26, 26, 1);
		color: rgba(245, 245, 245, 0.96);
		padding-bottom: 64px;

		@include bp.for-desktop-up {
			max-width: 1176px;
		}
	}

	.header {
		margin: 0 auto;

		@include bp.for-tablet-portrait-up {
			width: 700px;
		}

		@include bp.for-desktop-up {
			width: 1100px;
		}

		h1 {
			padding-bottom: 1rem;
			font-size: 36px;

			@include bp.for-tablet-portrait-up {
				padding-bottom: 0px;
			}
		}

		@include bp.for-tablet-portrait-up {
			display: flex;
			justify-content: space-between;
		}
	}

	.grid {
		display: grid;
		padding-top: 3rem;
		padding-inline: 2.5rem;
		grid-template-columns: 1fr 1fr;
		grid-gap: 24px;
		width: 100%;
		flex-grow: 1;

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
