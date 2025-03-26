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
					As we prepare for an exciting year ahead, Torrust is inviting the community to join in
					defining the <strong>2025 roadmap</strong>. This is your opportunity to help shape the
					future of Torrust by contributing ideas and feedback on our priorities and focus areas.
					Collaboration has always been at the heart of Torrust, and we’re excited to work with you
					on this journey!
				</p>

				<h2 id="community-discussion-now-open-on-github">
					Community Discussion Now Open on GitHub
				</h2>

				<p>
					We’ve started a <a href="https://github.com/orgs/torrust/discussions/19"
						>discussion on GitHub</a
					> to gather input from the community. Whether you’re a developer, user, or enthusiast, your
					feedback is invaluable in determining the next steps for Torrust. Share your ideas, provide
					suggestions, and help us prioritize the most impactful features.
				</p>
				<h2 id="impact-mapping-for-feature-requests">Impact Mapping for Feature Requests</h2>
				<p>
					To ensure all feature requests are well-organized and evaluated, we’ve created an <a
						href="https://www.impactmapping.org/">impact map</a
					>. This tool highlights the relevance and potential benefits of each feature, helping us
					focus on what truly matters to the community and the project’s goals.
				</p>

				<iframe
					width="768"
					height="432"
					title="Interactive Whiteboard: Collaborative Planning in Real-Time"
					src="https://miro.com/app/live-embed/uXjVL_SACr0=/?moveToViewport=-7817,-1260,14754,10654&embedId=711626446826"
					frameborder="0"
					scrolling="no"
					allow="fullscreen; clipboard-read; clipboard-write"
					allowfullscreen
				></iframe>

				<h2 id="focus-areas-for-2025">Focus Areas for 2025</h2>
				<p>
					After reviewing and organizing all the issues in the main three repos (Tracker, Index and
					Index GUI) we conclude that there are three topics that are the main features requested by
					the community. In order of demand, starting from the most demanding features:
				</p>

				<ol>
					<li>Customization: behavior and UI.</li>
					<li>Statistics: especially related to users.</li>
					<li>
						Community: give more visibility to users and extend things they can do. Currently users
						can only upload torrents.
					</li>
				</ol>

				<p>There have been several factors to consider to define the draft roadmap:</p>

				<ol>
					<li>
						We have collected and organized issues (impact map) to better establish the community
						interests.
					</li>
					<li>
						We (core team) think there are some features/changes that need to be done (refactoring)
						before adding new features. Those tasks are not visible features sometimes, but they
						allow us to keep the code sustainable, what leads to a more efficient development in the
						future. Adding some complex features now could make implementing other features in the
						future harder.
					</li>
					<li>We also take into consideration what motivates us.</li>
				</ol>

				<p>Based on those points we’ve identified key areas to focus on in 2025:</p>

				<h3 id="-1-tracker-improvements-"><strong>1. Tracker Improvements</strong></h3>

				<ul>
					<li>
						<strong>Monitoring and Logging</strong>: Providing better insights into tracker activity
						and performance.
					</li>
					<li>
						<strong>Statistics</strong>: Providing better statistics for tracker admins and in the
						long-term for the index to define user policies.
					</li>
					<li>
						<strong>Resilience</strong>: Exploring ways to make the tracker even more resilient,
						avoiding bad clients or limiting the resource consumption to make the tracker even more
						stable and robust.
					</li>
				</ul>

				<h3 id="-2-index-enhancements-"><strong>2. Index Enhancements</strong></h3>
				<p>In the Index we have added two main epics:</p>

				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-index-gui/issues/657"
							><strong>Administration</strong></a
						>: Simplifying administration tasks.
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-index-gui/issues/649"
							><strong>Self-Management Tools</strong></a
						>: Empower users with greater control and flexibility.
					</li>
				</ul>

				<p>
					Many of the issues in those epics are customization features requested by the community.
				</p>

				<h2 id="out-of-scope-for-2025-but-under-discussion-">
					Out-of-Scope for 2025 (But Under Discussion)
				</h2>
				<p>Some features are too large in scope for 2025, but we’re exploring steps toward them:</p>

				<ul>
					<li>Document Database Searching</li>
					<li>V2 Torrent Support</li>
					<li>Customizable Themes</li>
				</ul>

				<p>
					If you are interesting in contributing to Torrust working on those topics, let us know by
					opening or joining discussions. We are open to support other developers interested in
					contributing to other parts not included in next year priorities.
				</p>

				<h2 id="how-to-get-involved">How to Get Involved</h2>
				<p>Here’s how you can participate in shaping the Torrust 2025 roadmap:</p>

				<ul>
					<li>
						Join the GitHub Discussion: Share your thoughts, suggest features, or comment on
						existing ideas.
					</li>
					<li>
						Review the Impact Map: Help us refine priorities by discussing the mapped-out features.
					</li>
					<li>
						Spread the Word: The more voices we have, the better the roadmap will reflect the
						community’s needs!
					</li>
				</ul>

				<p>
					We look forward to working with you to make 2025 a landmark year for Torrust. Let’s build
					something amazing together!
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
