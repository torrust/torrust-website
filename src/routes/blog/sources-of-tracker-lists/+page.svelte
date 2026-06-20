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
					A BitTorrent tracker is a crucial piece of infrastructure that coordinates peers in the
					swarm. Without one, clients cannot discover each other and the torrent effectively becomes
					unreachable. While modern BitTorrent clients support peer discovery through DHT, PEX, and
					magnet links, having a healthy set of working trackers in your torrent file or client
					configuration significantly improves download speeds and reliability.
				</p>
				<p>
					The challenge is that public trackers come and go — some disappear, others change
					addresses, and new ones emerge. Keeping your tracker list up to date is an ongoing task.
					Fortunately, several community-maintained resources do this work for you. This article
					surveys the most reliable sources for finding active public BitTorrent tracker lists.
				</p>

				<Callout type="info">
					<strong>New to trackers?</strong> If you are unsure what a BitTorrent tracker is or how it
					works, check out our guide
					<a href="/blog/what-is-a-bittorent-tracker">What Is a BitTorrent Tracker?</a> for a complete
					introduction.
				</Callout>

				<h2 id="ngosang-trackerslist">ngosang/trackerslist</h2>
				<ul>
					<li>
						<strong>Repository:</strong>
						<a
							href="https://github.com/ngosang/trackerslist"
							target="_blank"
							rel="noopener noreferrer">github.com/ngosang/trackerslist</a
						>
					</li>
					<li>
						<strong>Stars:</strong> 54k+ ⭐
					</li>
					<li>
						<strong>Last updated:</strong> Daily
					</li>
				</ul>
				<p>
					The most popular public tracker list on the internet. Maintained by Diego Heras (ngosang),
					this GitHub repository is updated daily by an automated bot that tests each tracker and
					sorts them by popularity and latency. It is the go-to source for anyone who needs a
					curated list of working public trackers.
				</p>
				<p>The repository provides several distinct lists:</p>

				<table>
					<thead>
						<tr>
							<th>List</th>
							<th>Trackers</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>trackers_best.txt</code></td>
							<td>20</td>
							<td>Top-performing trackers with the best uptime and latency</td>
						</tr>
						<tr>
							<td><code>trackers_all.txt</code></td>
							<td>76</td>
							<td>All active trackers, any protocol, sorted by performance</td>
						</tr>
						<tr>
							<td><code>trackers_all_udp.txt</code></td>
							<td>43</td>
							<td>UDP-only trackers</td>
						</tr>
						<tr>
							<td><code>trackers_all_http.txt</code></td>
							<td>19</td>
							<td>HTTP-only trackers</td>
						</tr>
						<tr>
							<td><code>trackers_all_https.txt</code></td>
							<td>14</td>
							<td>HTTPS-only trackers</td>
						</tr>
						<tr>
							<td><code>trackers_all_ws.txt</code></td>
							<td>1</td>
							<td>WebSocket (WebTorrent) trackers</td>
						</tr>
						<tr>
							<td><code>trackers_all_i2p.txt</code></td>
							<td>13</td>
							<td>I2P trackers (requires I2P router)</td>
						</tr>
						<tr>
							<td><code>trackers_all_yggdrasil.txt</code></td>
							<td>1</td>
							<td>Yggdrasil network trackers</td>
						</tr>
						<tr>
							<td><code>trackers_all_ip.txt</code></td>
							<td>47</td>
							<td>All trackers with IP addresses instead of domains (avoids DNS issues)</td>
						</tr>
					</tbody>
				</table>

				<p>
					The bot automatically removes trackers that point to the same domain or IP address, and it
					maintains a <a
						href="https://github.com/ngosang/trackerslist/blob/master/blacklist.txt"
						target="_blank"
						rel="noopener noreferrer">blacklist</a
					> of known unreliable entries. Each list is also available through CDN mirrors (jsDelivr and
					GitHub Pages), making them easy to consume programmatically.
				</p>

				<h3 id="how-to-use-ngosang">How to Use ngosang/trackerslist</h3>
				<p>
					You can add the trackers to your torrent client manually, or use one of the many community
					scripts that automate the process. Popular options include:
				</p>
				<ul>
					<li>
						<a
							href="https://github.com/GerryFerdinandus/bittorrent-tracker-editor"
							target="_blank"
							rel="noopener noreferrer">bittorrent-tracker-editor</a
						>
						— adds trackers to
						<code>.torrent</code> files
					</li>
					<li>
						<a
							href="https://github.com/stefantalpalaru/deluge-default-trackers"
							target="_blank"
							rel="noopener noreferrer">deluge-default-trackers</a
						> — Deluge plugin
					</li>
					<li>
						<a
							href="https://github.com/blind-oracle/transmission-trackers"
							target="_blank"
							rel="noopener noreferrer">transmission-trackers</a
						> — Python script for Transmission
					</li>
					<li>
						<a
							href="https://github.com/Jorman/Scripts#addqbittorrenttrackerssh"
							target="_blank"
							rel="noopener noreferrer">qbittorrent bash script</a
						> — adds trackers to qBittorrent
					</li>
				</ul>
				<p>
					You can also fetch the lists directly from the raw GitHub URLs or the CDN mirrors and
					incorporate them into your own tooling.
				</p>

				<h2 id="newtrackon">newTrackon</h2>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://newtrackon.com" target="_blank" rel="noopener noreferrer"
							>https://newtrackon.com</a
						>
					</li>
					<li>
						<strong>Source:</strong>
						<a
							href="https://github.com/CorralPeltzer/newTrackon"
							target="_blank"
							rel="noopener noreferrer">github.com/CorralPeltzer/newTrackon</a
						>
					</li>
				</ul>
				<p>
					newTrackon is a meta-tracker service that continuously monitors the uptime of public
					BitTorrent trackers. It probes each tracker every few minutes and publishes the results,
					including an uptime percentage based on the last 1000 checks. Unlike ngosang's list, which
					is a static snapshot, newTrackon provides a live view of tracker health.
				</p>
				<p>Key features that make newTrackon particularly useful for tracker list curation:</p>
				<ul>
					<li>
						<strong>Real-time monitoring</strong> — each tracker is probed at regular intervals, so you
						can see not just whether a tracker is working now, but how reliable it has been over time.
					</li>
					<li>
						<strong>Uptime filtering</strong> — the
						<a href="https://newtrackon.com/list" target="_blank" rel="noopener noreferrer">/list</a
						>
						page provides a client-ready list of all trackers with over 95% uptime.
					</li>
					<li>
						<strong>Community submissions</strong> — anyone can submit a tracker URL for inclusion. The
						service validates the submission with a live probe before adding it to the list.
					</li>
					<li>
						<strong>Raw data endpoint</strong> — the
						<a href="https://newtrackon.com/raw" target="_blank" rel="noopener noreferrer">/raw</a>
						page exposes the latest connection attempt result for every tracked tracker, useful for debugging
						and automation.
					</li>
				</ul>

				<p>
					For a practical walkthrough on submitting your own tracker to newTrackon, including how to
					handle the one-tracker-per-IP constraint and configure BEP34 DNS records, see our
					dedicated guide:
					<a href="/blog/submitting-trackers-to-newtrackon">Submitting Trackers to newTrackon</a>.
				</p>

				<h2 id="xiu2-trackerslistcollection">XIU2/TrackersListCollection</h2>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://trackerslist.com" target="_blank" rel="noopener noreferrer"
							>https://trackerslist.com</a
						>
					</li>
					<li>
						<strong>Repository:</strong>
						<a
							href="https://github.com/XIU2/TrackersListCollection"
							target="_blank"
							rel="noopener noreferrer">github.com/XIU2/TrackersListCollection</a
						>
					</li>
					<li>
						<strong>Stars:</strong> 3k+ ⭐
					</li>
					<li>
						<strong>Last updated:</strong> Daily
					</li>
				</ul>
				<p>
					Another well-maintained and frequently updated tracker list. The project aggregates
					trackers from multiple upstream sources — including ngosang/trackerslist, newTrackon, and
					several others — into a single curated collection. It is a good alternative if you want a
					broader set of trackers without having to combine lists yourself.
				</p>
				<p>The available lists include:</p>
				<table>
					<thead>
						<tr>
							<th>List</th>
							<th>Trackers</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>best.txt</code></td>
							<td>80</td>
							<td>Top-performing trackers across all protocols</td>
						</tr>
						<tr>
							<td><code>all.txt</code></td>
							<td>129</td>
							<td>Complete collection from all upstream sources</td>
						</tr>
						<tr>
							<td><code>http.txt</code></td>
							<td>58</td>
							<td>HTTP and HTTPS trackers only</td>
						</tr>
						<tr>
							<td><code>nohttp.txt</code></td>
							<td>70</td>
							<td>Non-HTTP trackers (UDP and WebSocket)</td>
						</tr>
					</tbody>
				</table>

				<h2 id="other-community-sources">Other Community Sources</h2>

				<h3 id="torrust-discussion">Torrust Tracker Discussion</h3>
				<ul>
					<li>
						<strong>Discussion:</strong>
						<a
							href="https://github.com/torrust/torrust-tracker/discussions/650"
							target="_blank"
							rel="noopener noreferrer">torrust/torrust-tracker#650</a
						>
					</li>
				</ul>
				<p>
					The Torrust project maintains a
					<a
						href="https://github.com/torrust/torrust-tracker/discussions/650"
						target="_blank"
						rel="noopener noreferrer">community discussion</a
					> on GitHub where tracker operators and users share working public trackers. This is a good
					place to find new trackers that may not yet appear in the larger automated lists, as well as
					to discuss tracker reliability and configuration with other community members.
				</p>

				<h3 id="torrent-clients">Built-in Tracker Lists in Torrent Clients</h3>
				<p>
					Most modern BitTorrent clients include a default list of public trackers that they add to
					torrents automatically. These lists are maintained by the client developers and are often
					a good starting point:
				</p>
				<ul>
					<li>
						<strong>qBittorrent</strong> — includes an option to automatically add trackers from ngosang's
						list to new torrents.
					</li>
					<li>
						<strong>Transmission</strong> — ships with a built-in list of public trackers in its source
						code.
					</li>
					<li>
						<strong>Deluge</strong> — supports tracker lists via plugins like
						<a
							href="https://github.com/stefantalpalaru/deluge-default-trackers"
							target="_blank"
							rel="noopener noreferrer">deluge-default-trackers</a
						>.
					</li>
					<li>
						<strong>BiglyBT</strong> — includes support for I2P and other alternative network trackers.
					</li>
				</ul>

				<h2 id="how-to-choose-a-tracker-list">How to Choose a Tracker List</h2>
				<p>
					With multiple sources available, here are some factors to consider when deciding which
					tracker list to use:
				</p>

				<table>
					<thead>
						<tr>
							<th>Factor</th>
							<th>ngosang/trackerslist</th>
							<th>newTrackon</th>
							<th>XIU2/TrackersListCollection</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><strong>Update frequency</strong></td>
							<td>Daily (automated bot)</td>
							<td>Continuous (live probes)</td>
							<td>Daily (aggregates multiple sources)</td>
						</tr>
						<tr>
							<td><strong>Protocol filters</strong></td>
							<td>Separate lists per protocol</td>
							<td>Single list, protocol varies</td>
							<td>HTTP-only, non-HTTP, and combined</td>
						</tr>
						<tr>
							<td><strong>Uptime tracking</strong></td>
							<td>No (presence only)</td>
							<td>Yes (percentage + history)</td>
							<td>No (aggregation only)</td>
						</tr>
						<tr>
							<td><strong>Client-ready</strong></td>
							<td>Raw text files</td>
							<td>95%+ uptime filter at /list</td>
							<td>Raw text files</td>
						</tr>
						<tr>
							<td><strong>Submit new trackers</strong></td>
							<td>Via GitHub issues</td>
							<td>Web form with live validation</td>
							<td>Closed (no longer accepts submissions)</td>
						</tr>
						<tr>
							<td><strong>IP-based lists</strong></td>
							<td>Yes (avoids DNS issues)</td>
							<td>No</td>
							<td>No</td>
						</tr>
						<tr>
							<td><strong>Alternative networks</strong></td>
							<td>I2P, Yggdrasil, WebSocket</td>
							<td>Mainstream only</td>
							<td>Mainstream only</td>
						</tr>
					</tbody>
				</table>

				<p>
					For most users, <strong>ngosang/trackerslist</strong> is the best choice: it is well
					maintained, offers per-protocol lists, and provides IP-based alternatives for environments
					with DNS problems. Use <strong>newTrackon</strong> when you care about long-term uptime
					data or want to verify the reliability of a specific tracker before adding it to your
					configuration.
					<strong>XIU2/TrackersListCollection</strong> is a convenient option if you want a broader set
					of trackers aggregated from multiple sources with minimal effort.
				</p>

				<Callout type="info">
					<strong>Privacy note:</strong> HTTPS trackers encrypt the announce request (including the info
					hash) in transit, while UDP trackers send it in plaintext. If privacy is a concern, prefer HTTPS
					trackers over UDP ones. Note that the tracker operator will always see your IP address — that
					is inherent to how the protocol works.
				</Callout>

				<h2 id="automating-tracker-updates">Automating Tracker Updates</h2>
				<p>
					If you run a torrent client on a server (for example, a seedbox or a home NAS), you can
					automate the process of keeping your tracker list fresh. A typical approach:
				</p>
				<ol>
					<li>Set up a cron job or systemd timer to download the latest list daily.</li>
					<li>Parse the list and update your client's tracker configuration.</li>
					<li>Use one of the community scripts linked above for your specific client.</li>
				</ol>
				<p>
					If you run a <a
						href="https://github.com/torrust/torrust-tracker"
						target="_blank"
						rel="noopener noreferrer">Torrust Tracker</a
					>, you can enable both UDP and HTTP/S protocols simultaneously by adding multiple server
					blocks in the configuration file:
				</p>

				<pre><code
						>[[udp_trackers]]
