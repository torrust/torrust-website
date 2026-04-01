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
					When you run a public BitTorrent tracker, you want people to be able to trust its
					reliability. One of the best ways to demonstrate that trust is to list your tracker on
					<a href="https://newtrackon.com/">newTrackon</a>, a popular third-party service that
					continuously monitors the uptime of public trackers and publishes the results.
				</p>
				<p>
					For the <a href="https://torrust.com/">Torrust</a> project we run demo trackers to showcase
					the software. We wanted to list them on newTrackon so anyone can verify the uptime independently
					— without having to take our word for it. Getting there required understanding a few prerequisites
					and solving a specific constraint, which is what this post is about.
				</p>

				<Callout type="info">
					This post focuses on the practical steps to <strong>submit a tracker to newTrackon</strong
					>. It assumes you already have a working public tracker and a domain name pointing to it.
				</Callout>

				<h2 id="what-is-newtrackon">What is newTrackon?</h2>
				<p>
					<a href="https://newtrackon.com/">newTrackon</a> is a community-driven service that
					maintains a curated list of working public BitTorrent trackers. It periodically probes
					each tracker and calculates an uptime percentage based on the last 1000 attempts. Tracker
					lists from newTrackon are widely used by torrent clients and torrent creators to populate
					the announce URLs in <code>.torrent</code> files.
				</p>
				<p>
					Because it is an independent third party, its uptime data is more credible than anything a
					tracker operator could self-report. If your tracker is listed there and shows high uptime,
					that is a meaningful signal to the BitTorrent community.
				</p>

				<h2 id="prerequisites">Prerequisites</h2>
				<p>
					Before you can submit a tracker, newTrackon checks several conditions. These are
					documented in the <a href="https://newtrackon.com/faq">newTrackon FAQ</a>:
				</p>
				<ol>
					<li>
						<strong>Not already listed by URL or IP.</strong> newTrackon checks both the tracker URL and
						the IP address it resolves to. If either is already in the list, the submission is rejected
						as a duplicate.
					</li>
					<li>
						<strong>Tracker must be working at submission time.</strong> newTrackon performs a live probe
						when you submit. If the tracker does not respond correctly, it will not be added.
					</li>
					<li>
						<strong>Must not deny connections per BEP34.</strong> newTrackon respects the DNS-based
						tracker policy described in
						<a href="https://www.bittorrent.org/beps/bep_0034.html">BEP34</a>. If your DNS TXT
						record indicates the tracker is not available on the submitted port and protocol, the
						submission will be rejected.
					</li>
					<li>
						<strong>Must resolve to a globally routable IP.</strong> Private addresses (e.g.
						<code>192.168.x.x</code>, <code>10.x.x.x</code>), loopback (<code>127.0.0.1</code>), and
						other non-routable addresses are rejected.
					</li>
					<li>
						<strong>Announce interval must be between 5 minutes and 3 hours.</strong> newTrackon
						checks the <code>interval</code> value returned in the tracker's announce response. If
						it is shorter than 5 minutes (300 seconds) or longer than 3 hours (10800 seconds), the
						tracker is rejected. This requirement is described on the{' '}
						<a href="https://newtrackon.com/submitted" target="_blank" rel="noopener noreferrer">
							submitted trackers page
						</a>. In Torrust Tracker, set the interval in your config:
					</li>
				</ol>
				<CodeBlock
					lang="toml"
					code={`[core.announce_policy]\ninterval = 300\ninterval_min = 300`}
				/>

				<p>
					Points 2, 4, and 5 are straightforward. Points 1 and 3 require a bit more planning, which
					is what the rest of this post covers.
				</p>

				<h2 id="one-tracker-per-ip">Constraint: One Tracker per IP</h2>
				<p>
					The first prerequisite has an important implication that is easy to miss: newTrackon
					deduplicates by IP address, not just by URL.
				</p>
				<p>
					This is exactly what happened with our old demo tracker. Both the UDP and HTTP endpoints
					share the same domain and the same IP (<code>144.126.245.19</code>):
				</p>
				<CodeBlock
					lang="text"
					code={`udp://tracker.torrust-demo.com:6969/announce\nhttps://tracker.torrust-demo.com:7070/announce`}
				/>
				<p>
					Even though the URLs are different (different protocol, different port), both resolve to
					the same IP address. Only the first submission was accepted by newTrackon; the second was
					rejected as a duplicate IP. The HTTP tracker at
					<code>https://tracker.torrust-demo.com:7070/announce</code> is therefore not listed — not because
					it is broken, but because newTrackon already has that IP registered from the UDP tracker.
				</p>

				<h3 id="why-this-matters">Why This Matters for Torrust</h3>
				<p>
					The <a href="https://github.com/torrust/torrust-tracker">Torrust Tracker</a> supports running
					multiple tracker protocols — UDP and HTTP/S — from a single process using a single configuration
					file. This is very convenient operationally, but it means both protocols run on the same server
					and therefore share the same IP address.
				</p>
				<p>
					In our demo environment we run both a UDP and an HTTP/S tracker because we want to
					demonstrate both protocols and monitor the uptime of each independently on newTrackon.
					With a single IP, that is not possible.
				</p>

				<h3 id="solution-floating-ips">Solution: Floating IPs</h3>
				<p>
					The solution is to assign a separate IP address to each tracker endpoint you want to list,
					even if they all run on the same physical server.
				</p>
				<p>
					For our new Torrust tracker demo we use
					<a href="https://docs.hetzner.com/cloud/floating-ips/overview/">Hetzner Floating IPs</a>:
					additional IP addresses that can be attached to a server and routed independently. The
					Torrust Tracker process listens on both IPs, but from newTrackon's perspective each
					tracker has its own unique IP.
				</p>

				<table>
					<thead>
						<tr>
							<th>Protocol</th>
							<th>Announce URL</th>
							<th>Domain</th>
							<th>IP</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>HTTP/S</td>
							<td><code>https://http1.torrust-tracker-demo.com:443/announce</code></td>
							<td><code>http1.torrust-tracker-demo.com</code></td>
							<td><code>116.202.176.169</code></td>
						</tr>
						<tr>
							<td>UDP</td>
							<td><code>udp://udp1.torrust-tracker-demo.com:6969/announce</code></td>
							<td><code>udp1.torrust-tracker-demo.com</code></td>
							<td><code>116.202.177.184</code></td>
						</tr>
					</tbody>
				</table>

				<p>
					The two domains resolve to two different floating IPs, so newTrackon treats them as
					independent trackers. DNS verification:
				</p>
				<CodeBlock
					lang="console"
					code={`$ dig http1.torrust-tracker-demo.com\nhttp1.torrust-tracker-demo.com.  IN  A  116.202.176.169\n\n$ dig udp1.torrust-tracker-demo.com\nudp1.torrust-tracker-demo.com.   IN  A  116.202.177.184`}
				/>

				<Callout type="info">
					Hetzner calls these <strong>Floating IPs</strong>. Other hosting providers offer similar
					features under different names: <em>Reserved IPs</em> (DigitalOcean), <em>Static IPs</em>
					(Linode/Akamai), <em>Elastic IPs</em> (AWS), and so on. The principle is the same: a dedicated
					IP routed to your server.
				</Callout>

				<h2 id="bep34-dns-configuration">BEP34: DNS-Based Tracker Policy</h2>
				<p>
					<a href="https://www.bittorrent.org/beps/bep_0034.html">BEP34</a> (DNS Tracker Preferences)
					defines a convention for declaring, via a DNS TXT record, which ports and protocols a host is
					running trackers on. BitTorrent clients and services like newTrackon can read this record to
					validate tracker URLs or discover the correct ports.
				</p>
				<p>
					newTrackon checks this record and will reject a tracker if the BEP34 TXT record explicitly
					excludes the submitted protocol or port.
				</p>

				<h3 id="bep34-syntax">TXT Record Syntax</h3>
				<p>
					The TXT record lives on the tracker's hostname and starts with the keyword
					<code>BITTORRENT</code>, followed by one or more protocol/port declarations:
				</p>
				<ul>
					<li>
						<code>"BITTORRENT"</code> — the host runs <em>no</em> trackers (deny all).
					</li>
					<li>
						<code>"BITTORRENT DENY ALL"</code> — same as above, more readable.
					</li>
					<li>
						<code>"BITTORRENT UDP:6969"</code> — UDP tracker on port 6969.
					</li>
					<li>
						<code>"BITTORRENT TCP:443"</code> — HTTP/S tracker on port 443.
					</li>
					<li>
						<code>"BITTORRENT UDP:6969 TCP:443"</code> — both, UDP preferred.
					</li>
				</ul>
				<p>
					Trackers are listed in order of preference, with the preferred protocol first. Unknown
					words are silently ignored for forward compatibility.
				</p>

				<h3 id="bep34-our-config">Our DNS Configuration</h3>
				<p>
					We configured TXT records on each tracker domain to match the protocols and ports each one
					handles:
				</p>
				<CodeBlock
					lang="console"
					code={`$ dig TXT http1.torrust-tracker-demo.com\n→ "BITTORRENT TCP:443"\n\n$ dig TXT udp1.torrust-tracker-demo.com\n→ "BITTORRENT UDP:6969"\n\n$ dig TXT tracker.torrust-demo.com\n→ "BITTORRENT UDP:6969 TCP:443"`}
				/>
				<p>
					<code>http1.torrust-tracker-demo.com</code> declares only <code>TCP:443</code> because it
					is an HTTP/S-only endpoint. <code>udp1.torrust-tracker-demo.com</code> declares only
					<code>UDP:6969</code>. The older <code>tracker.torrust-demo.com</code> domain runs both protocols
					and declares both.
				</p>

				<Callout type="info">
					BEP34 uses <code>TCP</code> to mean HTTP (and HTTPS). There is no separate
					<code>HTTPS</code> keyword — the port distinguishes HTTP (80) from HTTPS (443).
				</Callout>

				<h2 id="submitting">Submitting to newTrackon</h2>
				<p>
					Once your tracker is running, has a globally routable IP, and has the correct BEP34 TXT
					record, submission is straightforward:
				</p>
				<ol>
					<li>
						Go to <a href="https://newtrackon.com/">https://newtrackon.com/</a> and open the
						<strong>Add</strong> section.
					</li>
					<li>
						Paste your full announce URL (e.g.
						<code>https://http1.torrust-tracker-demo.com:443/announce</code>).
					</li>
					<li>Submit the form.</li>
					<li>
						newTrackon performs a live probe. If all checks pass, the tracker is added to the list
						within a few minutes.
					</li>
					<li>Repeat for each tracker URL you want to list (e.g. your UDP endpoint separately).</li>
				</ol>

				<Callout type="warning">
					Make sure your tracker is <strong>actually responding</strong> at the time of submission. newTrackon
					performs a live check and will not add a tracker that does not respond correctly. Do not submit
					during maintenance windows.
				</Callout>

				<h2 id="troubleshooting">Troubleshooting: Tracker Shows as Down</h2>
				<p>
					Even after a successful submission you may find your tracker showing as down on
					newTrackon. Here is the first case we encountered and how we resolved it.
				</p>

				<h3 id="ipv6-routing">IPv6 Routing with Floating IPs and Docker</h3>
				<p>
					Shortly after we listed <code>udp://udp1.torrust-tracker-demo.com:6969/announce</code>,
					the tracker appeared as ❌ down on newTrackon — even though manual UDP announces from
					external clients worked fine (see
					<a href="https://github.com/torrust/torrust-tracker-demo/issues/2">issue #2</a> and the
					<a href="https://github.com/torrust/torrust-tracker-demo/pull/4">fix PR #4</a>).
				</p>
				<p>
					The key difference from the old demo is that the new demo is <strong>dual-stack</strong>:
					the server has both IPv4 and IPv6 addresses. The old demo was IPv4-only. When we tested
					the tracker from our development machines, everything worked — but our dev machines have
					IPv4 public addresses. newTrackon, however, resolved
					<code>udp1.torrust-tracker-demo.com</code> to the floating IPv6 address (<code
						>2a01:4f8:1c0c:828e::1</code
					>) and sent its probe over IPv6. That probe got no response.
				</p>

				<p>Two root causes were found:</p>

				<h4 id="ipv6-root-cause-a">Root Cause A: Docker wiping ip6tables rules on restart</h4>
				<p>
					By default, Docker sets <code>ip6tables: false</code>. This means Docker does not manage
					its own <code>ip6tables</code> chains. However, every time Docker restarts a container it
					rewrites its <code>iptables</code>/<code>ip6tables</code> chains — and in doing so it can
					flush the live rules that <code>ufw</code> had applied to allow IPv6 UDP port 6969 through
					to the container. After a nightly restart, IPv6 UDP packets were silently dropped even
					though <code>ufw</code> still showed the rule as active.
				</p>
				<p>
					Fix: add <code>/etc/docker/daemon.json</code> with <code>{'{"ip6tables": true}'}</code>.
					Docker then manages <code>ip6tables</code> rules itself for all published ports, mirroring its
					IPv4 behaviour and surviving container restarts.
				</p>

				<h4 id="ipv6-root-cause-b">Root Cause B: Docker bridge network was IPv4-only</h4>
				<p>
					The Docker bridge network had no IPv6 subnet, so containers had no IPv6 address. When an
					IPv6 packet arrived at the floating IP, Docker's proxy tried to relay it to the
					container's IPv4 address — a cross-address-family relay that silently drops UDP packets.
				</p>
				<p>
					Even after giving the container an IPv6 address, there was a second problem: when the
					container replied, Docker's <code>MASQUERADE</code> rule rewrote the source address to the
					server's <em>primary</em> IPv6 (<code>2a01:4f8:1c19:620b::1</code>) rather than the
					<em>floating</em> IPv6 (<code>2a01:4f8:1c0c:828e::1</code>) that the client connected to.
					From the client's point of view the reply came from an unexpected address and looked like
					a timeout.
				</p>
				<p>The packet flow after the fix looks like this:</p>
				<CodeBlock
					lang="text"
					code={`Client → floating IPv6 2a01:4f8:1c0c:828e::1:6969\n       → ip6tables DNAT → container fd01:db8:1::3:6969\n       → container replies\n       → ip6tables SNAT → source rewritten to 2a01:4f8:1c0c:828e::1\n       → client receives reply from the correct address ✅`}
				/>
				<p>Two config changes were required:</p>
				<ol>
					<li>
						Enable IPv6 on the Docker network (<code>enable_ipv6: true</code> + a ULA subnet in
						<code>docker-compose.yml</code>). Docker then creates proper <code>ip6tables DNAT</code>
						rules so packets reach the container natively.
					</li>
					<li>
						Add a <code>SNAT</code> rule in <code>/etc/ufw/before6.rules</code> to rewrite the source
						address of replies back to the floating IPv6, so the client always receives the response from
						the address it originally connected to.
					</li>
				</ol>

				<Callout type="warning">
					If you run a UDP tracker behind Docker and use floating IPs with both IPv4 and IPv6,
					verify the complete packet flow over IPv6: incoming path (DNAT to container), reply path
					(SNAT back to the correct floating IP), and that routing rules survive container restarts.
					Testing only from an IPv4 client will not catch these issues.
				</Callout>

				<h3 id="newtrackon-raw-output">Using the Raw Output to Debug</h3>
				<p>
					newTrackon exposes a public page at{' '}
					<a href="https://newtrackon.com/raw" target="_blank" rel="noopener noreferrer">
						newtrackon.com/raw
					</a>{' '}
					that lists the latest connection attempt results for every tracked tracker. It is updated in
					near-real-time as the monitoring system probes each tracker in rotation.
				</p>
				<p>
					After submitting your tracker, open this page and keep refreshing — your tracker's
					announce URL will appear once newTrackon has completed its first probe. The table columns
					you care about are:
				</p>
				<ul>
					<li>
						<strong>Result</strong> — either <code>Working</code> or <code>Down</code>.
					</li>
					<li>
						<strong>Response / Error</strong> — the raw response dictionary for a working tracker, or
						a short error string for a failing one.
					</li>
				</ul>
				<p>Common error strings you may encounter:</p>
				<ul>
					<li>
						<code>UDP timeout</code> — the probe sent a UDP connect request but received no reply. This
						is what we saw when the IPv6 routing was misconfigured (see above).
					</li>
					<li><code>UDP connection failed</code> — the connection was actively refused.</li>
					<li>
						<code>HTTP timeout</code> / <code>HTTP connection failed</code> — equivalent issues for HTTP/S
						trackers.
					</li>
					<li><code>Can't resolve IP</code> — DNS lookup failed for the tracker's hostname.</li>
				</ul>
				<Callout type="info">
					The raw page shows all tracked trackers intermixed, so your entry can be hard to spot.
					There is currently no built-in filter or search. The most practical approach is to keep
					the page open, use your browser's built-in "Find on page" (<kbd>Ctrl</kbd>+<kbd>F</kbd>),
					and search for your tracker's hostname or announce URL.
				</Callout>

				<h3 id="run-local-newtrackon">Running a Local Copy of newTrackon</h3>
				<p>
					For deeper inspection, you can run your own instance of newTrackon from its source code.
					The project is open source and available at{' '}
					<a
						href="https://github.com/CorralPeltzer/newTrackon"
						target="_blank"
						rel="noopener noreferrer"
					>
						github.com/CorralPeltzer/newTrackon
					</a>.
				</p>
				<p>
					When running locally, the probe output is printed directly to the console — similar to
					what the public <code>/raw</code> endpoint exposes, but without needing to wait for your tracker's
					turn in the full rotation. You can also modify the source code to add extra logging or change
					behavior if you need to dig deeper into a problem.
				</p>
				<Callout type="warning">
					One caveat: by default, newTrackon loads its existing tracker list on startup and begins
					probing all of them. There is no built-in configuration option to suppress this. If you
					only want to test your own tracker, the simplest workaround is to comment out the line in
					the Python source that loads the pre-existing tracker list before starting the server.
				</Callout>

				<h3 id="torrust-tracker-client">Using the Torrust Tracker Client</h3>
				<p>
					The Torrust project includes a console tracker client inside the main tracker repository
					at{' '}
					<a
						href="https://github.com/torrust/torrust-tracker/tree/develop/console/tracker-client"
						target="_blank"
						rel="noopener noreferrer"
					>
						console/tracker-client
					</a>. It lets you send announce and scrape requests directly to a tracker from the command
					line, making it easy to verify that your tracker responds correctly to the same kind of
					requests that newTrackon sends.
				</p>
				<p>
					Because you have access to the full Rust source code, you can also instrument the client
					to print additional protocol-level details that would not normally be visible, which can
					help narrow down subtle routing or response issues.
				</p>
				<Callout type="info">
					The client has not been published as a crate yet and some features are still missing, so
					it may not cover every scenario out of the box. Nevertheless, it is a useful starting
					point for hands-on debugging when the public raw output alone does not give you enough
					information.
				</Callout>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					Getting a tracker listed on newTrackon requires satisfying a handful of prerequisites. The
					one that catches most operators by surprise is the per-IP deduplication rule: if you want
					multiple tracker endpoints listed independently (e.g. UDP and HTTP/S), each must have its
					own unique IP address.
				</p>
				<p>
					For the Torrust demo we solved this with Hetzner floating IPs — one per protocol endpoint
					— along with BEP34-compliant DNS TXT records on each domain. The result is two
					independently monitored tracker entries on newTrackon, providing trustworthy public uptime
					data for both the UDP and HTTP/S endpoints.
				</p>
				<p>
					If you are running a Torrust Tracker instance and want to list it, the same approach
					applies: assign a unique IP per endpoint, configure the BEP34 TXT records, and submit each
					announce URL separately.
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

	h4 {
		font-size: 1.25rem;
		font-weight: bold;
		padding-top: 1rem;
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

	code {
		background-color: rgba(0, 0, 0, 0.3);
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
		font-size: 0.9em;
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
	.content-preview > h2,
	.content-preview > h3,
	.content-preview > h4 {
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
