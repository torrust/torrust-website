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
	import Image from '$lib/components/atoms/Image.svelte';
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
					We are excited to announce that the new <strong>Torrust Tracker Demo</strong> is live and publicly
					accessible. You can connect to it right now:
				</p>

				<ul>
					<li>
						<strong>HTTP tracker:</strong>
						<code>https://http1.torrust-tracker-demo.com:443/announce</code>
					</li>
					<li>
						<strong>UDP tracker:</strong>
						<code>udp://udp1.torrust-tracker-demo.com:6969/announce</code>
					</li>
				</ul>

				<p>
					Everything is open and documented. If there is something you cannot find, ask us and we
					will publish it — we want this to be genuinely useful for anyone who wants to set up their
					own tracker.
				</p>

				<h2 id="background">Background: The Combined Torrust Demo</h2>

				<p>
					For the past couple of years we have been running the
					<a href="https://github.com/torrust/torrust-demo">Torrust Demo</a>, a combined Tracker +
					Index solution hosted on a Digital Ocean droplet. The demo index is still available at
					<a href="https://index.torrust-demo.com/torrents">index.torrust-demo.com/torrents</a>, and
					the tracker it uses is linked to it so that every uploaded torrent automatically includes
					the demo tracker URL.
				</p>

				<p>
					That combined demo has been invaluable. Running under sustained real-world load exposed
					bugs that were simply impossible to catch in a local development environment or with
					synthetic benchmarks. We fixed many issues that would otherwise have slipped through to
					final releases.
				</p>

				<h2 id="why-we-split">Why We Split the Demo</h2>

				<p>
					In July 2025, we
					<a href="https://github.com/torrust/torrust-demo/issues/79"
						>decided to separate the combined demo into two independent projects</a
					> — one focused purely on the Tracker, and one focused on the Index. The main reasons were:
				</p>

				<ul>
					<li>
						<strong>Cleaner onboarding:</strong> people only interested in the tracker no longer need
						to wade through index-specific setup and documentation.
					</li>
					<li>
						<strong>Independent lifecycle:</strong> we can deploy, update, migrate, and scale each demo
						on its own schedule without any coupling. We could already update individual services via
						Docker Compose, but full separation gives us much more freedom — for example, to move the
						tracker to a beefier machine if load demands it.
					</li>
					<li>
						<strong>Load isolation:</strong> tracker traffic no longer affects index demo performance,
						and vice versa.
					</li>
					<li>
						<strong>Cleaner tracker-only example:</strong> once we wanted a pure tracker showcase, keeping
						the tracker inside the same repo as the index example would have created confusion.
					</li>
				</ul>

				<h2 id="building-the-deployer-first">Building the Deployer First</h2>

				<p>
					When we started the migration in September 2025, we made a deliberate choice: instead of
					simply spinning up a new server and copying the application over (a few hours of work), we
					would first build a tool that automates the entire deployment. That is what became the
					<a href="https://github.com/torrust/torrust-tracker-deployer">Torrust Tracker Deployer</a
					>.
				</p>

				<p>
					Deploying the new Torrust Tracker Demo was the final end-to-end test for the deployer. We
					ran through the full deployment using the tool and recorded every detail:
				</p>

				<Callout type="info">
					All deployment notes, decisions, and commands are preserved in the repository:
					<a
						href="https://github.com/torrust/torrust-tracker-deployer/tree/main/docs/deployments/hetzner-demo-tracker"
						>github.com/torrust/torrust-tracker-deployer/tree/main/docs/deployments/hetzner-demo-tracker</a
					>
				</Callout>

				<p>
					The deployer is nearly complete, but we have not published an official release yet — the
					tracker demo was the production shake-out. A dedicated blog post about the deployment
					process, including every bug we hit, every decision we made, and how we resolved each
					issue, is coming soon.
				</p>

				<h2 id="the-new-setup">The New Demo Setup</h2>

				<p>
					The new demo runs on <a href="https://www.hetzner.com/">Hetzner</a>, a German cloud
					provider. The repository for the demo is
					<a href="https://github.com/torrust/torrust-tracker-demo"
						>github.com/torrust/torrust-tracker-demo</a
					>, and all server configuration details are shared there publicly.
				</p>

				<h3 id="key-differences">Key Differences from the Previous Demo</h3>

				<p>
					The previous demo tracker (<code>udp://tracker.torrust-demo.com:6969/announce</code>) used
					SQLite as its database backend. That was a deliberate choice when we set it up — we wanted
					to keep things simple. After running it for over two years, we wanted to try something
					different with the new standalone demo:
				</p>

				<ul>
					<li>
						<strong>MySQL instead of SQLite:</strong> we switched to MySQL to test tracker performance
						and stability with a relational database under production load. The SQLite demo taught us
						a lot; now we want the same insight for MySQL.
					</li>
					<li>
						<strong>IPv6 support:</strong> the previous demo was IPv4-only. The new demo includes IPv6
						from the start, which required custom routing configuration on the server — more on that in
						an upcoming dedicated post.
					</li>
				</ul>

				<h3 id="observability">Observability: Prometheus and Grafana</h3>

				<p>
					The tracker is instrumented with <a href="https://prometheus.io/">Prometheus</a> and we
					have set up three <a href="https://grafana.com/">Grafana</a> dashboards to monitor it in real
					time:
				</p>

				<ul>
					<li>
						<strong>Overview dashboard:</strong> completed downloads, number of torrents, seeders, leechers,
						UDP announce requests/s, and HTTP announce requests/s.
					</li>
					<li>
						<strong>UDP tracker dashboard:</strong> connections/s, announces/s, scrapes/s, errors/s, average
						connect/announce/scrape times, banned requests/s, requests and responses/s, banned IPs, and
						aborted requests/s.
					</li>
					<li>
						<strong>HTTP tracker dashboard:</strong> announces/s and scrapes/s.
					</li>
				</ul>

				<Image
					src="/images/posts/new-torrust-tracker-demo/01-tracker-overview.webp"
					alt="Grafana overview dashboard showing completed downloads, torrents, seeders, leechers, UDP announce requests/s, and HTTP announce requests/s"
				/>

				<Image
					src="/images/posts/new-torrust-tracker-demo/02-udp-tracker-1.webp"
					alt="Grafana UDP tracker dashboard showing connections/s, announces/s, scrapes/s, errors/s, average connect/announce/scrape times, banned requests/s, requests and responses/s, banned IPs, and aborted requests/s"
				/>

				<Image
					src="/images/posts/new-torrust-tracker-demo/03-http-tracker-1.webp"
					alt="Grafana HTTP tracker dashboard showing announces/s and scrapes/s"
				/>

				<p>
					You can see a practical walkthrough of this exact kind of setup in our earlier post,
					<a href="/blog/visualize-tracker-metrics-prometheus-grafana"
						>Visualize Tracker Metrics with Prometheus and Grafana</a
					>.
				</p>

				<h2 id="newtrackon">Submitted to Newtrackon</h2>

				<p>
					Both trackers have been submitted to <a href="https://newtrackon.com/">newtrackon.com</a>,
					a public tracker monitoring service that continuously checks tracker availability and
					measures uptime.
				</p>

				<Image
					src="/images/posts/new-torrust-tracker-demo/newtrackon-trackers.webp"
					alt="Newtrackon listing showing both the HTTP and UDP Torrust Tracker Demo trackers"
				/>

				<h3 id="ipv6-uptime-caveat">A Note on UDP Tracker Uptime</h3>

				<Callout type="info">
					The UDP tracker uptime on Newtrackon is currently lower than expected because we had a
					problem with the IPv6 configuration after deployment. UDP packets sent to an IPv6 address
					need special routing rules on the server to ensure replies leave via the same network
					interface they arrived on — if this is not configured correctly, responses are dropped.
					The issue has since been fixed and the uptime will recover as Newtrackon continues to
					monitor the tracker. A dedicated article covering the IPv6 floating IP setup in full
					detail is coming soon.
				</Callout>

				<h2 id="why-we-share">Why We Share All of This</h2>

				<p>
					We believe that a healthy software ecosystem is built on more than just good tools. It
					also requires:
				</p>

				<ul>
					<li>Responsive support — quick bug fixes and clear communication</li>
					<li>Thorough documentation — not just API docs, but real operational guides</li>
					<li>
						Integration with the broader ecosystem — connecting to the services people already use
					</li>
				</ul>

				<p>
					Running our own demo lets us do all three by "eating our own cooking". Specifically, it
					allows us to:
				</p>

				<ul>
					<li>Test the tracker under real, sustained load in a production environment</li>
					<li>Catch bugs before they reach official releases</li>
					<li>
						Experience the pain of our own software first-hand and use that to drive improvements
					</li>
					<li>
						Publish documented infrastructure — which is, frankly, still rare in the open-source
						world
					</li>
				</ul>

				<h3 id="building-for-ai-agents">An Extra Reason: Building for AI Agents</h3>

				<p>
					As AI-augmented programming becomes mainstream, it is increasingly important to provide
					concrete, comprehensive examples that agents can reason about. Both the
					<a href="https://github.com/torrust/torrust-tracker-deployer">Torrust Tracker Deployer</a>
					and the
					<a href="https://github.com/torrust/torrust-tracker-demo">Torrust Tracker Demo</a>
					repositories contain detailed, well-structured documentation about how to set up the Torrust
					Tracker in a real production environment, integrated with:
				</p>

				<ul>
					<li>Prometheus for metrics collection</li>
					<li>Grafana for dashboards and alerting</li>
					<li>Backup services for data durability</li>
					<li>A reverse proxy for TLS termination</li>
				</ul>

				<p>
					Whether you are a human engineer or an AI agent reading this documentation, our goal is
					the same: give you everything you need to go from zero to a running, monitored, production
					tracker. We also wrote more about this philosophy in our post
					<a href="/blog/building-with-ai-agents-building-for-ai-agents"
						>Building with AI Agents, Building for AI Agents</a
					>.
				</p>

				<h2 id="whats-next">What's Next</h2>

				<p>This post is the first in a short series. The following articles are planned:</p>

				<ul>
					<li>
						<strong>Deployment deep-dive:</strong> a detailed look at the full deployment of the demo
						— every decision, every problem we hit, and how we resolved it.
					</li>
					<li>
						<strong>IPv6 with a floating IP:</strong> how to correctly configure IPv6 on a Hetzner server
						with a floating IP, including the asymmetric routing problem that affects UDP trackers and
						how to solve it.
					</li>
					<li>
						<strong>Submitting a tracker to Newtrackon:</strong> what Newtrackon requires from a tracker,
						tips for debugging "UDP Timeout" and similar errors, and how to verify your tracker is answering
						correctly before submitting.
					</li>
				</ul>

				<p>
					Stay tuned, and as always — if you have questions, open an issue in the relevant
					repository or reach out to the community. We read everything.
				</p>

				<h2 id="summary">Summary</h2>

				<Image
					src="/images/posts/new-torrust-tracker-demo/infographic-summary.webp"
					alt="Infographic summarising the new Torrust Tracker Demo: infrastructure, observability, IPv6, MySQL, and the Torrust Tracker Deployer"
				/>
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

	/* ── Layout ──────────────────────────────────────────── */

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

	/* ── Typography ──────────────────────────────────────── */

	h2 {
		font-size: 1.8rem;
		font-weight: bold;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem;
	}

	h3 {
		font-size: 1.5rem;
		font-weight: bold;
		padding-top: 1.25rem;
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

	code {
		background-color: rgba(0, 0, 0, 0.3);
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
		font-size: 0.9em;
	}

	.content-preview > p,
	.content-preview > ul,
	.content-preview > h2,
	.content-preview > h3 {
		margin-bottom: 1rem;
	}

	/* ── Related posts ───────────────────────────────────── */

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

	/* ── Responsive wrapper + TOC ────────────────────────── */

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