bind_address = "0.0.0.0:6969"

[[http_trackers]]
bind_address = "0.0.0.0:7070"</code
					></pre>

				<p>
					Each protocol gets its own announce URL (for example <code
						>udp://your-server:6969/announce</code
					>
					and <code>https://your-server:7070/announce</code>). You can add both to your torrent
					files or client configuration. The tracker also supports an
					<a
						href="https://github.com/torrust/torrust-tracker/blob/develop/docs/adrs/20260617093046_reject_wildcard_external_ip.md"
						target="_blank"
						rel="noopener noreferrer"><code>external_ip</code></a
					>
					config option: when a peer announces from the same machine (<code>127.0.0.1</code>), the
					tracker replaces their loopback address with this public IP so other peers in the swarm
					can reach them.
				</p>

				<Callout type="info">
					<strong>Running your own tracker?</strong> Torrust Tracker supports both UDP and HTTP/S
					protocols. See the
					<a
						href="https://github.com/torrust/torrust-tracker"
						target="_blank"
						rel="noopener noreferrer">Torrust Tracker repository</a
					>
					for setup instructions, or check out our
					<a href="/blog/deploying-torrust-to-production">deployment guide</a> to take your tracker into
					production.
				</Callout>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					Keeping your tracker list up to date is essential for a healthy BitTorrent experience.
					Whether you use ngosang's comprehensive daily-updated lists, newTrackon's live uptime
					monitoring, or a combination of both, these community resources save you from the tedious
					task of manually testing and updating trackers.
				</p>
				<p>
					The ecosystem around public tracker lists is active and well maintained. Bookmark these
					sources, set up automation if you run a server, and check back periodically — the list of
					working trackers changes every day.
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

	pre {
		background-color: rgba(0, 0, 0, 0.3);
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		margin: 1rem 0;

		code {
			background: none;
			padding: 0;
		}
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
	.content-preview > h3 {
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
