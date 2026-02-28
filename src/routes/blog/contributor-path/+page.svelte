<script lang="ts">
	let { data } = $props();
	let currentPost = $derived(data.currentPost);
	let allPosts = $derived(data.allPosts);
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
				<h2 id="introduction">Introduction</h2>
				<p>
					We’re thrilled to welcome new contributors to Torrust! While we’ve had many contributors
					over the last couple of years, we know that getting started can be challenging. That’s why
					we’re working hard to improve the onboarding experience by:
				</p>
				<ul>
					<li>Writing compressive documentation.</li>
					<li>Keeping the codebase as simple and clean as possible.</li>
					<li>Maintaining solid test coverage to make contributing feel safe and reliable.</li>
					<li>Supporting contributors with prompt help when they open issues or PRs.</li>
				</ul>
				<p>
					Despite our efforts, we realize it can still be daunting for newcomers. This guide aims to
					help you navigate our projects and get you started on making meaningful contributions.
				</p>
				<h2 id="minimum-requirements">Minimum Requirements</h2>
				<p>To start contributing to Torrust repositories, you should have basic knowledge of:</p>
				<ul>
					<li>
						<strong>Git</strong>: Our workflow requires signed commits, and we encourage commit
						messages to follow the
						<a href="https://www.conventionalcommits.org/en/v1.0.0/"
							>Conventional commits specification</a
						> specification.
					</li>
					<li>
						<strong>Rust</strong>: Many of our projects use Rust, but don’t worry if you&#39;re just
						getting started—our community is here to help.
					</li>
					<li>
						<strong>GitHub</strong>: Familiarity with GitHub is essential, as it’s where our
						collaboration happens.
					</li>
				</ul>
				<p>
					If Rust isn’t your thing yet, that’s okay! We also have repositories that don’t require
					Rust knowledge, such as:
				</p>
				<ul>
					<li>The <a href="https://github.com/torrust/torrust-website">Torrust Website</a></li>
					<li>The <a href="https://github.com/torrust/torrust-index-gui">Index GUI</a></li>
				</ul>
				<h2 id="why-getting-started-can-be-challenging">Why Getting Started Can Be Challenging</h2>
				<p>
					Getting started doesn’t have to be hard, but we understand that some parts of the codebase
					can be intimidating at first. Here are a few reasons why it might seem challenging, and
					what you can do about it.
				</p>
				<h3 id="complex-project-structure">Complex Project Structure</h3>
				<p>Some of our projects—like the Tracker—involve multiple services:</p>
				<ul>
					<li><strong>UDP Trackers</strong> and <strong>HTTP Trackers</strong>.</li>
					<li><strong>REST</strong> API for management.</li>
					<li><strong>Health Check API</strong>.</li>
					<li><strong>Background Tasks</strong> (e.g., cleaning torrents).</li>
				</ul>
				<p>
					While this might sound complex, each service is relatively small and manageable on its
					own.
				</p>
				<h3 id="limited-pre-defined-issues">Limited Pre-Defined Issues</h3>
				<p>
					Newcomers often prefer to tackle well-defined issues. However, many of our upcoming
					features are still in the discussion or planning phase. If you&#39;re interested in
					working on something specific but don&#39;t see an open issue, feel free to start a
					discussion or open a new issue!
				</p>
				<h3 id="package-structure">Package Structure</h3>
				<p>
					Our current package structure for the Tracker could be improved in terms of performance,
					reusability, and maintainability. We’ve had discussions about refactoring it to make
					contributions more approachable:
				</p>
				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/discussions/240"
							>New app architecture</a
						>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/issues/753">Refactor packages</a>
					</li>
				</ul>
				<p>
					We believe smaller and independent packages will make it easier for contributors to work
					on specific components without needing to understand the entire codebase.
				</p>
				<h2 id="how-you-can-contribute">How You Can Contribute</h2>
				<p>There are many ways to contribute to Torrust, including:</p>
				<ul>
					<li>Fixing typos.</li>
					<li>Improving documentation.</li>
					<li>Proposing new features.</li>
					<li>Participating in discussions.</li>
					<li>Testing new releases.</li>
					<li>Reporting bugs.</li>
					<li>Writing blog posts.</li>
				</ul>
				<p>
					However, this guide will focus on developers who want to contribute by coding. We can
					divide contributions into frontend (Nuxt + TypeScript) and backend (Rust). Let’s explore
					these paths separately.
				</p>
				<h3 id="frontend-development">Frontend Development</h3>
				<p>There are two main repositories for frontend contributions:</p>
				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-website">Torrust Website</a>: This is the
						organization site where this post is published. There are a lot of
						<a href="https://github.com/torrust/torrust-website/issues">things to improve</a>. The
						site is built with <a href="https://svelte.dev/docs/kit">SvelteKit</a>.
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-index-gui">Torrust Index GUI</a>: This is
						the frontend for the Torrust Index.
					</li>
				</ul>
				<p>Key technologies used:</p>
				<ul>
					<li><a href="https://nuxt.com/">Nuxt</a></li>
					<li><a href="https://vuejs.org/">Vue 3</a></li>
					<li><a href="https://www.cypress.io/">Cypress</a></li>
				</ul>
				<p>
					There are a lot of missing <a href="https://github.com/torrust/torrust-index-gui/issues"
						>basic functionality</a
					> there. Some of the areas that need contributions include:
				</p>
				<ul>
					<li>
						<strong>Admin Panel</strong>: Adding functionality for user management, categories, and
						tags.
					</li>
					<li>
						<strong>Search Interface</strong>: Improving how users interact with and filter search
						results.
					</li>
					<li>
						<strong>Feature Configuration</strong>: Making some features more configurable to adapt
						to different environments.
					</li>
				</ul>
				<h3 id="backend-development">Backend Development</h3>
				<p>We also have two main Rust repositories for backend contributions:</p>
				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-tracker">Torrust Tracker</a>: A BitTorrent
						tracker that can be used independently of other applications.
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-index">Torrust Index</a>: The backend for
						the Torrust Index, consisting of a REST API built using
						<a href="https://github.com/tokio-rs/axum">Axum</a>.
					</li>
				</ul>
				<p>In general the Index is much simpler than the tracker. It&#39;s basically a REST API.</p>
				<h4 id="torrust-index">Torrust Index</h4>
				<p>
					The Torrust Index is simpler compared to the Tracker—primarily a REST API. Areas of recent
					development include:
				</p>
				<ul>
					<li><strong>Implementing New BEPs</strong> (BitTorrent Enhancement Proposals)</li>
					<li><strong>Improving Administration</strong> features for better usability.</li>
					<li><strong>Enhancing the Search Engine</strong> for more efficient searching.</li>
				</ul>
				<p>
					BEPs stand for <a href="http://bittorrent.org/beps/bep_0000.html"
						>Bittorrent Enhancement Proposals</a
					>. THey are specifications for new features in the BitTorrent ecosystem. Many of them have
					not been implemented yet.
				</p>
				<p>
					If you’re interested in Rust but don’t want to work on low-level BitTorrent protocols,
					focusing on REST API features is a great way to start.
				</p>
				<p>
					If you are curious about how BitTorrent works under the hook these BEPs are usually easier
					to implement than the ones for the Tracker.
				</p>
				<h4 id="torrust-tracker">Torrust Tracker</h4>
				<p>
					The Tracker is a more complex project, mainly because it operates several services.
					However, you don’t need to understand every detail to get started.
				</p>

				<Callout type="info">
					Notice: You don't need to understand all services and layers to start contributing. There
					are many components that can we improved independently.
				</Callout>

				<p>Here’s a high-level overview:</p>
				<ul>
					<li>UDP trackers.</li>
					<li>HTTP trackers.</li>
					<li>A REST API.</li>
					<li>A health check API.</li>
					<li>A background task to clean torrents.</li>
				</ul>
				<p>
					We’re using Axum for most of the HTTP-based services. The UDP tracker is a custom UDP
					server that uses some types from the aquatic crates.
				</p>
				<p>
					If you&#39;re interested in the internal architecture, read through the <a
						href="https://github.com/torrust/torrust-tracker/discussions/240"
						>proposed architecture discussion</a
					>.
				</p>
				<p>
					Basically all services at the highest level (delivery layer) are HTTP or UDP service.
					Controllers call app services that call the main tracker service in the end. The tracker
					domain service is the core of the application and it has many responsibilities:
				</p>
				<ul>
					<li>Peers authentication and authorization (only for HTTP trackers)</li>
					<li>
						Whitelist: the tracker can run in <code>listed</code> mode when only some infohashes are allowed.
					</li>
					<li>Torrents: the core in-memory data structure which contains all the torrents info.</li>
				</ul>
				<p>Areas where you can contribute include:</p>
				<ul>
					<li>
						Adding protocol features, such as <a
							href="https://github.com/torrust/torrust-tracker/discussions/532"
							>https://github.com/torrust/torrust-tracker/discussions/532</a
						>.
					</li>
					<li>Improving existing console tools that help test and debug.</li>
					<li>Extracting reusable packages to share with the Rust community.</li>
					<li>Improving statistics tracking, which is crucial for private trackers.</li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/discussions/774"
							>Working on performance improvements for critical components like the in-memory
							torrent repository.</a
						>.
					</li>
					<li>
						Implementing new protocols, such as <a
							href="https://github.com/torrust/torrust-tracker/discussions/138">webtorrent</a
						>, to enable BitTorrent in the browser.
					</li>
				</ul>
				<p>
					We will introduce some of them ordered starting from the simplest ones to the hardest
					ones. The hardest ones are not so difficult but they require a good knowledge of the
					BitTorrent protocols and therefore a bigger effort.
				</p>
				<p>There are many small tasks related to the protocols like:</p>
				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/discussions/532"
							>https://github.com/torrust/torrust-tracker/discussions/532</a
						>
					</li>
				</ul>
				<p>
					That&#39;s an example of issue that would require you to only understand and <code
						>announce</code
					> request and the tracker configuration module.
				</p>
				<p>
					We have generated three console commands that are really helpful for debugging but they
					could be also very useful in other projects. THey are:
				</p>
				<ul>
					<li>UDP Tracker client: a console client to make requests to UDP trackers.</li>
					<li>HTTP Tracker client: a console client to make requests to HTTP trackers.</li>
					<li>Tracker Checker: a console client to run checks against remote trackers services.</li>
				</ul>
				<p>
					There is an <a href="https://github.com/torrust/torrust-tracker/issues/669">epic issue</a>
					that contains a TODO list and a recommendation about how to proceed.
				</p>
				<p>
					Those clients are also based on generic UDP and HTTP clients that could also be extracted
					into workspace packages to publish them as independent crates that other projects can
					benefit from.
				</p>
				<p>
					Another very requested feature is to improve the statistics. Currently the tracker only
					tracks the list of peers and the number of downloads. However that not enough for private
					indexes. This is not an easy task because there are no consensus about wha the tracker
					should track. A first approach could be just adding the basic data and make it extensible
					and optional to add custom extra stats.
				</p>
				<p>
					There are also many ideas about how to improve performance, specially in the core tracker
					torrent repository. This will require you a good understanding about Rust data types and
					concurrency restriction, but you don&#39;t need to know much about BitTorrent. Therefore
					it&#39;s a good choice for people that are good at this or are looking for learn more
					about creating Rust types with a high load. This is one of the main bottlenecks of the
					tracker.
				</p>
				<p>
					Finally, there are many protocol extensions not implement yet. FOr example <a
						href="https://webtorrent.io/">webtorrent</a
					> protocol. This enables a lot of cool projects running BitTorrent clients in the browser. Right
					now it&#39;s not possible to use the Torrust Tracker for those projects. THis feature requires
					a big effort to understand the protocol and implement it. There is not much information but
					at least there are other implementation in Rust (for example aquatic).
				</p>
				<p>
					If you want to limit the scope maybe console clients and tracker clients are a good
					entrypoint to start learning about basic tracker requests. On the other hand, if you want
					to try a full new feature, webtorrent protocol could be the next big thing.
				</p>
				<h4 id="other-projects">Other Projects</h4>
				<p>
					Apart from the two main applications we have also created other side projects related to
					BitTorrent:
				</p>
				<ul>
					<li><a href="https://github.com/torrust/bencode2json">bencode2json</a></li>
					<li><a href="https://github.com/torrust/json2bencode">json2bencode</a></li>
					<li><a href="https://github.com/torrust/torrust-hash2torrent">hash2torrent</a></li>
				</ul>
				<p>
					They are totally independent from the Index and Tracker. They might be a good way to
					introduce yourself into the BitTorrent. They are small projects that require a very basic
					knowledge about BitTorrent, and they are a good way to start learning about basic
					BitTorrent concepts like:
				</p>
				<ul>
					<li>Bencode format</li>
					<li>Infohash</li>
					<li>BitTorrent client</li>
				</ul>
				<p>
					<code>bencode2json</code> and <code>json2bencode</code>are particularly good to start with
					as the scope if very small.
				</p>
				<h2 id="more-resources">More Resources</h2>
				<p>In our blog you will find tutorials like:</p>
				<ul>
					<li><a href="./how-to-setup-the-development-environment">How To Setup The Dev Env</a></li>
				</ul>
				<p>
					You can also open a new discussion or issues in all repos if there is something you would
					like to contribute with but you are not sure where to start from.
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
