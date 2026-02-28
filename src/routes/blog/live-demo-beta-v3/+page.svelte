<script lang="ts">
	let { data } = $props();
	let currentPost = $derived(data.currentPost);
	let allPosts = $derived(data.allPosts);
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import Callout from '$lib/components/molecules/Callout.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
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
				<h2>Hello, Torrent Enthusiasts!</h2>
				<p>
					We're thrilled to announce the beta demo of Bittorrent Torrust Index v3.0.0 is now live!
					This is a significant milestone for us, and we're eager to share what we've been working
					on with our vibrant community.
				</p>

				<Callout type="info"
					>Live demo: <a href="http://index.torrust-demo.com">http://index.torrust-demo.com</a
					></Callout
				>

				<h2>Experience the Beta Demo Today</h2>
				<p>
					Our beta demo is your sneak peek into the future of torrent indexing. We invite you to
					dive in, explore its features, and experience the enhancements firsthand. Remember, this
					is a beta version, so you're getting an early glimpse before the final release!
				</p>

				<p>
					You can test it at: <a href="http://index.torrust-demo.com"
						>http://index.torrust-demo.com</a
					>
				</p>

				<h2>Your Feedback Makes Us Better</h2>
				<p>
					We believe in the power of community-driven development. That's why we're calling on you,
					our users, to actively participate in testing the beta.
				</p>

				<p>
					Encountered a bug? Noticed something off? We want to hear about it. Please contribute by
					opening issues on our GitHub repository. Your insights are invaluable in refining and
					perfecting the platform.
				</p>

				<h2>Join the Conversation</h2>

				<p>
					Got ideas? Suggestions for improvement? Join the <a
						href="https://github.com/torrust/torrust-index-gui/discussions">discussion</a
					> on our GitHub repo's discussion section. Your thoughts and proposals are a key part of our
					collaborative development process. Let's brainstorm together to make Torrust even better.
				</p>

				<h2>Important Notice: Demo Availability</h2>

				<Callout type="info">
					Please be aware that the demo is subject to downtime or resets. As a beta version, it's
					part of our testing process. Any data you add may be lost during these periods. We
					appreciate your understanding and patience as we fine-tune the platform.
				</Callout>

				<h2>A Heartfelt Thank You to Our Contributors</h2>
				<p>
					This release wouldn't have been possible without the dedication and hard work of our
					contributors. A big shout-out to everyone who has contributed their time, skills, and
					passion to this release. Your contributions are the backbone of this project, and we're
					immensely grateful for your support.
				</p>

				<h2>Join Us in This Exciting Journey</h2>
				<p>
					We're just getting started, and there's much more to come. Stay tuned for more updates,
					and thank you for being a part of this journey. We very welcome any contributions to the
					projects.
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
		color: var(--color-link);
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
