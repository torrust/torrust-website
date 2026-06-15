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
				<h2 id="tldr">TL;DR</h2>
				<p>
					We found a production bottleneck where one CPU core was saturated by kernel packet work (<code
						>softirq</code
					>) while other cores still had spare capacity.
				</p>

				<h3 id="current-load-snapshot">Current Load Snapshot</h3>
				<p>
					To keep this report actionable, we also captured a fresh live sample from the server while
					the service stayed healthy.
				</p>
				<CodeBlock
					lang="bash"
					code={`echo "=== uptime ===" && uptime && echo "=== cpu ===" && mpstat -P ALL 1 1 && echo "=== memory ===" && free -h`}
				/>
				<p>Latest observed values:</p>
				<ul>
					<li>
						Load average: <code>11.71 / 11.91 / 11.48</code> (also sampled at
						<code>12.16 / 11.99 / 11.50</code>)
					</li>
					<li>CPU2 softirq: <code>48.48%</code></li>
					<li>All-CPU softirq: <code>29.63%</code></li>
					<li>All-CPU idle: <code>18.52%</code></li>
					<li>Memory available: <code>27 GiB</code> of <code>30 GiB</code></li>
				</ul>
				<p>
					This reinforces the same conclusion: the packet-processing hotspot remains controlled and
					distributed, while total host load remains high enough to justify separate capacity
					follow-up.
				</p>
				<p>We ran two isolated experiments:</p>
				<ol>
					<li>Disable HTTP/3 (QUIC) on Caddy by removing UDP 443.</li>
					<li>Enable RPS/RFS to spread packet receive processing across all CPUs.</li>
				</ol>
				<p>Results:</p>
				<ul>
					<li>Disabling HTTP/3 did not improve the one-core softirq hotspot.</li>
					<li>Enabling RPS/RFS reduced CPU2 <code>%soft</code> from ~100% to ~48.51%.</li>
					<li>The improvement persisted at T+1h and T+next-day checkpoints.</li>
					<li>
						Global host load remained high (<code>11.83 / 11.59 / 10.82</code>), so we treated this
						as a distribution fix, not a full capacity fix.
					</li>
				</ul>

				<Callout type="warning">
					<strong>Clarification (updated):</strong> Disabling HTTP/3 (QUIC) on the Caddy edge proxy
					was <strong>not</strong> the root-cause fix for the one-core bottleneck. It was an earlier
					experiment that had no material impact on the softirq hotspot. The actual remediation was
					enabling RPS/RFS packet steering. See the
					<a href="#phase-2-disable-http3">Phase 2</a> and
					<a href="#phase-3-enable-rps-rfs">Phase 3</a> sections below for the evidence.
					<br /><br />
					<strong>Protocol boundary note:</strong> Clients can connect to the edge proxy via HTTP/3
					while the proxy communicates with backend services over existing HTTP transport. Backend
					native HTTP/3 support is <em>not</em> required to offer HTTP/3 at the edge. Whether to
					enable or disable HTTP/3 at the proxy should be treated as a product/operations choice
					guided by monitoring, not as a default performance lever.
					<br /><br />
					See
					<a href="https://github.com/torrust/torrust-tracker-demo/issues/31"
						>torrust-tracker-demo#31</a
					>
					for the rationale on re-enabling edge HTTP/3, and
					<a href="https://github.com/torrust/torrust-tracker/issues/1736">torrust-tracker#1736</a>
					for tracking native HTTP/3 support in the tracker.
				</Callout>

				<h2 id="what-problem-we-detected">What Problem We Detected</h2>
				<p>
					The tracker host was under sustained CPU pressure. Standard process-level checks showed
					high utilization, but one pattern stood out: kernel networking work was concentrated on
					CPU2.
				</p>
				<ul>
					<li><code>mpstat</code> repeatedly showed CPU2 pinned in <code>%soft</code>.</li>
					<li><code>ksoftirqd/2</code> appeared near the top CPU consumers.</li>
					<li>
						User-space load was real, but the single-core kernel hotspot was the main anomaly.
					</li>
				</ul>
				<p>
					For context, <code>softirq</code> is kernel-side packet processing work. If this work is not
					distributed well, one core can saturate even when the machine still has available cores.
				</p>

				<h3 id="initial-htop-snapshot">Initial htop Snapshot (Before Patch)</h3>
				<p>
					This is the initial screenshot where CPU2 was pinned at 100% usage during the softirq
					hotspot.
				</p>
				<div class="image-block">
					<Image
						src="/images/posts/how-we-fixed-a-one-core-packet-processing-bottleneck-in-torrust-tracker/htop-before-rps-rfs.png"
						alt="Initial htop snapshot showing CPU2 pinned at 100 percent usage"
					/>
					<p class="caption">
						Before patch: CPU2 was saturated, indicating concentrated packet-processing load.
					</p>
				</div>

				<h2 id="method-one-variable-at-a-time">Method: One Variable at a Time</h2>
				<p>
					To avoid ambiguous conclusions, we changed one thing per phase and compared snapshots
					using the same metrics:
				</p>
				<ul>
					<li><code>mpstat -P ALL 1 1</code> for per-CPU softirq distribution.</li>
					<li>
						<code>ps -eo pid,comm,%cpu,%mem,stat --sort=-%cpu | head -20</code> for top CPU processes.
					</li>
					<li><code>docker stats --no-stream</code> for container-level CPU snapshots.</li>
					<li>Prometheus HTTP/UDP request rates to keep traffic context comparable.</li>
					<li>External endpoint checks from <code>newtrackon.com/raw</code>.</li>
				</ul>

				<h2 id="phase-2-disable-http3">Phase 2: Disable HTTP/3 (QUIC)</h2>
				<p>
					Hypothesis: UDP 443 (HTTP/3) on Caddy might be adding packet-processing pressure. We
					removed only that UDP publish and restarted Caddy.
				</p>

				<CodeBlock
					lang="diff"
					code={`ports:
  - "80:80"
  - "443:443"
- - "443:443/udp"`}
				/>

				<CodeBlock lang="bash" code={`docker compose up -d caddy`} />

				<p>Selected checkpoint after this phase:</p>
				<CodeBlock
					lang="text"
					code={`T+next-day (2026-05-05T06:16:14Z)
CPU2 %soft=98.02, %idle=1.98
caddy=308.89%, tracker=93.22%
HTTP1 rate=1909.11 req/s, UDP1 rate=2178.98 req/s
HTTP1/UDP1 external status: Working`}
				/>

				<p>
					Conclusion: disabling HTTP/3 did not change the one-core softirq bottleneck. This
					experiment confirmed that QUIC packet processing on UDP 443 was not the driver of the
					hotspot. Enabling or disabling HTTP/3 at the edge proxy should be treated as a separate
					product/operations decision — see the
					<a href="https://github.com/torrust/torrust-tracker-demo/issues/31">follow-up rationale</a
					>
					for re-enabling it.
				</p>

				<h2 id="phase-3-enable-rps-rfs">Phase 3: Enable RPS/RFS</h2>
				<p>
					Next hypothesis: packet receive-side work was not being distributed across CPUs. Before
					the change, steering was effectively disabled.
				</p>

				<CodeBlock
					lang="text"
					code={`net.core.rps_sock_flow_entries = 0
/sys/class/net/eth0/queues/rx-0/rps_cpus = 00
/sys/class/net/eth0/queues/rx-0/rps_flow_cnt = 0`}
				/>

				<p>We applied the live test change:</p>
				<CodeBlock
					lang="bash"
					code={`sudo sysctl -w net.core.rps_sock_flow_entries=32768
echo ff | sudo tee /sys/class/net/eth0/queues/rx-0/rps_cpus
echo 4096 | sudo tee /sys/class/net/eth0/queues/rx-0/rps_flow_cnt`}
				/>

				<p>Immediate post-change snapshot:</p>
				<CodeBlock
					lang="text"
					code={`Post-change (2026-05-05T06:55:40Z)
all CPUs: %soft=30.15
CPU2: %soft=48.51, %idle=9.90
other CPUs: %soft distributed across ~24-33%

caddy=411.88%, tracker=123.77%, mysql=9.67%
pre  HTTP=1912.99 req/s, UDP=2234.14 req/s
post HTTP=1926.15 req/s, UDP=2207.48 req/s
HTTP1/UDP1 external status: Working`}
				/>

				<p>
					At T+1h and T+next-day, CPU2 remained around <code>49.48-49.49%</code> softirq and load stayed
					distributed. This confirms RPS/RFS removed the one-core packet hotspot.
				</p>

				<h3 id="post-patch-htop-snapshot">htop Snapshot After Patch</h3>
				<p>
					After enabling RPS/RFS, load was distributed across CPUs instead of being concentrated on
					CPU2.
				</p>
				<div class="image-block">
					<Image
						src="/images/posts/how-we-fixed-a-one-core-packet-processing-bottleneck-in-torrust-tracker/htop-after-rps-rfs.png"
						alt="htop snapshot after RPS and RFS patch showing load distributed among CPUs"
					/>
					<p class="caption">After patch: packet-processing pressure is spread across cores.</p>
				</div>

				<h2 id="why-this-did-not-fully-solve-load">Why This Did Not Fully Solve Host Load</h2>
				<p>
					RPS/RFS solved <strong>distribution</strong>, not <strong>demand</strong>. The host still
					ran with high global load averages after the fix. In other words, the previous failure
					mode (single-core saturation) was mitigated, but total workload pressure remained near
					capacity.
				</p>
				<p>
					Even with high server load, observed tracker availability on NewTrackon stayed above
					<strong>99%</strong>. This is an important distinction: high load reduced headroom, but
					service quality remained strong during the observation window.
				</p>
				<ul>
					<li>
						<code>udp://udp1.torrust-tracker-demo.com:6969/announce</code>: latency
						<code>21 ms</code>
					</li>
					<li>
						<code>https://http1.torrust-tracker-demo.com:443/announce</code>: latency
						<code>29 ms</code>
					</li>
				</ul>
				<p>
					At peak, we are handling about <code>1200 UDP req/s</code> and a little over
					<code>2200 HTTP req/s</code>.
				</p>
				<h3 id="traffic-over-last-15-days">Traffic Over the Last 15 Days</h3>
				<p>
					This Grafana Generic Tracker Dashboard screenshot shows announce requests per second over
					the last 15 days for both UDP1 and HTTP1 trackers.
				</p>
				<div class="image-block">
					<Image
						src="/images/posts/how-we-fixed-a-one-core-packet-processing-bottleneck-in-torrust-tracker/grafana-announce-requests-udp1-http1-last-15-days.png"
						alt="Grafana dashboard showing announce requests per second for UDP1 and HTTP1 over the last 15 days"
					/>
					<p class="caption">
						Last 15 days: announce request rate trends for
						<code>udp1.torrust-tracker-demo.com</code> and
						<code>http1.torrust-tracker-demo.com</code>.
					</p>
				</div>

				<Callout type="info">
					This is an important operational lesson: eliminating one bottleneck can improve stability
					and fairness across CPUs without creating enough long-term headroom for sustained growth.
				</Callout>

				<h2 id="timeline-checkpoints">Timeline Checkpoints</h2>
				<ul>
					<li><strong>Before changes:</strong> CPU2 repeatedly near <code>100% softirq</code>.</li>
					<li><strong>After HTTP/3 disable:</strong> no meaningful improvement in CPU2 softirq.</li>
					<li>
						<strong>Immediate after RPS/RFS:</strong> CPU2 softirq dropped to <code>48.51%</code>.
					</li>
					<li>
						<strong>T+1h:</strong> distribution remained stable, CPU2 around <code>49.48%</code>.
					</li>
					<li>
						<strong>T+next-day:</strong> distribution persisted, CPU2 around <code>49.49%</code>.
					</li>
				</ul>

				<h2 id="final-operational-decision">Final Operational Decision</h2>
				<ol>
					<li>Keep RPS/RFS enabled permanently on the current host.</li>
					<li>Close the tuning scope in ISSUE-29 as completed.</li>
					<li>Track capacity follow-up separately (scale-up planning in ISSUE-30).</li>
					<li>
						HTTP/3 at the edge proxy is a separate product/operations decision. See
						<a href="https://github.com/torrust/torrust-tracker-demo/issues/31"
							>torrust-tracker-demo#31</a
						>
						for the rationale on re-enabling it, and
						<a href="https://github.com/torrust/torrust-tracker/issues/1736">torrust-tracker#1736</a
						>
						for tracking native HTTP/3 support.
					</li>
				</ol>
				<p>
					The practical outcome is clear: packet-path tuning fixed the single-core bottleneck, and
					capacity planning becomes the next lever for sustained growth.
				</p>

				<h2 id="references">References</h2>
				<ul>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker-demo/tree/main/docs/issues/evidence/ISSUE-29"
							>ISSUE-29 evidence folder</a
						>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker-demo/blob/main/docs/issues/evidence/ISSUE-29/03-draft-blog-post-rps-rfs-softirq-hotspot.md"
							>Primary source draft used for this article</a
						>
					</li>
					<li>
						<a href="/blog/nf-conntrack-overflow-docker-udp-tracker"
							>Related post: nf_conntrack overflow incident and fix</a
						>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker-demo/issues/31"
							>torrust-tracker-demo#31 — Re-enable edge HTTP/3 and document rationale</a
						>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/issues/1736"
							>torrust-tracker#1736 — Document HTTP/3 support via reverse proxy and track native
							HTTP/3 follow-up</a
						>
					</li>
				</ul>
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

	h3 {
		font-size: 1.35rem;
		font-weight: bold;
		padding-top: 1.25rem;
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

	ul,
	ol {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding-left: 1.5rem;
		word-break: keep-all;
	}

	ul {
		list-style-type: disc;
	}

	ol {
		list-style-type: decimal;
	}

	ul li,
	ol li {
		margin: 0.25rem 0;
		word-break: keep-all;
	}

	.content-preview > p,
	.content-preview > h2 {
		margin-bottom: 1rem;
	}

	.image-block {
		padding-top: 1rem;
	}

	.caption {
		font-size: 0.95rem;
		color: rgba(245, 245, 245, 0.72);
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
