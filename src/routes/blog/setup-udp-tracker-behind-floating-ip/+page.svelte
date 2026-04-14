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
				<h2 id="introduction">Introduction</h2>
				<p>
					In this article, we document how we configured the server for the
					<a href="https://github.com/torrust/torrust-tracker-demo">Torrust Tracker Demo</a>
					to run a UDP tracker behind a floating IP on Ubuntu.
				</p>
				<p>
					The same approach applies to other cloud providers where floating IPs are called
					<strong>static IPs</strong>, <strong>reserved IPs</strong>, or
					<strong>elastic IPs</strong>. The naming changes, but the network behavior is the same.
				</p>

				<h2 id="why-this-matters">Why This Matters</h2>
				<p>
					Using floating IPs is a common strategy to isolate infrastructure from public endpoint
					addresses. It lets you replace, resize, or rebuild the internal server while keeping the
					same public DNS records and tracker announce URLs.
				</p>
				<p>
					For HTTP services this is usually straightforward. For UDP trackers, there is an extra
					requirement: the response must come back from the same public IP that received the
					request. If replies leave via another source IP, many clients treat it as a timeout.
				</p>

				<Callout type="warning">
					<strong>Core problem:</strong> with default routing, packets that arrive via floating IP A can
					leave through primary IP B. This asymmetric path is enough to break UDP tracker probes.
				</Callout>

				<h2 id="tested-environment">Tested Environment</h2>
				<ul>
					<li><strong>Cloud provider:</strong> Hetzner Cloud</li>
					<li><strong>OS:</strong> Ubuntu 24.04 LTS</li>
					<li>
						<strong>Tracker endpoint:</strong>
						<code>udp://udp1.torrust-tracker-demo.com:6969/announce</code>
					</li>
					<li><strong>Floating IPv4:</strong> <code>116.202.177.184</code></li>
					<li><strong>Floating IPv6:</strong> <code>2a01:4f8:1c0c:828e::1</code></li>
					<li><strong>Container stack:</strong> Docker + Docker Compose</li>
				</ul>

				<h2 id="architecture-summary">Architecture Summary</h2>
				<table>
					<thead>
						<tr>
							<th>Layer</th>
							<th>What must happen</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>DNS</td>
							<td>UDP tracker domain resolves to dedicated floating IPs</td>
						</tr>
						<tr>
							<td>Firewall</td>
							<td>UDP port 6969 allowed on IPv4 and IPv6</td>
						</tr>
						<tr>
							<td>Kernel routing</td>
							<td>Source policy routing for each floating IP</td>
						</tr>
						<tr>
							<td>Docker IPv6</td>
							<td>ip6tables enabled and bridge network has IPv6 subnet</td>
						</tr>
						<tr>
							<td>NAT (IPv6)</td>
							<td>SNAT replies to the floating IPv6 for UDP/6969</td>
						</tr>
					</tbody>
				</table>

				<h2 id="step-1-policy-routing">Step 1: Configure Policy Routing for Floating IPs</h2>
				<p>
					For every floating IP, add a source-based routing policy so replies use the matching
					public address. On our server we persist this in <code
						>/etc/netplan/60-floating-ip.yaml</code
					>.
				</p>

				<CodeBlock
					lang="yaml"
					code={`network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      addresses:
        - 116.202.177.184/32
        - 2a01:4f8:1c0c:828e::1/64
      routing-policy:
        - from: 116.202.177.184
          table: 100
        - from: 2a01:4f8:1c0c:828e::1
          table: 200
      routes:
        - to: default
          via: 172.31.1.1
          table: 100
        - to: default
          via: fe80::1
          table: 200`}
				/>

				<CodeBlock
					lang="bash"
					code={`sudo netplan apply
ip rule list
ip route show table 100
ip -6 rule list
ip -6 route show table 200`}
				/>

				<Callout type="info">
					If you use cloud-init, keep your custom floating-IP and routing rules in a separate
					netplan file with a higher numeric prefix (for example, <code>60-floating-ip.yaml</code>)
					rather than editing <code>50-cloud-init.yaml</code>.
				</Callout>

				<h2 id="step-2-open-udp-port">Step 2: Open UDP Port 6969 in the Firewall</h2>
				<p>
					In our investigation, one blocker was firewall path behavior on IPv6. The server had
					<code>ufw</code> in default deny mode, and UDP 6969 was not explicitly allowed.
				</p>
				<p>
					Important nuance: with Docker, published ports on IPv4 are often reachable even when
					<code>ufw</code> looks restrictive, because Docker installs its own NAT and forwarding
					rules. That does <strong>not</strong> guarantee equivalent behavior for IPv6 in every setup.
					For this reason, verify IPv4 and IPv6 paths separately instead of assuming both families behave
					the same way.
				</p>

				<CodeBlock
					lang="bash"
					code={`sudo ufw allow 6969/udp
sudo ufw status verbose`}
				/>

				<p>
					Expected result includes both <code>6969/udp</code> and <code>6969/udp (v6)</code> as
					<code>ALLOW IN</code>. Treat this as one control in a layered setup, not as the only
					explanation for reachability.
				</p>

				<h2 id="step-3-docker-ip6tables">Step 3: Enable Docker ip6tables Management</h2>
				<p>
					Docker frequently handles IPv4 iptables automatically, but IPv6 behavior depends on daemon
					settings and network topology. To keep IPv6 UDP handling predictable across restarts,
					enable ip6tables in Docker.
				</p>

				<CodeBlock
					lang="json"
					code={`{
  "ip6tables": true
}`}
				/>

				<p>Add it to <code>/etc/docker/daemon.json</code>, then restart Docker:</p>

				<CodeBlock
					lang="bash"
					code={`sudo systemctl restart docker
sudo ip6tables -L ufw6-user-input -n`}
				/>

				<h2 id="step-4-enable-ipv6-in-docker-network">
					Step 4: Enable IPv6 on the Docker Bridge Network
				</h2>
				<p>
					If the bridge network has no IPv6 subnet, containers only get IPv4 addresses. In that
					case, native IPv6 UDP forwarding can fail. We solved this by enabling IPv6 in the Docker
					network.
				</p>

				<CodeBlock
					lang="yaml"
					code={`proxy_network:
  driver: bridge
  enable_ipv6: true
  ipam:
    config:
      - subnet: "fd01:db8:1::/64"`}
				/>

				<CodeBlock
					lang="bash"
					code={`cd /opt/torrust
docker compose down
docker compose up -d
docker inspect tracker --format '{{range .NetworkSettings.Networks}}{{.GlobalIPv6Address}} {{end}}'
sudo ip6tables -t nat -L DOCKER -n -v | grep 6969`}
				/>

				<h2 id="step-5-snat-for-ipv6-replies">Step 5: Add SNAT for IPv6 UDP Replies</h2>
				<p>
					After enabling IPv6 inside Docker, replies can still leave with the primary IPv6 because
					of MASQUERADE behavior. For floating IPv6 UDP endpoints, add an explicit SNAT rule.
				</p>

				<CodeBlock
					lang="text"
					code={`# /etc/ufw/before6.rules
# NAT: rewrite source of Docker UDP tracker IPv6 replies to the floating IP
*nat
:POSTROUTING ACCEPT [0:0]
-A POSTROUTING -s fd01:db8:1::/64 -o eth0 -p udp --sport 6969 \\
    -j SNAT --to-source 2a01:4f8:1c0c:828e::1
COMMIT`}
				/>

				<CodeBlock
					lang="bash"
					code={`sudo ufw reload
sudo ip6tables -t nat -L POSTROUTING -n -v | grep 6969`}
				/>

				<h2 id="verification-checklist">Verification Checklist</h2>
				<ol>
					<li>
						Domain points to the correct floating IPs: <code>dig A</code> and <code>dig AAAA</code>.
					</li>
					<li>Firewall allows UDP 6969 on both families.</li>
					<li>Policy rules and custom tables are active after reboot.</li>
					<li>Container has a non-empty IPv6 on the bridge network.</li>
					<li>DNAT and SNAT counters increase when probes run.</li>
					<li>Tracker accepts announces and replies from the expected source IP.</li>
				</ol>

				<CodeBlock lang="bash" code={`sudo tcpdump -i eth0 -n udp port 6969 -v`} />

				<p>
					For external validation, we used
					<a href="https://newtrackon.com/">newTrackon</a>
					and the raw status page at <a href="https://newtrackon.com/raw">newtrackon.com/raw</a>.
				</p>

				<h2 id="cloud-provider-equivalents">Cloud Provider Naming Equivalents</h2>
				<p>The same server-side setup is useful across providers, even if naming differs.</p>
				<table>
					<thead>
						<tr>
							<th>Provider</th>
							<th>Typical name</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Hetzner</td>
							<td>Floating IP</td>
						</tr>
						<tr>
							<td>DigitalOcean</td>
							<td>Reserved IP</td>
						</tr>
						<tr>
							<td>AWS</td>
							<td>Elastic IP</td>
						</tr>
						<tr>
							<td>Linode/Akamai</td>
							<td>Static IP</td>
						</tr>
					</tbody>
				</table>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					To run a UDP tracker reliably behind floating IPs, you need more than DNS and a port
					mapping. You need symmetric routing, correct IPv6 firewall behavior, container IPv6
					networking, and explicit SNAT when floating IPv6 is involved.
				</p>
				<p>
					This is exactly how we fixed the Torrust Tracker Demo deployment on Hetzner Ubuntu. In a
					follow-up update, we can extend this article with packet-flow diagrams and
					provider-specific adaptations for DigitalOcean, AWS, and Linode.
				</p>

				<h2 id="related-reading">Related Reading</h2>
				<p>
					If you want broader context around this setup, these articles cover the full deployment
					story, newTrackon requirements, and the demo infrastructure decisions.
				</p>
				<ul>
					<li>
						<a href="/blog/deploying-torrust-tracker-with-the-deployer"
							>Deploying the Torrust Tracker Demo with the Torrust Tracker Deployer</a
						>
					</li>
					<li>
						<a href="/blog/submitting-trackers-to-newtrackon">Submitting Trackers to newTrackon</a>
					</li>
					<li>
						<a href="/blog/new-torrust-tracker-demo">The New Torrust Tracker Demo Is Live</a>
					</li>
					<li>
						<a href="/blog/introducing-the-torrust-tracker-deployer"
							>Introducing the Torrust Tracker Deployer</a
						>
					</li>
					<li>
						<a href="/blog/visualize-tracker-metrics-prometheus-grafana"
							>Visualize Tracker Metrics with Prometheus and Grafana</a
						>
					</li>
				</ul>

				<h2 id="source-links-and-references">Source Links and References</h2>
				<p>
					The following links were used during investigation and documentation. Local files are
					listed with absolute paths exactly as provided.
				</p>
				<ul>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/deployments/hetzner-demo-tracker/post-provision/ipv6-udp-tracker-issue.md"
							>https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/deployments/hetzner-demo-tracker/post-provision/ipv6-udp-tracker-issue.md</a
						>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/providers/hetzner/post-deployment.md"
							>https://github.com/torrust/torrust-tracker-deployer/blob/main/docs/user-guide/providers/hetzner/post-deployment.md</a
						>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker-deployer/issues/407"
							>https://github.com/torrust/torrust-tracker-deployer/issues/407</a
						>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker-deployer/issues/414"
							>https://github.com/torrust/torrust-tracker-deployer/issues/414</a
						>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker-demo/blob/main/docs/issues/ISSUE-2-udp-tracker-down-on-newtrackon.md"
							>https://github.com/torrust/torrust-tracker-demo/blob/main/docs/issues/ISSUE-2-udp-tracker-down-on-newtrackon.md</a
						>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker-demo/blob/main/docs/post-mortems/2026-03-09-udp-ipv6-docker.md"
							>https://github.com/torrust/torrust-tracker-demo/blob/main/docs/post-mortems/2026-03-09-udp-ipv6-docker.md</a
						>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker-demo/blob/main/docs/docker-ipv6.md"
							>https://github.com/torrust/torrust-tracker-demo/blob/main/docs/docker-ipv6.md</a
						>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker-demo/issues/2"
							>https://github.com/torrust/torrust-tracker-demo/issues/2</a
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

	/* Layout */

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

	/* Typography */

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

	ul,
	ol {
		display: flex;
		flex-direction: column;
		list-style-type: disc;
		margin: 0;
		padding-left: 1.5rem;
		word-break: keep-all;
	}

	ol {
		list-style-type: decimal;
	}

	ul li,
	ol li {
		margin: 0.25rem 0;
		word-break: keep-all;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	th,
	td {
		padding: 0.6rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.15);
		text-align: left;
		color: rgba(245, 245, 245, 0.8);
	}

	th {
		background-color: rgba(0, 0, 0, 0.3);
		font-weight: 600;
	}

	.content-preview > p,
	.content-preview > ul,
	.content-preview > ol,
	.content-preview > h2 {
		margin-bottom: 1rem;
	}

	/* Related posts */

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

	/* Responsive wrapper + TOC */

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
