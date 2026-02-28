<script lang="ts">
	let { data } = $props();
	let currentPost = $derived(data.currentPost);
	let allPosts = $derived(data.allPosts);
	import Toc from '$lib/components/atoms/Toc.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
	import Callout from '$lib/components/molecules/Callout.svelte';
	import CodeBlock from '$lib/components/molecules/CodeBlock.svelte';
	import Image from '$lib/components/atoms/Image.svelte';
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
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
					The Torrust Tracker has taken a significant leap forward with a newly added feature: the
					ability to export its statistics in the <strong>Prometheus</strong> format. This update
					enables admins to visualize tracker metrics seamlessly using <strong>Grafana</strong>. As
					this has been a highly requested feature, we’re excited to share its details and how you
					can set it up in your own environment.
				</p>
				<p>
					With this addition, the Torrust Tracker provides better insights into its performance and
					behavior, paving the way for more informed decision-making and robust tracker management.
				</p>
				<h2 id="setting-up-prometheus-and-grafana">Setting Up Prometheus and Grafana</h2>
				<p>
					To make the integration process as smooth as possible, we’ve updated the <a
						href="https://github.com/torrust/torrust-demo">Torrust Demo repository</a
					>
					with the necessary <strong>Docker Compose</strong> configuration. By following the provided
					documentation, you can quickly set up a monitoring stack that includes Prometheus and Grafana.
				</p>
				<p>
					We will not include instructions about how to install Prometheus and Grafana. Please
					follow the official documentation. We will only highlight some things to consider.
				</p>
				<p>
					This is the new services added to the docker compose configuration we are using in the
					live demo:
				</p>

				<CodeBlock
					lang="yml"
					code={`grafana:
  image: grafana/grafana:11.4.0
  container_name: grafana
  restart: unless-stopped
  environment:
    - GF_SECURITY_ADMIN_USER=\${GF_SECURITY_ADMIN_USER:-admin}
    - GF_SECURITY_ADMIN_PASSWORD=\${GF_SECURITY_ADMIN_PASSWORD:-admin}
  networks:
    - backend_network
  ports:
    - '3100:3000'
  volumes:
    - grafana_data:/var/lib/grafana
  depends_on:
    - prometheus\n
prometheus:
  image: prom/prometheus:v3.0.1
  container_name: prometheus
  tty: true
  restart: unless-stopped
  networks:
    - backend_network
  ports:
    - '9090:9090' # This port should not be exposed to the internet
  volumes:
    - ./storage/prometheus/etc:/etc/prometheus:Z
  logging:
  options:
    max-size: '10m'
    max-file: '10'
  depends_on:
    - tracker\n
volumes:
  grafana_data: {}`}
				/>

				<Callout type="warning">
					You have to provide a docker compose environment variable <code
						>GF_SECURITY_ADMIN_PASSWORD</code
					>
					with the password for the Grafana <code>admin</code> user.
				</Callout>

				<p>
					The <code>Nginx</code> service was also changed a little bit to make sure it&#39;s started after
					the Grafana container. We need that to server Grafana via Nginx (to use HTTPs).
				</p>

				<CodeBlock
					lang="yml"
					code={`proxy:
  # The rest of the configuration is the same ...
  depends_on:
    - index-gui
    - index
    - tracker
    - grafana`}
				/>

				<p>The Prometheus configuration is very simple. We only need to set the Tracker URL.</p>

				<CodeBlock
					lang="yml"
					code={`global:
  scrape_interval: 15s # How often to scrape metrics\n
scrape_configs:
  - job_name: 'tracker_metrics'
    metrics_path: '/api/v1/stats'
    params:
      token: ['MyAccessToken']
      format: ['prometheus']
    static_configs:
      - targets: ['tracker:1212']`}
				/>

				<Callout type="warning">
					Be aware Prometheus does not have authentication and the configuration includes the
					Tracker API token. To avoid exposing the token you need to close the Prometheus port (<code
						>9090</code
					>) in the server firewall.
				</Callout>

				<p>
					If you want to setup <a href="https://grafana.com/tutorials/run-grafana-behind-a-proxy/"
						>Grafana behind the Nginx proxy</a
					>
					as we do you will also need to change the
					<a
						href="https://github.com/torrust/torrust-demo/blob/main/share/container/default/config/nginx.conf"
						>Nginx configuration</a
					>.
				</p>
				<p>
					Please, follow the latest <a
						href="https://grafana.com/tutorials/run-grafana-behind-a-proxy/"
						>Grafana documentation for configuration using a reverse proxy</a
					>.
				</p>

				<Callout type="info">
					To generate the Let's Encrypt certificate you will need to enable Grafana on port 80
					temporarily. The process is the same as the one described in the <a
						href="https://torrust.com/blog/deploying-torrust-to-production"
						>Deploying Torrust to Production</a
					> blog post.
				</Callout>

				<h2 id="visualizing-metrics">Visualizing Metrics</h2>
				<p>
					Once the setup is complete, you’ll have access to essential tracker statistics. The stats
					are imported into Prometheus from the Tracker via the REST API.
				</p>
				<p>
					Endpoint with the new format: <a
						href="https://127.0.0.1/api/v1/stats?token=MyAccessToken&amp;format=prometheus"
						>https://127.0.0.1/api/v1/stats?token=MyAccessToken&amp;format=prometheus</a
					>
				</p>

				<CodeBlock
					lang="text"
					code={`torrents 250966
seeders 71116
completed 3395
leechers 201896
tcp4_connections_handled 0
tcp4_announces_handled 0
tcp4_scrapes_handled 0
tcp6_connections_handled 0
tcp6_announces_handled 0
tcp6_scrapes_handled 0
udp4_connections_handled 2692635
udp4_announces_handled 7015031
udp4_scrapes_handled 129299
udp4_errors_handled 2418729
udp6_connections_handled 0
udp6_announces_handled 0
udp6_scrapes_handled 0
udp6_errors_handled 0`}
				/>

				<p>
					<a href="https://github.com/torrust/torrust-tracker/issues/1128"
						>We are considering adding new metrics</a
					>.
				</p>

				<Callout type="warning">
					The new format for the endpoint is not yet stable. We could change the data returned by
					the endpoint in the Prometheus format
				</Callout>

				<p>Some changes that might be introduced in the future are:</p>
				<ul>
					<li>
						Changing the names. See <a href="https://prometheus.io/docs/practices/naming/"
							>recommendations</a
						>.
					</li>
					<li>
						Adding labels. See: <a href="https://prometheus.io/docs/concepts/data_model/"
							>data model</a
						>.
					</li>
				</ul>
				<p>
					Once Prometheus and Grafana are configured you can create new dashboards. These dashboards
					provide actionable insights to optimize tracker performance and identify potential issues.
				</p>
				<p>Sample dashboard after running the demo tracker for 3 hours:</p>

				<Image
					src="/images/posts/visualize-tracker-metrics-prometheus-grafana/tracker-stats-visualized-with-grafana-dashboard.webp"
					alt="Sample dashboard in Grafana"
				/>

				<h2 id="future-plans-and-challenges">Future Plans and Challenges</h2>
				<p>
					While the current implementation is a step forward, we recognize the need for further
					enhancements:
				</p>
				<ol>
					<li>
						<strong>Adding More Metrics</strong>: We’re actively working on expanding the range of
						metrics to provide even deeper insights into tracker operations.
					</li>
					<li>
						<strong>User-Specific Statistics</strong>: Private trackers often require detailed user
						statistics, but integrating this with Prometheus and Grafana poses scalability
						challenges. Handling thousands of users with numerous stats per user could impact
						tracker performance and slow down data imports via the API.
					</li>
				</ol>
				<h3 id="-exploring-alternatives-"><strong>Exploring Alternatives</strong></h3>
				<p>We’re exploring potential solutions to overcome these limitations, such as:</p>
				<ul>
					<li>Dedicated database systems for user statistics.</li>
					<li>Event-driven architectures to handle metrics in real-time.</li>
				</ul>
				<p>
					We invite the community to share ideas and propose alternative approaches to ensure the
					tracker remains efficient and scalable.
				</p>
				<h2 id="call-for-community-input">Call for Community Input</h2>
				<p>
					Your feedback is crucial in shaping the future of the Torrust Tracker. Here’s how you can
					get involved:
				</p>
				<ul>
					<li>
						<strong>Join the Discussion</strong>: Participate in our
						<a href="https://github.com/torrust/torrust-tracker/discussions">GitHub discussions</a>
						to share your thoughts on improving
						<a href="https://github.com/torrust/torrust-tracker/discussions/820"
							>tracker statistics</a
						>.
					</li>
					<li>
						<strong>Propose Metrics</strong>: Let us know what additional metrics would benefit you
						as a tracker admin.
					</li>
					<li>
						<strong>Suggest Alternatives</strong>: If you’re familiar with tools that could better
						handle large-scale user statistics, we want to hear about them.
					</li>
				</ul>
				<p>
					Together, we can continue to enhance the Torrust Tracker and meet the evolving needs of
					our community. Let’s build a more robust and insightful tracker experience!
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
			padding-top: 0rem;
		}
	}
</style>
