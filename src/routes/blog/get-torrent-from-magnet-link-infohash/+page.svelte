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
				<h2 id="introduction">Introduction</h2>
				<p>
					If you've spent any time in the BitTorrent ecosystem, you've likely encountered magnet
					links. They're everywhere — on torrent index sites, in chat rooms, and shared between
					users. But sometimes you need the actual <code>.torrent</code> file instead: perhaps for archiving,
					sharing with someone who prefers the old format, seeding on a tracker, or inspecting the metadata
					manually.
				</p>
				<p>
					The core challenge is the same whether you have a magnet link or just a bare infohash: you
					need to <strong>fetch the metadata</strong> from the BitTorrent network. The infohash (a 20-byte
					SHA-1 hash) uniquely identifies a torrent, but it doesn't contain the file list, piece hashes,
					or other metadata — that information lives with peers who have the full torrent. A magnet link
					is simply a convenient URI that packages the infohash along with optional display names and
					tracker URLs.
				</p>
				<p>
					In this guide, we'll explore several methods to obtain a <code>.torrent</code> file from a magnet
					link or infohash, starting with the simplest conceptual building block and building up to the
					most practical everyday tools.
				</p>

				<p>
					Who needs this? If you're a <strong>BitTorrent developer</strong>, you might need the
					<code>.torrent</code> file to inspect metadata during testing.
					<strong>Tracker operators</strong>
					often see only an infohash in their logs and want to know what content it corresponds to.
					<strong>Self-hosters</strong> may need the file to register a torrent on a private
					tracker. And sometimes you just want to <strong>archive the metadata</strong> separately
					from the data — a <code>.torrent</code> file is a few hundred kilobytes, while the actual content
					can be gigabytes.
				</p>

				<Callout type="info">
					<strong>What's in a .torrent file?</strong> The <code>.torrent</code> file contains
					<strong>metadata only</strong> — the file list, piece hashes, piece length, and tracker
					URLs. It does <strong>not</strong> contain the actual file content. You still need a BitTorrent
					client to download the real data using this metadata. Think of it as a recipe describing the
					dish, not the dish itself.
				</Callout>

				<h2 id="what-is-a-magnet-link">What Is a Magnet Link?</h2>
				<p>
					A magnet link is a URI scheme that identifies a torrent by its infohash rather than by a
					file. Here's what a typical magnet link looks like:
				</p>

				<CodeBlock
					lang="text"
					code="magnet:?xt=urn:btih:dafc8c076ca2f3ed376eeae7c76a0d6be2415c45&amp;dn=ubuntu-26.04-desktop-amd64.iso&amp;tr=https%3a%2f%2ftorrent.ubuntu.com%2fannounce&amp;tr=https%3a%2f%2fipv6.torrent.ubuntu.com%2fannounce"
				/>

				<p>Let's break down the components:</p>
				<ul>
					<li>
						<code>xt=urn:btih:&lt;infohash&gt;</code> — The <strong>essential part</strong>.
						<code>xt</code> stands for "exact topic", and <code>urn:btih</code> means this is a BitTorrent
						infohash (version 1). The 40-character hex string is the SHA-1 hash of the torrent's info
						dictionary. Everything else is optional. Base32 encoding (32 characters) is also supported
						for compatibility.
					</li>
					<li>
						<code>dn=&lt;name&gt;</code> — The display name (optional). A human-readable filename for
						convenience before metadata is fetched.
					</li>
					<li>
						<code>tr=&lt;url&gt;</code> — Tracker URLs (optional, repeatable). One or more tracker announce
						URLs to help discover peers.
					</li>
				</ul>

				<p>
					<strong>The key insight:</strong> a bare infohash is all you truly need. If you remove
					everything from the magnet link except <code>xt=urn:btih:&lt;infohash&gt;</code>, you can
					still reconstruct the full magnet link manually. This means any tool or method that works
					with magnet links also works with bare infohashes — you just need to wrap the infohash in
					a minimal magnet URI first.
				</p>

				<h2 id="from-bare-infohash">From a Bare Infohash to a Magnet Link</h2>
				<p>
					Tools like aria2c don't accept a bare infohash directly — they need a magnet link. So if
					all you have is a 40-character hex string like
					<code>dafc8c076ca2f3ed376eeae7c76a0d6be2415c45</code>, the first step is to wrap it in a
					magnet URI. You can do this manually:
				</p>

				<CodeBlock
					lang="bash"
					code={'MAGNET="magnet:?xt=urn:btih:dafc8c076ca2f3ed376eeae7c76a0d6be2415c45"'}
				/>

				<p>For better results, add one or more tracker URLs to help with peer discovery:</p>

				<CodeBlock
					lang="bash"
					code={'MAGNET="magnet:?xt=urn:btih:dafc8c076ca2f3ed376eeae7c76a0d6be2415c45&tr=https%3a%2f%2ftorrent.ubuntu.com%2fannounce&tr=https%3a%2f%2fipv6.torrent.ubuntu.com%2fannounce"'}
				/>

				<p>
					Once you have the magnet link, you can use any of the methods that follow. From this point
					on, there's no difference between a magnet link you constructed from an infohash and one
					you found on a website.
				</p>

				<Callout type="info">
					<strong>Pro tip:</strong> If you don't know which trackers to use, a good fallback is the
					<a href="https://github.com/ngosang/trackerslist">ngosang trackers list</a> or
					<a href="https://newtrackon.com/">newTrackon</a>, both community-maintained collections of
					public BitTorrent trackers. Adding a few reliable trackers significantly increases your
					chances of finding peers.
				</Callout>

				<h2 id="using-aria2c">Method 1: Using aria2c (Recommended)</h2>
				<p>
					<a href="https://aria2.github.io/">aria2</a> is a lightweight, multi-protocol download utility
					that supports BitTorrent with metadata fetching. It's the most straightforward tool for this
					job because it's available on all platforms, requires no GUI, and can be scripted easily.
				</p>

				<h3 id="installation">Installation</h3>
				<p>aria2 can be installed via your system's package manager:</p>

				<CodeBlock
					lang="bash"
					code={`# Debian / Ubuntu
sudo apt install aria2

# macOS (Homebrew)
brew install aria2

# Windows (Chocolatey)
choco install aria2`}
				/>

				<h3 id="basic-command">The Basic Command</h3>
				<p>
					To fetch the <code>.torrent</code> file from a magnet link without downloading the actual data,
					use:
				</p>

				<CodeBlock
					lang="bash"
					code={`aria2c -d /tmp --bt-save-metadata=true --bt-metadata-only=true --follow-torrent=false "magnet:?xt=urn:btih:dafc8c076ca2f3ed376eeae7c76a0d6be2415c45&dn=ubuntu-26.04-desktop-amd64.iso&tr=https%3a%2f%2ftorrent.ubuntu.com%2fannounce&tr=https%3a%2f%2fipv6.torrent.ubuntu.com%2fannounce"`}
				/>

				<p>Let's break down each flag:</p>
				<ul>
					<li>
						<code>-d &lt;directory&gt;</code> — The directory where the <code>.torrent</code> file
						will be saved. Below we use <code>/tmp</code>, but you can change it to any folder.
					</li>
					<li>
						<code>--bt-save-metadata=true</code> — Save the fetched metadata (the
						<code>.torrent</code> file) to disk instead of discarding it after download.
					</li>
					<li>
						<code>--bt-metadata-only=true</code> — Only fetch the metadata, don't download the
						actual file content. This is the key flag that tells aria2 to stop after getting the
						<code>.torrent</code>.
					</li>
					<li>
						<code>--follow-torrent=false</code> — Don't automatically start downloading the torrent after
						fetching the metadata. Without this, aria2 would proceed to download the actual files.
					</li>
				</ul>

				<h3 id="expected-output">Expected Output</h3>
				<p>Here's the real output from a successful run:</p>

				<CodeBlock
					lang="console"
					code={`06/15 16:56:02 [NOTICE] Downloading 1 item(s)
06/15 16:56:02 [NOTICE] IPv4 DHT: listening on UDP port 6966
06/15 16:56:02 [NOTICE] IPv4 BitTorrent: listening on TCP port 6951
06/15 16:56:02 [NOTICE] IPv6 BitTorrent: listening on TCP port 6951
[#3495d8 485KiB/485KiB(100%) CN:43 SD:2]
06/15 16:56:45 [NOTICE] Download complete: [MEMORY][METADATA]ubuntu-26.04-desktop-amd64.iso
06/15 16:56:45 [NOTICE] Saved metadata as /tmp/dafc8c076ca2f3ed376eeae7c76a0d6be2415c45.torrent.`}
				/>

				<p>
					After about 45 seconds, aria2 discovered 43 peers (CN:43) with 2 seeders (SD:2) and saved
					the metadata as a <code>.torrent</code> file. The file is 485 KiB and contains the full torrent
					metadata.
				</p>

				<Callout type="warning">
					<strong>Network requirements:</strong> aria2c opens random UDP and TCP ports for DHT and peer
					connections (as shown in the log output). If you're behind a firewall, VPN, or corporate network
					that blocks outbound peer-to-peer traffic, the metadata fetch may fail or time out. In that
					case, try adding more trackers to the magnet link, or use an online service as a last resort.
				</Callout>

				<h3 id="using-infohash">Using aria2c with a Bare Infohash</h3>
				<p>As shown above, you can construct the magnet link inline:</p>

				<CodeBlock
					lang="bash"
					code={`aria2c -d /tmp --bt-save-metadata=true --bt-metadata-only=true --follow-torrent=false "magnet:?xt=urn:btih:dafc8c076ca2f3ed376eeae7c76a0d6be2415c45&tr=https%3a%2f%2ftorrent.ubuntu.com%2fannounce&tr=https%3a%2f%2fipv6.torrent.ubuntu.com%2fannounce"`}
				/>

				<Callout type="success">
					<strong>Why aria2c is our top recommendation:</strong> It's a single command, works
					identically on Linux, macOS, and Windows, requires no GUI, and can be easily integrated
					into scripts. It's the fastest and most reliable way to get a <code>.torrent</code> file from
					a magnet link.
				</Callout>

				<h2 id="using-hash2torrent">Method 2: Using Torrust Hash2Torrent</h2>
				<p>
					<a href="https://github.com/torrust/torrust-hash2torrent">Torrust Hash2Torrent</a> is a
					web service developed by the Torrust team that converts infohashes directly into
					<code>.torrent</code> files without needing a full BitTorrent client installation. It
					wraps the <a href="https://github.com/ikatson/rqbit">rqbit</a> Rust BitTorrent client and
					uses
					<a href="https://www.bittorrent.org/beps/bep_0009.html">BEP 9</a> metadata exchange to fetch
					the torrent file from peers.
				</p>

				<p>
					The service was previously available at <code>hash2torrent.com</code>, but the public demo
					is currently paused. You can still run it locally from source or Docker:
				</p>

				<h3 id="hash2torrent-local">Running Locally with Cargo</h3>
				<p>
					Make sure
					<a href="https://rustup.rs/">Rust is installed</a>, then clone and run:
				</p>

				<CodeBlock
					lang="bash"
					code={`git clone https://github.com/torrust/torrust-hash2torrent.git
cd torrust-hash2torrent

# Create the required session directory
sudo mkdir -p /var/lib/torrust/hash2torrent/session
sudo mkdir -p /var/lib/torrust/hash2torrent/torrents
sudo chown -R $(id -u):$(id -u) /var/lib/torrust/hash2torrent

# Run the server
cargo run`}
				/>

				<p>When the server starts, you'll see log output confirming it's ready:</p>

				<CodeBlock
					lang="console"
					code={`2026-06-15T15:57:42.793Z  INFO torrust_hash2torrent: creating BitTorrent client and starting the session ...
2026-06-15T15:57:42.794Z  INFO librqbit::session: Listening on 0.0.0.0:51000 for incoming peer connections
2026-06-15T15:57:42.797Z  INFO librqbit_dht::dht: DHT listening on 0.0.0.0:53173
2026-06-15T15:57:42.806Z  INFO torrust_hash2torrent: starting API on: http://0.0.0.0:3000 ...`}
				/>

				<p>
					The server listens on port <code>3000</code> for HTTP API requests, port
					<code>51000</code> for incoming BitTorrent peer connections, and initialises the DHT on
					port <code>53173</code> to discover peers in the swarm.
				</p>

				<h3 id="hash2torrent-docker">Running Locally with Docker</h3>

				<CodeBlock
					lang="bash"
					code={`git clone https://github.com/torrust/torrust-hash2torrent.git
cd torrust-hash2torrent

# Create directories for persistent storage
mkdir -p ./storage/hash2torrent/lib ./storage/hash2torrent/log ./storage/hash2torrent/etc
sudo mkdir -p /var/lib/torrust/hash2torrent/session
sudo mkdir -p /var/lib/torrust/hash2torrent/torrents
sudo chown -R $(id -u):$(id -u) /var/lib/torrust/hash2torrent

# Build and run
./contrib/dev-tools/containers/docker-build.sh
./contrib/dev-tools/containers/docker-run.sh`}
				/>

				<p>
					Once the server is running, you can download the torrent file with curl. Here's the real
					output:
				</p>

				<CodeBlock
					lang="console"
					code={`$ curl -o ./ubuntu-26.04-desktop-amd64.iso.torrent http://127.0.0.1:3000/torrents/dafc8c076ca2f3ed376eeae7c76a0d6be2415c45
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  486k  100  486k    0      0   264k      0  0:00:01  0:00:01 --:--:--  264k`}
				/>

				<p>While the request is being processed, the server logs what it does internally:</p>

				<CodeBlock
					lang="console"
					code={`2026-06-15T16:00:37.756Z  INFO torrust_hash2torrent::api::handler: req: dafc8c076ca2f3ed376eeae7c76a0d6be2415c45
2026-06-15T16:00:39.583Z  INFO torrust_hash2torrent::api::cache: adding torrent to cache in /var/lib/torrust/hash2torrent/torrents/dafc8c076ca2f3ed376eeae7c76a0d6be2415c45.torrent`}
				/>

				<p>
					The server first logs the incoming request with the infohash, fetches the metadata from
					the BitTorrent network via rqbit, and caches the resulting <code>.torrent</code> file to disk
					so subsequent requests for the same infohash are served instantly.
				</p>

				<p>
					The HTTP response returns a <code>.torrent</code> file with the correct content-type (<code
						>application/x-bittorrent</code
					>) and includes the infohash in the custom header
					<code>X-Torrust-Torrent-Infohash</code> for easy verification.
				</p>

				<Callout type="warning">
					<strong>Note on trackers:</strong> BEP 9 only transfers the
					<strong>info dictionary</strong>
					of the torrent — the part covered by the infohash. Tracker URLs from your original magnet link
					are <strong>not</strong> preserved in the saved <code>.torrent</code> file. If you check
					the output of <code>aria2c -S</code> after downloading via hash2torrent, you'll notice the
					<code>Announce:</code> section is empty. You can re-add trackers manually, or rely on DHT for
					peer discovery.
				</Callout>

				<Callout type="info">
					<strong>Read more:</strong> Check out our dedicated post
					<a href="/blog/hash2torrent-retrieve-torrent-files-effortlessly"
						>Hash2Torrent — Retrieve Torrent Files Effortlessly!</a
					>
					for a deep dive into the service architecture and implementation.
				</Callout>

				<h2 id="using-gui-client">Method 3: Using a BitTorrent Client (GUI)</h2>
				<p>
					If you prefer a graphical interface, most BitTorrent clients can add a magnet link and
					then export the <code>.torrent</code> file after the metadata is fetched.
				</p>

				<h3 id="qbittorrent">qBittorrent</h3>
				<ol>
					<li>
						Open qBittorrent and click <strong>File → Add Torrent Link</strong> (or press
						<code>Ctrl+Shift+M</code>).
					</li>
					<li>Paste the magnet link and click <strong>OK</strong>.</li>
					<li>
						Wait for the metadata to download (you'll see "Downloading metadata..." in the status).
					</li>
					<li>
						Right-click the torrent and select <strong>Advanced → Export .torrent File</strong>.
					</li>
				</ol>

				<h3 id="transmission">Transmission</h3>
				<ol>
					<li>
						Open Transmission and click <strong>File → Open Torrent Address</strong> (or press
						<code>Ctrl+Shift+O</code>).
					</li>
					<li>Paste the magnet link and click <strong>Open</strong>.</li>
					<li>
						Once the metadata is fetched, the torrent file is stored in Transmission's config
						directory:
						<ul>
							<li><strong>Linux:</strong> <code>~/.config/transmission/torrents/</code></li>
							<li>
								<strong>macOS:</strong>
								<code>~/Library/Application Support/Transmission/Torrents/</code>
							</li>
						</ul>
					</li>
					<li>You can copy the <code>.torrent</code> file from there.</li>
				</ol>

				<Callout type="info">
					<strong>Note:</strong> GUI clients download the metadata as part of their normal
					operation. The <code>.torrent</code> export is effectively a snapshot of the metadata they've
					already fetched. If the torrent has no active peers, they may stall at "downloading metadata"
					indefinitely.
				</Callout>

				<h2 id="using-online-services">Method 4: Online Services (Use with Caution)</h2>
				<p>
					Several websites offer magnet-to-torrent conversion as a service. You paste a magnet link,
					and they return a downloadable <code>.torrent</code> file. One such example is
					<a href="https://magnet2torrent.com">magnet2torrent.com</a>, which provides a simple
					paste-and-download interface.
				</p>

				<Callout type="warning">
					<strong>Privacy considerations:</strong> When you use an online service, you're revealing
					the infohash — and thus your interest in that specific torrent — to a third party. If the
					torrent contains sensitive or copyrighted content, this could have implications. For
					private trackers, the tracker's own website is usually the safest place to download the
					original <code>.torrent</code> file.
				</Callout>

				<p>
					Online services can be convenient if you're in a hurry or have no local tools available,
					but we recommend using aria2c or a local client whenever possible.
				</p>

				<h2 id="overview-of-tools">Overview of All Methods and Tools</h2>
				<p>
					Beyond the methods detailed above, there are many other tools and libraries that can
					convert an infohash or magnet link into a <code>.torrent</code> file. Here is a comprehensive
					reference:
				</p>

				<h3 id="cli-tools">CLI Tools</h3>
				<table>
					<thead>
						<tr>
							<th>Tool</th>
							<th>Language</th>
							<th>Example Command</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><strong>aria2c</strong></td>
							<td>C++</td>
							<td><code>aria2c --bt-metadata-only --bt-save-metadata "magnet:?..."</code></td>
							<td>✅ Detailed above. Cross-platform.</td>
						</tr>
						<tr>
							<td><strong>rqbit</strong></td>
							<td>Rust</td>
							<td><code>rqbit download "magnet:?..."</code></td>
							<td>Full client with HTTP API. Powers Hash2Torrent.</td>
						</tr>
						<tr>
							<td><strong>transmission-cli</strong></td>
							<td>C</td>
							<td><code>transmission-remote --add "magnet:?..."</code></td>
							<td>Requires daemon. Extract .torrent from config dir.</td>
						</tr>
						<tr>
							<td><strong>webtorrent-cli</strong></td>
							<td>JS</td>
							<td><code>webtorrent "magnet:?..."</code></td>
							<td>Node.js. Can stream to stdout.</td>
						</tr>
						<tr>
							<td><strong>deluge-console</strong></td>
							<td>Python</td>
							<td><code>deluge-console add "magnet:?..."</code></td>
							<td>Daemon-based. Uses libtorrent internally.</td>
						</tr>
					</tbody>
				</table>

				<h3 id="web-services">Web Services</h3>
				<table>
					<thead>
						<tr>
							<th>Service</th>
							<th>URL</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><strong>Torrust Hash2Torrent</strong></td>
							<td><code>hash2torrent.com</code> (paused)</td>
							<td>Torrust's own service. Self-hostable.</td>
						</tr>
						<tr>
							<td><strong>magnet2torrent.com</strong></td>
							<td><a href="https://magnet2torrent.com">magnet2torrent.com</a></td>
							<td>Browser-based. Privacy concerns apply.</td>
						</tr>
						<tr>
							<td><strong>webtor-io</strong></td>
							<td><a href="https://github.com/webtor-io/magnet2torrent">GitHub</a></td>
							<td>gRPC service. Self-hostable (Go).</td>
						</tr>
					</tbody>
				</table>

				<h3 id="libraries">Libraries (for Developers)</h3>
				<table>
					<thead>
						<tr>
							<th>Library</th>
							<th>Language</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><strong><a href="https://github.com/ikatson/rqbit">librqbit</a></strong></td>
							<td>Rust</td>
							<td>Core library used by Hash2Torrent. Full BEP 9.</td>
						</tr>
						<tr>
							<td><strong><a href="https://libtorrent.org">libtorrent</a></strong></td>
							<td>C++ / Python</td>
							<td>De facto standard. Python bindings available.</td>
						</tr>
						<tr>
							<td
								><strong><a href="https://github.com/webtorrent/webtorrent">WebTorrent</a></strong
								></td
							>
							<td>JavaScript</td>
							<td>Streaming client for Node.js and browser.</td>
						</tr>
						<tr>
							<td
								><strong><a href="https://github.com/webtorrent/ut_metadata">ut_metadata</a></strong
								></td
							>
							<td>JavaScript</td>
							<td>BEP 9 plugin for <code>bittorrent-protocol</code>.</td>
						</tr>
						<tr>
							<td
								><strong
									><a href="https://github.com/webtorrent/bittorrent-dht">bittorrent-dht</a></strong
								></td
							>
							<td>JavaScript</td>
							<td>DHT client to find peers for custom flows.</td>
						</tr>
					</tbody>
				</table>

				<h3 id="protocol-diy">Protocol-Level (DIY)</h3>
				<table>
					<thead>
						<tr>
							<th>Approach</th>
							<th>BEP</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><strong>DHT Lookup + BEP 9</strong></td>
							<td
								><a href="https://www.bittorrent.org/beps/bep_0005.html">BEP 5</a>,
								<a href="https://www.bittorrent.org/beps/bep_0009.html">BEP 9</a></td
							>
							<td>Find peers via DHT, then request metadata via extension protocol.</td>
						</tr>
						<tr>
							<td><strong>Local Peer Discovery</strong></td>
							<td><a href="https://www.bittorrent.org/beps/bep_0014.html">BEP 14</a></td>
							<td>Discover peers on LAN and fetch metadata (no internet needed).</td>
						</tr>
					</tbody>
				</table>

				<h2 id="verifying">Verifying the Downloaded Torrent File</h2>
				<p>
					Once you have the <code>.torrent</code> file, you can quickly verify its contents using aria2c
					itself — no additional tools needed:
				</p>

				<CodeBlock lang="bash" code={`aria2c -S ubuntu-26.04-desktop-amd64.iso.torrent`} />

				<p>
					This will list all files inside the torrent along with their sizes. If the output matches
					your expectations (e.g. you see <code>ubuntu-26.04-desktop-amd64.iso</code>
					with the expected size), the metadata was fetched correctly and the torrent file is valid.
				</p>

				<p>
					For a deeper inspection, you can pipe the raw bencoded data through
					<a href="https://github.com/torrust/bencode2json">bencode2json</a>, another small Torrust
					utility that converts bencode to JSON — a perfect example of the Unix philosophy of small,
					single-responsibility tools working together:
				</p>

				<CodeBlock
					lang="bash"
					code={`bencode2json < ubuntu-26.04-desktop-amd64.iso.torrent | jq .info`}
				/>

				<p>
					This outputs the full metadata in a readable JSON format, which is useful for scripting or
					automated processing.
				</p>

				<h2 id="troubleshooting">Troubleshooting Common Issues</h2>

				<h3 id="no-peers">No Peers Found</h3>
				<p>
					The most common issue is that the torrent has no active peers in the swarm. This can
					happen with old or unpopular torrents. Solutions:
				</p>
				<ul>
					<li>
						<strong>Add more trackers:</strong> Append additional <code>&tr=&lt;url&gt;</code>
						parameters to the magnet link.
					</li>
					<li>
						<strong>Wait longer:</strong> Some swarms are slow to respond. aria2c will keep retrying for
						a while.
					</li>
					<li>
						<strong>Check DHT:</strong> Ensure DHT is enabled in your client. aria2c enables it by default.
					</li>
				</ul>

				<h3 id="metadata-timeout">Metadata Download Times Out</h3>
				<p>
					If aria2c can't fetch the metadata within a reasonable time, the swarm may be empty or the
					peers may not support BEP 9 (the metadata exchange extension). Try:
				</p>
				<ul>
					<li>Using a different tracker URL</li>
					<li>Trying again later when more peers might be online</li>
					<li>Finding the torrent file directly on the original index site</li>
				</ul>

				<h3 id="dht-blocked">DHT Is Blocked</h3>
				<p>
					Some networks (corporate, university, or certain ISPs) block DHT traffic. In that case,
					you'll need trackers to find peers. Make sure your magnet link includes at least one
					reliable tracker URL.
				</p>

				<h3 id="aria2c-not-found">aria2c Not Found</h3>
				<p>
					If the <code>aria2c</code> command is not available after installation, ensure the
					installation directory is in your <code>PATH</code>. On some systems, you may need to
					start a new terminal session after installing.
				</p>

				<h2 id="comparison">Which Method Should You Choose?</h2>
				<p>
					Here's a quick comparison across the factors that matter most — privacy, ease of use, and
					reliability — to help you decide which approach fits your needs:
				</p>

				<table>
					<thead>
						<tr>
							<th>Factor</th>
							<th>aria2c</th>
							<th>rqbit CLI</th>
							<th>Hash2Torrent</th>
							<th>GUI Client</th>
							<th>Online Service</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><strong>Privacy</strong></td>
							<td>★★★ Local</td>
							<td>★★★ Local</td>
							<td>★★ Self-host / ★ Demo</td>
							<td>★★★ Local</td>
							<td>★ Reveals infohash</td>
						</tr>
						<tr>
							<td><strong>Installation</strong></td>
							<td>★★★ <code>apt install aria2</code></td>
							<td>★★ <code>cargo install rqbit</code></td>
							<td>★ Needs server setup</td>
							<td>★★★ Download installer</td>
							<td>★★★ Nothing needed</td>
						</tr>
						<tr>
							<td><strong>Cross-platform</strong></td>
							<td>★★★ All three</td>
							<td>★★★ All three</td>
							<td>★★ Docker / Rust</td>
							<td>★★★ All three</td>
							<td>★★★ Browser</td>
						</tr>
						<tr>
							<td><strong>Scriptability</strong></td>
							<td>★★★ One-liner</td>
							<td>★★★ CLI + HTTP API</td>
							<td>★★★ HTTP API</td>
							<td>★ Manual clicks</td>
							<td>★★★ curl</td>
						</tr>
						<tr>
							<td><strong>Reliability</strong></td>
							<td>★★★ Mature, active</td>
							<td>★★★ Active dev</td>
							<td>★★ Demo paused</td>
							<td>★★★ Mature</td>
							<td>★ Come and go</td>
						</tr>
						<tr>
							<td><strong>Dependencies</strong></td>
							<td>★★★ Single binary</td>
							<td>★★ Rust toolchain</td>
							<td>★ Full server stack</td>
							<td>★★ Full desktop app</td>
							<td>★★★ None</td>
						</tr>
						<tr>
							<td><strong>Learning curve</strong></td>
							<td>★★★ 1 command</td>
							<td>★★★ 1 command</td>
							<td>★★ Run a server</td>
							<td>★★★ Point &amp; click</td>
							<td>★★★ Paste &amp; download</td>
						</tr>
						<tr>
							<td><strong>Metadata-only</strong></td>
							<td>★★★ Yes (<code>--bt-metadata-only</code>)</td>
							<td>★★★ Yes</td>
							<td>★★★ Yes</td>
							<td>★★ Downloads content</td>
							<td>★★★ Yes</td>
						</tr>
					</tbody>
				</table>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					Converting a magnet link or infohash into a <code>.torrent</code> file is a common task in the
					BitTorrent ecosystem, and as we've seen, there are multiple ways to do it. The underlying mechanism
					is always the same: the infohash is used to discover peers via DHT or trackers, and the metadata
					is fetched from those peers using BEP 9.
				</p>

				<p>
					<strong>Our top recommendation is aria2c</strong> — it's fast, works everywhere, and the command
					is simple enough to remember or script. For infohashes, just construct a magnet link first,
					then apply the same aria2c command.
				</p>

				<p>
					Whether you need the <code>.torrent</code> file for archiving, sharing, or inspection, these
					methods will get you there. And the next time someone shares a bare infohash with you, you'll
					know exactly what to do.
				</p>

				<Callout type="info">
					<strong>Want to learn more?</strong> Check out our other articles on BitTorrent
					technology, including
					<a href="/blog/hash2torrent-retrieve-torrent-files-effortlessly"
						>Hash2Torrent — Retrieve Torrent Files Effortlessly!</a
					>,
					<a href="/blog/what-is-a-bittorent-tracker">What Is a BitTorrent Tracker?</a>, and
					<a href="/blog/torrust-enhancing-the-bittorrent-ecosystem"
						>Torrust: Enhancing the BitTorrent Ecosystem</a
					>.
				</Callout>

				<h2 id="resources">Resources</h2>
				<ul>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0009.html"
							>BEP 9 — Extension for Peers to Send Metadata Files</a
						>
						— The official specification for both the magnet URI format and the metadata exchange protocol.
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0005.html">BEP 5 — DHT Protocol</a>
						— The distributed hash table used to find peers when no trackers are available.
					</li>
					<li>
						<a href="https://www.bittorrent.org/beps/bep_0010.html">BEP 10 — Extension Protocol</a>
						— The underlying extension mechanism that BEP 9 metadata exchange runs on top of.
					</li>
					<li>
						<a href="https://aria2.github.io/manual/en/html/index.html">aria2 Manual</a>
						— Official documentation for the aria2 download utility.
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-hash2torrent">Torrust Hash2Torrent</a>
						— Torrust's web service for converting infohashes to .torrent files.
					</li>
					<li>
						<a href="https://en.wikipedia.org/wiki/Magnet_URI_scheme"
							>Wikipedia — Magnet URI scheme</a
						>
						— General reference on the magnet link format and its history.
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-parse-torrent">Torrust Parse Torrent</a>
						— A CLI tool to parse and inspect <code>.torrent</code> files locally, useful for examining
						metadata after fetching.
					</li>
					<li>
						<a href="https://github.com/torrust/bencode2json">Torrust Bencode2JSON</a>
						— A minimal utility to convert bencoded files to JSON, useful for scripting and automated
						inspection of torrent metadata.
					</li>
				</ul>
			</div>
		</div>
	</PagesWrapper>
	<PrevNextPost currentPage={currentPost.slug} {allPosts} />
	<div class="related-posts-container">
		<h2>Related Posts:</h2>
		<div class="grid">
			{#each data.allPosts.slice(0, 3) as post (post.slug)}
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
