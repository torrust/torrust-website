<script lang="ts">
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
	import Callout from '$lib/components/molecules/Callout.svelte';

	let { data } = $props();
	let currentPost = $derived(data.currentPost);
	let allPosts = $derived(data.allPosts);
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
					The Rust programming language has become an increasingly popular choice for building
					high-performance network infrastructure, and BitTorrent trackers are no exception. Rust's
					combination of memory safety, zero-cost abstractions, and fearless concurrency makes it an
					excellent fit for a service that must handle tens of thousands of concurrent connections
					efficiently.
				</p>
				<p>
					This post maps the landscape of BitTorrent tracker implementations written in Rust. We
					cover both projects that are actively maintained and used in production today, and
					historical or experimental projects that are no longer under active development but remain
					valuable as learning resources or starting points. The scope is limited to tracker server
					software — client libraries, DHT nodes, indexers, and other BitTorrent tooling written in
					Rust are outside the scope of this post.
				</p>

				<Callout type="info">
					If you know of a Rust tracker project not listed here, please{' '}
					<a href="https://github.com/torrust/torrust-website/issues">open an issue</a> and we will add
					it.
				</Callout>

				<h2 id="actively-maintained">Actively Maintained Projects</h2>
				<p>
					The following trackers are under active development and have seen commits within the last
					year or two. They are generally suitable for production use.
				</p>

				<h3 id="aquatic">aquatic</h3>
				<ul>
					<li>
						<strong>Repository:</strong>
						<a href="https://github.com/greatest-ape/aquatic"
							>https://github.com/greatest-ape/aquatic</a
						>
					</li>
					<li><strong>Stars:</strong> ~591</li>
					<li><strong>License:</strong> Apache-2.0</li>
					<li><strong>Language:</strong> Rust</li>
					<li><strong>Status:</strong> Maintained (last release ~1 year ago)</li>
				</ul>
				<p>
					aquatic is a high-performance open BitTorrent tracker that covers three transport
					protocols through separate sub-implementations:
				</p>
				<ul>
					<li>
						<strong>aquatic_udp</strong> — BitTorrent over UDP (supports Linux and other Unix-like systems)
					</li>
					<li>
						<strong>aquatic_http</strong> — BitTorrent over HTTP, optionally over TLS (requires Linux
						5.8+)
					</li>
					<li>
						<strong>aquatic_ws</strong> — WebTorrent, optionally over TLS (requires Linux 5.8+)
					</li>
				</ul>
				<p>Features at a glance:</p>
				<ul>
					<li>Multithreaded design for handling large amounts of traffic</li>
					<li>All data stored in-memory (no database needed)</li>
					<li>IPv4 and IPv6 support</li>
					<li>Supports forbidding/allowing info hashes</li>
					<li>Prometheus metrics</li>
					<li>Automated CI testing of full file transfers</li>
				</ul>
				<p>Implemented BEPs:</p>
				<ul>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0003.html">BEP 3</a>: BitTorrent HTTP
						protocol (<code>aquatic_http</code>)
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0007.html">BEP 7</a>: IPv6 support (<code
							>aquatic_http</code
						>)
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0015.html">BEP 15</a>: UDP Tracker Protocol
						(<code>aquatic_udp</code>)
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0023.html">BEP 23</a>: Compact HTTP
						responses (<code>aquatic_http</code>)
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0048.html">BEP 48</a>: HTTP scrape support
						(<code>aquatic_http</code>)
					</li>
				</ul>
				<p>
					aquatic is the most starred Rust tracker on GitHub and is used in production by
					<a href="https://explodie.org/opentracker.html">explodie.org public tracker</a>
					(typically serving ~100,000 requests per second) and
					<a href="https://tracker.webtorrent.dev/">tracker.webtorrent.dev</a>.
				</p>
				<p>
					The HTTP and WebTorrent implementations leverage
					<code>io_uring</code> for exceptional throughput on modern Linux kernels. The UDP load test
					results show aquatic_udp consistently reaching hundreds of thousands of requests per second
					in benchmarks.
				</p>

				<h3 id="torrust-tracker">Torrust Tracker</h3>
				<ul>
					<li>
						<strong>Repository:</strong>
						<a href="https://github.com/torrust/torrust-tracker"
							>https://github.com/torrust/torrust-tracker</a
						>
					</li>
					<li><strong>Stars:</strong> ~490</li>
					<li><strong>License:</strong> AGPL-3.0</li>
					<li><strong>Language:</strong> Rust</li>
					<li><strong>Status:</strong> Actively maintained</li>
					<li><strong>Latest Release:</strong> v3.0.0 (October 2, 2024)</li>
				</ul>
				<p>
					Torrust Tracker is the tracker developed and maintained by the Torrust project (the same
					team behind this website). It is a modern, feature-rich BitTorrent tracker built with the <a
						href="https://github.com/tokio-rs/axum">Axum</a
					> web framework and aims to be respectful of both formal BEP standards and widely adopted de
					facto extensions.
				</p>
				<p>Key features:</p>
				<ul>
					<li>High-quality, well-documented Rust codebase</li>
					<li>Comprehensive suite of unit and functional tests</li>
					<li>Support for UDP, HTTP, and TLS sockets</li>
					<li>Native IPv4 and IPv6 support</li>
					<li>Private and whitelisted mode</li>
					<li>Tracker management REST API</li>
					<li>Support for <a href="https://newtrackon.com/">newTrackon</a> checks</li>
					<li>Persistent SQLite3 or MySQL databases</li>
					<li>Prometheus metrics and Grafana integration</li>
				</ul>
				<p>Implemented BEPs:</p>
				<ul>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0003.html">BEP 3</a>: The BitTorrent
						Protocol
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0007.html">BEP 7</a>: IPv6 Support
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0015.html">BEP 15</a>: UDP Tracker Protocol
						for BitTorrent
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0023.html">BEP 23</a>: Tracker Returns
						Compact Peer Lists
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0027.html">BEP 27</a>: Private Torrents
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0048.html">BEP 48</a>: Tracker Protocol
						Extension: Scrape
					</li>
				</ul>
				<p>
					The project is sponsored by
					<a href="https://github.com/orgs/Nautilus-Cyberneering/">Nautilus Cyberneering</a>
					and welcomes community contributions. A live demo environment is available at
					<a href="https://github.com/torrust/torrust-demo">torrust-demo</a>.
				</p>

				<h3 id="torrust-actix">Torrust-Actix</h3>
				<ul>
					<li>
						<strong>Repository:</strong>
						<a href="https://github.com/Power2All/torrust-actix"
							>https://github.com/Power2All/torrust-actix</a
						>
					</li>
					<li><strong>Stars:</strong> ~133</li>
					<li><strong>License:</strong> MIT</li>
					<li><strong>Language:</strong> Rust</li>
					<li><strong>Status:</strong> Actively maintained</li>
					<li><strong>Latest Release:</strong> v4.1.1</li>
					<li>
						<strong>Website:</strong> <a href="https://www.torrust-actix.com/">torrust-actix.com</a>
					</li>
				</ul>
				<p>
					Torrust-Actix is a lightweight but feature-rich BitTorrent tracker built with the
					<a href="https://actix.rs/">Actix</a> web framework. It originated from Torrust Tracker
					code and was rebuilt from scratch by
					<a href="https://power2all.com/">Power2All</a>. More information is available on the
					<a href="https://www.torrust-actix.com/">Torrust-Actix website</a>.
				</p>
				<p>Highlights:</p>
				<ul>
					<li>Full IPv4 and IPv6 support</li>
					<li>Persistence via SQLite3, MySQL, or PostgreSQL</li>
					<li>Whitelist and blacklist systems for private and public tracking</li>
					<li>Torrent key support for access control</li>
					<li>Built-in Swagger UI for API documentation and testing</li>
					<li>
						Full stand-alone / master / slave cluster mode via WebSockets (introduced in v4.1.0)
					</li>
					<li>Optional Redis/Memcached caching for peer data</li>
					<li>Sentry.io integration (SaaS and self-hosted)</li>
					<li>Cloudflare Simple Proxy Protocol support for UDP</li>
					<li>Docker support with Docker Compose</li>
				</ul>
				<p>Implemented BEPs:</p>
				<ul>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0003.html">BEP 3</a>: The BitTorrent
						Protocol
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0007.html">BEP 7</a>: IPv6 Support
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0015.html">BEP 15</a>: UDP Tracker Protocol
						for BitTorrent
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0023.html">BEP 23</a>: Tracker Returns
						Compact Peer Lists
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0041.html">BEP 41</a>: UDP Tracker Protocol
						Extensions
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0048.html">BEP 48</a>: Tracker Protocol
						Extension: Scrape
					</li>
				</ul>

				<h3 id="unit3d-announce">UNIT3D-Announce</h3>
				<ul>
					<li>
						<strong>Repository:</strong>
						<a href="https://github.com/Roardom/UNIT3D-Announce"
							>https://github.com/Roardom/UNIT3D-Announce</a
						>
					</li>
					<li><strong>Stars:</strong> ~56</li>
					<li><strong>License:</strong> AGPL-3.0</li>
					<li><strong>Language:</strong> Rust</li>
					<li><strong>Status:</strong> Actively maintained</li>
					<li><strong>Latest Release:</strong> v0.3 (September 24, 2025)</li>
				</ul>
				<p>
					UNIT3D-Announce is a high-performance backend BitTorrent tracker designed specifically to
					replace the default PHP announce handler of
					<a href="https://github.com/HDInnovations/UNIT3D-Community-Edition">UNIT3D</a>, a popular
					private tracker platform. It is built with the
					<a href="https://github.com/tokio-rs/axum">Axum</a> framework and offers a dramatic performance
					improvement over the PHP baseline.
				</p>

				<Callout type="info">
					According to the project's own benchmarks, UNIT3D's PHP announce can handle ~250 HTTP
					requests per second per core. UNIT3D-Announce achieves ~50,000 HTTP requests per second
					per core (using wrk), or ~10,000 when placed behind an nginx proxy with TLS — a 200×
					improvement.
				</Callout>

				<p>Key characteristics:</p>
				<ul>
					<li>Drop-in HTTP tracker backend for UNIT3D v9.1.7+</li>
					<li>All peer data stored in-memory</li>
					<li>Hot configuration reload without restart</li>
					<li>Global freeleech and double-upload event support</li>
					<li>Unix socket and TCP socket support</li>
					<li>Supervisor integration for background execution</li>
				</ul>
				<p>
					This tracker is not a general-purpose standalone tracker — it requires a running UNIT3D
					installation and shares its user and torrent database via PostgreSQL.
				</p>

				<h2 id="historical-projects">Historical and Less Active Projects</h2>
				<p>
					The following projects are no longer actively maintained or have seen little to no commits
					in recent years. They are still valuable as references, learning resources, or starting
					points for new implementations.
				</p>

				<h3 id="udpt">UDPT</h3>
				<ul>
					<li>
						<strong>Repository:</strong>
						<a href="https://github.com/naim94a/udpt">https://github.com/naim94a/udpt</a>
					</li>
					<li><strong>Stars:</strong> ~243</li>
					<li><strong>License:</strong> MIT</li>
					<li><strong>Language:</strong> Rust</li>
					<li><strong>Status:</strong> Minimal maintenance (last commit ~2 years ago)</li>
					<li>
						<strong>Latest Release:</strong> v3.1.2 (January 29, 2022)
					</li>
					<li>
						<strong>Website:</strong>
						<a href="https://naim94a.github.io/udpt">naim94a.github.io/udpt</a>
					</li>
				</ul>
				<p>
					UDPT is a UDP-based torrent tracker that fully implements
					<a href="http://www.bittorrent.org/beps/bep_0015.html">BEP 15</a>. It is a complete
					rewrite in Rust of an older C/C++ project originally developed in 2012. While the project
					is no longer actively developed, it was an important early Rust tracker and contributed
					code to both Torrust Tracker and Torrust-Actix.
				</p>
				<p>Features:</p>
				<ul>
					<li>UDP torrent tracking server</li>
					<li>In-memory database</li>
					<li>Dynamic, static, and private tracker modes</li>
					<li>Ability to block specific torrents</li>
					<li>HTTP REST API for management</li>
					<li>Logging</li>
					<li>Windows Service and Linux/Unix daemon support</li>
				</ul>

				<h3 id="tyto">Tyto</h3>
				<ul>
					<li>
						<strong>Repository:</strong>
						<a href="https://github.com/deekerno/tyto">https://github.com/deekerno/tyto</a>
					</li>
					<li><strong>Stars:</strong> ~11</li>
					<li><strong>License:</strong> MIT</li>
					<li><strong>Language:</strong> Rust</li>
					<li><strong>Status:</strong> Abandoned (last commit ~6 years ago)</li>
				</ul>
				<p>
					Tyto is an open source BitTorrent tracker written in Rust with a focus on safety,
					performance, and reliability. It uses <code>async/await</code> throughout. Although abandoned
					before the full feature set was completed, it achieved ~23,000 HTTP requests per second on a
					2017 MacBook Pro in load tests.
				</p>
				<p>Implemented (per README checkboxes):</p>
				<ul>
					<li>Global metrics</li>
					<li>IPv4 and IPv6 support</li>
				</ul>
				<p>Planned but not completed before abandonment:</p>
				<ul>
					<li>Configuration hot-reloading</li>
					<li>Private tracker support</li>
					<li>Storage-agnostic backend</li>
					<li>Swarm statistics</li>
				</ul>

				<h3 id="rotten">Rotten</h3>
				<ul>
					<li>
						<strong>Repository:</strong>
						<a href="https://github.com/justinvzyl/rotten">https://github.com/justinvzyl/rotten</a>
					</li>
					<li><strong>Stars:</strong> ~4</li>
					<li><strong>License:</strong> MIT</li>
					<li><strong>Language:</strong> Rust</li>
					<li><strong>Status:</strong> Abandoned (last commit ~4 years ago)</li>
				</ul>
				<p>
					Rotten is a small, experimental UDP BitTorrent tracker. According to the README it was
					still in active development and not production-ready at the time of the last commit. It
					implements UDP connect and announce but not scrape. Interesting mainly as a minimal
					learning exercise.
				</p>

				<h3 id="bittorrent-client-tracker">bittorrent-client-tracker</h3>
				<ul>
					<li>
						<strong>Repository:</strong>
						<a href="https://github.com/PradaJoaquin/bittorrent-client-tracker"
							>https://github.com/PradaJoaquin/bittorrent-client-tracker</a
						>
					</li>
					<li><strong>Stars:</strong> ~4</li>
					<li><strong>License:</strong> MIT</li>
					<li><strong>Language:</strong> Rust</li>
					<li><strong>Status:</strong> Completed academic project (last commit ~3 years ago)</li>
				</ul>
				<p>
					This repository contains both a BitTorrent client (<em>dTorrent</em>) and a tracker (<em
						>dTracker</em
					>) written in Rust. It was developed as a university project for the subject "Taller de
					Programación I" at FIUBA during the first semester of 2022. While not intended for
					production use, it is a useful reference for anyone learning how to build BitTorrent
					software from scratch in Rust.
				</p>

				<h3 id="torshare-tracker">Torshare Tracker</h3>
				<ul>
					<li>
						<strong>Repository:</strong>
						<a href="https://github.com/torshare/torshare-tracker"
							>https://github.com/torshare/torshare-tracker</a
						>
					</li>
					<li><strong>Stars:</strong> ~3</li>
					<li><strong>License:</strong> MIT</li>
					<li><strong>Language:</strong> Rust</li>
					<li><strong>Status:</strong> Abandoned (last commit ~3 years ago)</li>
				</ul>
				<p>
					Torshare Tracker is a high-performance, multi-protocol BitTorrent tracker that supports
					both HTTP and UDP announcing. It implements Redis-backed high availability. The project
					never published a release and appears to have been abandoned before reaching production
					readiness.
				</p>
				<p>Implemented BEPs:</p>
				<ul>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0003.html">BEP 3</a>: The BitTorrent
						Protocol
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0007.html">BEP 7</a>: IPv6 Tracker
						Extension
					</li>
					<li>
						<a href="http://bittorrent.org/beps/bep_0023.html">BEP 23</a>: Tracker Returns Compact
						Peer Lists
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0031.html">BEP 31</a>: Failure Retry
						Extension
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0041.html">BEP 41</a>: UDP Tracker Protocol
						Extension
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0048.html">BEP 48</a>: Tracker Protocol
						Extension: Scrape
					</li>
				</ul>

				<Callout type="info">
					The repository <a href="https://github.com/csssuf/rt">rt</a> also appeared in searches as a
					Rust tracker but contains almost no public information — no stars, no license, no release, and
					a near-empty README. It is omitted from the comparison table.
				</Callout>

				<h2 id="comparison">Quick Comparison</h2>
				<p>The table below summarises key attributes of the trackers covered in this post.</p>
				<div style="overflow-x: auto;">
					<table>
						<thead>
							<tr>
								<th>Project</th>
								<th>Protocols</th>
								<th>BEPs</th>
								<th>License</th>
								<th>Stars</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><a href="https://github.com/greatest-ape/aquatic">aquatic</a></td>
								<td>HTTP, UDP, WebTorrent</td>
								<td>3, 7, 15, 23, 48</td>
								<td>Apache-2.0</td>
								<td>~591</td>
								<td>Active</td>
							</tr>
							<tr>
								<td><a href="https://github.com/torrust/torrust-tracker">Torrust Tracker</a></td>
								<td>HTTP, UDP, TLS</td>
								<td>3, 7, 15, 23, 27, 48</td>
								<td>AGPL-3.0</td>
								<td>~490</td>
								<td>Active</td>
							</tr>
							<tr>
								<td><a href="https://github.com/naim94a/udpt">UDPT</a></td>
								<td>UDP</td>
								<td>15</td>
								<td>MIT</td>
								<td>~243</td>
								<td>Minimal</td>
							</tr>
							<tr>
								<td><a href="https://github.com/Power2All/torrust-actix">Torrust-Actix</a></td>
								<td>HTTP, UDP</td>
								<td>3, 7, 15, 23, 41, 48</td>
								<td>MIT</td>
								<td>~133</td>
								<td>Active</td>
							</tr>
							<tr>
								<td><a href="https://github.com/Roardom/UNIT3D-Announce">UNIT3D-Announce</a></td>
								<td>HTTP</td>
								<td>3</td>
								<td>AGPL-3.0</td>
								<td>~56</td>
								<td>Active</td>
							</tr>
							<tr>
								<td><a href="https://github.com/deekerno/tyto">Tyto</a></td>
								<td>HTTP</td>
								<td>3, 7 (partial)</td>
								<td>MIT</td>
								<td>~11</td>
								<td>Abandoned</td>
							</tr>
							<tr>
								<td><a href="https://github.com/justinvzyl/rotten">Rotten</a></td>
								<td>UDP</td>
								<td>15 (partial)</td>
								<td>MIT</td>
								<td>~4</td>
								<td>Abandoned</td>
							</tr>
							<tr>
								<td
									><a href="https://github.com/PradaJoaquin/bittorrent-client-tracker">dTracker</a
									></td
								>
								<td>HTTP</td>
								<td>3 (partial)</td>
								<td>MIT</td>
								<td>~4</td>
								<td>Academic</td>
							</tr>
							<tr>
								<td><a href="https://github.com/torshare/torshare-tracker">Torshare</a></td>
								<td>HTTP, UDP</td>
								<td>3, 7, 23, 31, 41, 48</td>
								<td>MIT</td>
								<td>~3</td>
								<td>Abandoned</td>
							</tr>
						</tbody>
					</table>
				</div>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					The Rust ecosystem has produced a diverse set of BitTorrent tracker implementations,
					ranging from production-grade systems handling millions of requests per second to academic
					experiments designed to teach protocol fundamentals.
				</p>
				<p>
					As of early 2026, four projects are actively maintained — aquatic, Torrust Tracker,
					Torrust-Actix, and UNIT3D-Announce. The historical projects, while no longer under active
					development, remain useful references for anyone studying how BitTorrent tracker logic has
					been approached in Rust over the years.
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
		font-size: 0.9rem;
		margin-top: 1rem;
	}

	th,
	td {
		border: 1px solid rgba(255, 255, 255, 0.15);
		padding: 0.5rem 0.75rem;
		text-align: left;
	}

	th {
		background-color: rgba(0, 0, 0, 0.3);
		font-weight: 600;
	}

	tr:nth-child(even) td {
		background-color: rgba(0, 0, 0, 0.15);
	}

	.content-preview > p,
	.content-preview > ul,
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
