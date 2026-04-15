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
	import CodeBlock from '$lib/components/molecules/CodeBlock.svelte';
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
				<p>Hello, Torrust community!</p>

				<p>
					We're happy to announce the first public release of the
					<a href="https://github.com/torrust/torrust-tracker-deployer"
						><strong>Torrust Tracker Deployer</strong></a
					>: <strong>v0.1.0</strong>.
				</p>

				<p>
					This is the milestone that turns the project from an internal effort into a tool you can
					use today. If you've followed our
					<a href="/blog/introducing-the-torrust-tracker-deployer">previous deployer articles</a>,
					this release includes the workflow we used to deploy the
					<a href="https://github.com/torrust/torrust-tracker-demo">public Torrust Tracker demo</a> in
					production and all fixes discovered during that real-world validation.
				</p>

				<Callout type="info">
					<strong>Release links</strong>
					<ul>
						<li>
							GitHub repository:
							<a href="https://github.com/torrust/torrust-tracker-deployer"
								>torrust/torrust-tracker-deployer</a
							>
						</li>
						<li>
							Roadmap and issues:
							<a href="https://github.com/torrust/torrust-tracker-deployer/issues"
								>github.com/torrust/torrust-tracker-deployer/issues</a
							>
						</li>
						<li>
							Release process issue:
							<a href="https://github.com/torrust/torrust-tracker-deployer/issues/462"
								>github.com/torrust/torrust-tracker-deployer/issues/462</a
							>
						</li>
						<li>
							Demo deployment repository:
							<a href="https://github.com/torrust/torrust-tracker-demo"
								>torrust/torrust-tracker-demo</a
							>
						</li>
						<li>
							Release tag:
							<a href="https://github.com/torrust/torrust-tracker-deployer/releases/tag/v0.1.0"
								>github.com/torrust/torrust-tracker-deployer/releases/tag/v0.1.0</a
							>
						</li>
						<li>
							Docker image (v0.1.0):
							<a
								href="https://hub.docker.com/layers/torrust/tracker-deployer/0.1.0/images/sha256-00537e3b201d6086f00be6a851c215b24378e12fa5646895fc27358ac2dcbcd3"
								>hub.docker.com/layers/torrust/tracker-deployer/0.1.0/...dcbcd3</a
							>
						</li>
						<li>
							Crates:
							<a href="https://crates.io/crates/torrust-tracker-deployer/0.1.0"
								>torrust-tracker-deployer</a
							>,
							<a href="https://crates.io/crates/torrust-tracker-deployer-types/0.1.0"
								>torrust-tracker-deployer-types</a
							>,
							<a href="https://crates.io/crates/torrust-tracker-deployer-dependency-installer/0.1.0"
								>torrust-tracker-deployer-dependency-installer</a
							>,
							<a href="https://crates.io/crates/torrust-tracker-deployer-sdk/0.1.0"
								>torrust-tracker-deployer-sdk</a
							>
						</li>
					</ul>
				</Callout>

				<h2 id="release-notes-snapshot">Release Notes Snapshot</h2>

				<p>
					This post announces the first stable release. If you want one-screen release-critical
					information, this section covers support, limitations, upgrade expectations, and how to
					verify a successful setup.
				</p>

				<h3 id="compatibility-and-scope">Compatibility and Scope (v0.1.0)</h3>

				<ul>
					<li><strong>Production provider support</strong>: Hetzner only</li>
					<li><strong>Container execution</strong>: cloud-provider workflows are supported</li>
					<li><strong>LXD support in container mode</strong>: not supported</li>
				</ul>

				<h3 id="upgrade-and-migration">Upgrade and Migration</h3>

				<p>
					Since this is the first stable public release (<code>v0.1.0</code>), there is no migration
					path from a previous stable deployer release yet. Future announcement posts will include
					explicit upgrade guidance when new stable versions are published.
				</p>

				<h3 id="known-limitations">Known Limitations</h3>

				<ul>
					<li>Only Hetzner is supported for production deployments in this version</li>
					<li>Some advanced post-provision operations still require manual steps</li>
					<li>
						Tracked release-process context is available in
						<a href="https://github.com/torrust/torrust-tracker-deployer/issues/462">issue #462</a>
					</li>
				</ul>

				<h3 id="quick-verification-checklist">Quick Verification Checklist</h3>

				<ul>
					<li>Confirm CLI help works with the command shown below</li>
					<li>Validate your environment configuration before provisioning</li>
					<li>Run deployment tests after <code>run</code> to confirm service readiness</li>
					<li>
						Check the demo repository if you need a reference for generated artifacts and operations
					</li>
				</ul>

				<Callout type="warning">
					<strong>Security note</strong>: keep secrets (API tokens, SSH keys, and environment
					values) out of version control. Use local environment files and secure secret management
					in CI/CD.
				</Callout>

				<h2 id="what-is-in-v0-1-0">What's in v0.1.0</h2>

				<p>
					v0.1.0 ships the first complete deployment lifecycle for Torrust Tracker environments. The
					focus of this release is reliability, reproducibility, and clear operational guidance.
				</p>

				<ul>
					<li>Production-tested command lifecycle from environment creation to service startup</li>
					<li>Improved validation and error messages from end-to-end deployment testing</li>
					<li>Deployment docs and troubleshooting guidance based on real Hetzner deployments</li>
					<li>Support for running the tool via Docker, reducing local setup complexity</li>
				</ul>

				<p>
					The project remains intentionally opinionated: sensible defaults, a clear sequence of
					steps, and a single objective - get a tracker deployed correctly with less manual effort.
				</p>

				<p>
					Another important design choice is architecture: the deployer follows layered
					Domain-Driven Design (DDD). That approach is uncommon in infrastructure tooling, but it
					has helped us keep domain logic isolated from provider/tool integrations and made the
					system easier to evolve and test as it grew.
				</p>

				<h2 id="why-this-release-matters">Why this release matters</h2>

				<p>
					Historically, deploying Torrust Tracker in production required many manual tasks across
					server provisioning, networking, TLS, container configuration, and service checks. With
					the deployer, those operations are organized into a reproducible workflow with structured
					state and tests.
				</p>

				<p>
					In our
					<a href="/blog/deploying-torrust-tracker-with-the-deployer">latest deployment report</a>,
					we used the deployer to bring the public demo online and fixed 11 issues discovered during
					the process. Those fixes are part of the path to this v0.1.0 release.
				</p>

				<Callout type="warning">
					<strong>Current scope</strong>: v0.1.0 is a major first release, but it does not automate
					every possible infrastructure scenario. Some advanced setups still require manual
					post-provision steps, especially around custom networking and provider-specific details.
				</Callout>

				<h2 id="built-with-ai-agents">Built Entirely With AI Agents</h2>

				<p>
					As mentioned in our
					<a href="/blog/introducing-the-torrust-tracker-deployer#ai-assisted-development"
						>previous deployer article</a
					>, the Torrust Tracker Deployer was built entirely using
					<a href="/blog/building-with-ai-agents-building-for-ai-agents">AI agents</a>. We started
					this effort at the end of September 2025 and continued iterating through architecture,
					implementation, testing, and documentation.
				</p>

				<p>
					To give an idea of the scope, here are the latest code statistics from the automated
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/actions/workflows/code-statistics.yml"
						>code-statistics workflow</a
					>:
				</p>

				<ul>
					<li><strong>1,844 files</strong> tracked in the repository</li>
					<li><strong>344,370 total lines</strong> (code + comments + blanks)</li>
					<li><strong>175,769 code lines</strong> across all languages</li>
					<li><strong>107,124 comment lines</strong> for documentation and explanations</li>
					<li><strong>61,477 blank lines</strong> for structure and readability</li>
					<li><strong>804 Rust files</strong> with <strong>85,323 Rust code lines</strong></li>
					<li>
						<strong>438 Markdown files</strong> with <strong>84,184 Markdown lines</strong>
					</li>
				</ul>

				<h2 id="quick-start-overview">Quick start overview</h2>

				<p>
					The deployer workflow is sequential. At a high level, you'll create a config template,
					validate it, create the environment, provision infrastructure, configure and release
					artifacts, run services, and then test the deployment.
				</p>

				<p>If you want to see the CLI help, you can run:</p>

				<CodeBlock lang="bash" code={`docker run --rm torrust/tracker-deployer:latest --help`} />

				<p>
					For a complete tutorial with practical examples and provider-specific notes, read:
					<a href="/blog/deploying-torrust-tracker-with-the-deployer"
						>Deploying the Torrust Tracker Demo with the Torrust Tracker Deployer</a
					>.
				</p>

				<p>
					You can also inspect the final generated configuration and deployment artifacts in the
					<a href="https://github.com/torrust/torrust-tracker-demo"
						>Torrust Tracker Demo repository</a
					>. It is useful for learning the extra maintenance and operational tasks that happen after
					the initial deployment.
				</p>

				<h2 id="whats-next">What's next</h2>

				<p>
					We'll continue improving automation coverage, provider integrations, and deployment
					ergonomics. As adoption grows, we'll prioritize issues reported by users running real
					environments.
				</p>

				<ul>
					<li>Better support for production patterns that still need manual intervention</li>
					<li>Expanded provider and deployment scenario documentation</li>
					<li>Iterative UX improvements in commands, validation, and recovery guidance</li>
				</ul>

				<h2 id="how-you-can-help">How you can help</h2>

				<p>
					If you run a tracker, test infrastructure workflows, or simply want to help improve
					deployment tooling in the BitTorrent ecosystem, your feedback is extremely valuable.
				</p>

				<ul>
					<li>
						Try v0.1.0 in your own environment and share your experience by opening an
						<a href="https://github.com/torrust/torrust-tracker-deployer/issues">issue</a>
					</li>
					<li>
						Report bugs or unclear documentation in
						<a href="https://github.com/torrust/torrust-tracker-deployer/issues">issues</a>
					</li>
					<li>Contribute improvements in code, docs, or tests via pull requests</li>
				</ul>

				<p>
					Thanks to everyone who tested early versions and helped shape this first release. Onward
					to the next iteration.
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
