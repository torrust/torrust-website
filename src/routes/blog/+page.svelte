<script lang="ts">
	import RecentPosts from '$lib/components/singletons/RecentPosts.svelte';
	import type { BlogPost } from '$lib/utils/types';
	import SearchBar from '$lib/components/singletons/SearchBar.svelte';

	export let data: {
		posts: BlogPost[];
	};

	let { posts } = data;

	let searchTerm = '';
</script>

<div class="container">
	<div class="header">
		<h1>Blog</h1>
		<SearchBar {searchTerm} {posts} />
	</div>
	{#if posts && posts.length}
		<RecentPosts {posts} />
	{/if}
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.container {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		padding-top: 3rem;
		background: rgba(26, 26, 26, 1);
		color: rgba(245, 245, 245, 0.96);
		padding-bottom: 64px;
		box-sizing: border-box;

		@include for-desktop-up {
			max-width: 1800px;
		}
	}

	.header {
		padding-inline: 3.5rem;
		margin: 0 auto;

		@include for-tablet-portrait-up {
			width: 700px;
		}

		@include for-desktop-up {
			width: 1100px;
			padding-inline: 0rem;
		}

		h1 {
			padding-bottom: 1rem;
			font-size: 36px;

			@include for-tablet-portrait-up {
				padding-bottom: 0px;
			}
		}

		@include for-tablet-portrait-up {
			display: flex;
			justify-content: space-between;
		}
	}
</style>
