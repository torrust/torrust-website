<script lang="ts">
	let { data } = $props();
	let { currentPost, allPosts } = data;
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
	import Callout from '$lib/components/molecules/Callout.svelte';
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
				<h2 id="-greetings-torrust-fans-"><strong>Greetings, Torrust Fans!</strong></h2>
				<p>
					As we move forward according to our release plan, we&#39;re excited to be nearing the
					final release of version 3.0.0.
				</p>
				<p>
					On August 13th, we made <code>v3.0.0-alpha.12</code> available, and now we&#39;re pleased to
					present v3.0.0-beta. This release is a critical step as we refine the software in preparation
					for the official launch.
				</p>
				<h2 id="release-schedule">Release Schedule</h2>
				<p>The journey to our major release continues, and here’s our roadmap:</p>
				<table>
					<thead>
						<tr>
							<th>Milestone</th>
							<th>Target Date</th>
							<th>Version</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Feature Freeze</td>
							<td>13/08/2024</td>
							<td>3.0.0-alpha.12</td>
						</tr>
						<tr>
							<td>Code Freeze</td>
							<td>13/08/2024</td>
							<td>3.0.0-alpha.12</td>
						</tr>
						<tr>
							<td>Beta Release</td>
							<td>03/09/2024</td>
							<td>3.0.0-beta</td>
						</tr>
						<tr>
							<td>Release Candidate</td>
							<td>15/09/2024</td>
							<td>3.0.0-rc.1</td>
						</tr>
						<tr>
							<td>Final Release</td>
							<td>30/09/2024</td>
							<td>3.0.0</td>
						</tr>
					</tbody>
				</table>
				<h2 id="how-to-participate">How to Participate</h2>
				<p>
					Your feedback is invaluable to us. As we move towards the beta phase, we invite you to
					download this beta release, test it extensively, and report any issues or suggestions you
					may have. Here’s how you can contribute:
				</p>
				<ul>
					<li>Testing: Download the alpha release and run it in your environment.</li>
					<li>
						Reporting Bugs: If you encounter any issues, please report them through our issue
						tracker.
					</li>
				</ul>
				<h2 id="your-input-helps-us-improve">Your Input Helps Us Improve</h2>
				<p>
					Your feedback is crucial in helping us refine this release. We want the community&#39;s
					active involvement as we move forward.
				</p>
				<p>
					After the final version 3.0.0 is released, we plan to open discussions about our future
					roadmap. We encourage you to propose features and improvements to help us continue
					building superior tools and enhance the BitTorrent ecosystem.
				</p>
				<p>
					Have ideas or suggestions? Join the <a
						href="https://github.com/torrust/torrust-index-gui/discussions">discussion</a
					> on our GitHub repository. Your contributions are key to our collaborative development approach.
					Let’s work together to make Torrust even better!
				</p>
				<h2 id="important-notice-demo-availability">Important Notice: Demo Availability</h2>

				<Callout type="warning">
					Please note that the <a href="https://index.torrust-demo.com/">demo</a> environment may experience
					downtime or resets as part of our ongoing testing. As this is a beta version, data may be lost
					during these phases. We appreciate your patience and understanding as we fine-tune the system.
				</Callout>

				<h2 id="special-thanks">Special Thanks</h2>
				<p>
					We want to extend our deepest thanks to all the contributors who have tirelessly tested
					and provided feedback on this release. Your insights have been crucial in getting us this
					far, and we look forward to continuing this journey together.
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
		color: rgba(255, 49, 0, 1);
	}

	ul {
		display: flex;
		flex-direction: column;
		list-style-type: disc;
		margin: 0;
		padding-left: 1.5rem;
		word-break: keep-all;
	}

	ul li {
		margin: 0.25rem 0;
		word-break: keep-all;
	}

	.content-preview > p,
	.content-preview > ul,
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
