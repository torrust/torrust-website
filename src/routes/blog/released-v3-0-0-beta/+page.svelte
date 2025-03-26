<script lang="ts">
	let { data } = $props();
	let { currentPost, allPosts } = data;
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
</script>

<Post
	title={currentPost.title}
	slug={currentPost.slug}
	coverImage={currentPost.coverImage}
	date={currentPost.date}
	tags={currentPost.tags}
	excerpt={currentPost.excerpt}
	contributor={currentPost.contributor}
	contributorSlug={currentPost.contributorSlug}
>
	<PagesWrapper>
		<div class="wrapper">
			<Toc class="toc" />
			<div id="toc-contents" class="content-preview">
				<h2 id="introduction">Introduction</h2>
				<p>
					We’re thrilled to announce the official release of version <strong>3.0.0</strong> of the Torrust
					software! This marks a new milestone in our journey, bringing together Tracker and Index into
					a unified, cohesive release. After several beta iterations and invaluable feedback from the
					community, we’ve reached this significant moment.
				</p>
				<h2 id="a-unified-tracker-and-index-release">A Unified Tracker and Index Release</h2>
				<p>
					The goal of this release was to ensure consistent and homogeneous versions across all
					packages that make up the Tracker + Index solution. Version 3.0.0 sets the foundation for
					further developments, offering a reliable, modern system.
				</p>
				<h2 id="roadmap-for-the-future">Roadmap for the Future</h2>
				<p>
					This release is just the beginning. We’ll now focus on reviewing the roadmap to introduce
					more features and improvements to Torrust. Our aim is to continue enhancing the platform
					and building even better tools for the BitTorrent ecosystem.
				</p>
				<p>
					We invite the community to be part of this journey by contributing ideas, reporting bugs,
					and helping shape the next phase of our project. The discussions around the future roadmap
					are open on our GitHub discussions page.
				</p>
				<h2 id="special-thanks">Special Thanks</h2>
				<p>
					A heartfelt thank you to everyone who contributed to the development of this release. Your
					dedication, feedback, and hard work have made this possible, and we look forward to
					continued collaboration in the future.
				</p>
			</div>
		</div>
	</PagesWrapper>
	<PrevNextPost currentPage={currentPost.slug} {allPosts} />
	<div class="related-posts-container">
		<h2>Related Posts:</h2>
		<div class="grid">
			{#each data.allPosts.slice(0, 3) as post}
				<a href="/blog/{post.slug}">
					<BlogPreview post_data={post} />
				</a>
			{/each}
		</div>
	</div>
</Post>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		position: relative;
		max-width: 1150px;
	}

	.content-preview {
		flex: 1;
		word-break: keep-all;
		padding-top: 2rem;
	}

	h2 {
		font-size: 1.8rem;
		font-weight: bold;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem;
	}

	p {
		font-size: 1rem;
		padding-top: 1rem;
		color: rgba(245, 245, 245, 0.8);
		word-break: keep-all;
	}

	a {
		word-break: keep-all;
		color: rgba(254, 13, 0, 1);
	}

	.content-preview > p,
	.content-preview > h2 {
		margin-bottom: 1rem;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem;
	}

	.related-posts-container {
		display: flex;
		flex-direction: column;
		color: rgba(245, 245, 245, 0.96);
		margin: 0 auto;
		text-align: center;
		padding-top: 2rem;

		@include bp.for-desktop-up {
			max-width: 1176px;
		}
	}

	.grid {
		padding-top: 3rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 24px;
		max-width: 1200px;
		margin: 0 auto;
		padding-inline: 2.5rem;

		@include bp.for-phone-only {
			grid-template-columns: 1fr;
		}

		@include bp.for-tablet-landscape-up {
			grid-template-columns: 1fr 1fr;
		}

		@include bp.for-desktop-up {
			grid-template-columns: 1fr 1fr 1fr;
			padding-inline: 0;
		}
	}

	@include bp.for-desktop-up {
		.wrapper {
			flex-direction: row;
			gap: 4rem;
		}

		.wrapper :global(.toc) {
			position: sticky;
			top: 4rem;
			height: min-content;
		}

		.content-preview {
			overflow-y: auto;
			padding-top: 0rem;
		}
	}
</style>
