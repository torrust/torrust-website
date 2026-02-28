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
					The BitTorrent ecosystem is constantly evolving, and I'm always excited to discover new
					projects that push the boundaries of what's possible. When I came across
					<a href="https://github.com/Nehliin/vortex">Vortex</a>, a Rust-based BitTorrent client
					built on io_uring that claims to be 3x faster than Transmission, I knew I had to try it.
				</p>
				<p>
					As someone deeply interested in the BitTorrent ecosystem—through the Torrust project and
					beyond—I wanted to understand how Vortex works, what makes it different, and share my
					findings with others who are curious about modern BitTorrent implementations. This is a
					hands-on exploration where I install Vortex, test it with a real torrent from the
					<a href="https://index.torrust-demo.com/">Torrust Demo Index</a>, and document everything
					I learn along the way.
				</p>

				<Callout type="info">
					This is a <strong>real, hands-on testing session</strong>. You'll see the actual commands
					I ran, their outputs, any issues I encountered, and how I solved them. The goal is to
					learn together and share knowledge about innovative projects in the BitTorrent space.
				</Callout>

				<h2 id="what-is-vortex">What is Vortex?</h2>
				<p>
					Vortex is an extremely fast, pure <code>io_uring</code> based BitTorrent library and
					client built from the ground up for modern Linux systems. Unlike traditional BitTorrent
					clients that rely on <code>epoll</code> for I/O, Vortex uses <code>io_uring</code>—the
					next-generation Linux I/O API—to achieve exceptional throughput with minimal overhead.
				</p>
				<p>Key characteristics:</p>
				<ul>
					<li>
						<strong>Repo:</strong>
						<a href="https://github.com/Nehliin/vortex">https://github.com/Nehliin/vortex</a>
					</li>
					<li>
						<strong>Author:</strong>
						<a href="https://github.com/Nehliin">Oskar Nehlin</a>
					</li>
					<li><strong>Stars:</strong> Growing community interest.</li>
					<li><strong>License:</strong> BSD-3-Clause</li>
					<li><strong>Language:</strong> Rust</li>
					<li><strong>Current Status:</strong> BETA</li>
					<li>
						<strong>Latest Releases:</strong>
						<ul>
							<li>vortex-bittorrent: v0.4.0 (January 25, 2026)</li>
							<li>vortex-cli: v0.3.0 (January 25, 2026)</li>
						</ul>
					</li>
				</ul>

				<Callout type="info">
					Vortex requires <strong>Linux Kernel 6.1 or newer</strong> due to its reliance on modern io_uring
					features. This is a conscious design decision to optimize for cutting-edge performance rather
					than broad compatibility.
				</Callout>

				<h3 id="overview">Overview</h3>
				<p>
					Vortex represents a fundamental rethinking of how BitTorrent clients should be built. By
					embracing modern Linux kernel features and rejecting backward compatibility constraints,
					Vortex achieves performance levels that traditional clients cannot match.
				</p>
				<p>
					The project is designed for users who prioritize speed and efficiency over universal
					platform support, making it ideal for server deployments, high-performance workstations,
					and enthusiasts who run modern Linux distributions.
				</p>

				<h3 id="key-features">Key Features</h3>

				<h4 id="vortex-cli">vortex-cli (TUI Client)</h4>
				<ul>
					<li><strong>Fully Trackerless:</strong> All peer discovery via DHT (mainline)</li>
					<li><strong>TUI Interface:</strong> Terminal-based UI built with Ratatui</li>
					<li>
						<strong>Real-time Metrics:</strong> Live graphs showing download/upload throughput
					</li>
					<li><strong>Metadata Download:</strong> Support for downloading from info-hash alone</li>
					<li><strong>Seeding Support:</strong> Continues seeding after download completion</li>
					<li>
						<strong>XDG Directory Support:</strong> Follows Linux standards for config/data paths
					</li>
				</ul>

				<h4 id="vortex-bittorrent">vortex-bittorrent (Library)</h4>
				<ul>
					<li><strong>io_uring Based:</strong> Zero-copy I/O with minimal syscall overhead</li>
					<li><strong>Custom Event Loop:</strong> No async runtime overhead</li>
					<li><strong>Parallel Hash Computation:</strong> Offloaded to thread pool</li>
					<li><strong>"Lockless" Design:</strong> Single I/O thread, leveraging Rust lifetimes</li>
					<li><strong>SSD/NVMe Optimized:</strong> No HDD head optimization overhead</li>
					<li><strong>Metrics Support:</strong> Integration with the metrics crate</li>
					<li><strong>Well Tested:</strong> Unit, integration, and fuzz tests</li>
				</ul>

				<h4 id="bep-support">BitTorrent Enhancement Proposals (BEP) Support</h4>
				<p>Vortex implements many core BitTorrent protocols:</p>
				<ul>
					<li><strong>BEP 3:</strong> The BitTorrent Protocol Specification ✓</li>
					<li><strong>BEP 6:</strong> Fast Extension ✓</li>
					<li><strong>BEP 9:</strong> Extension for Peers to Send Metadata Files ✓</li>
					<li><strong>BEP 10:</strong> Extension Protocol ✓</li>
					<li><strong>BEP 20:</strong> Peer ID Conventions ✓</li>
					<li><strong>BEP 21:</strong> Extension for Partial Seeds ✓</li>
				</ul>
				<p>
					Notable omissions include tracker support (BEP 7, 12), PEX (BEP 11), uTP (BEP 29), and
					BitTorrent v2 (BEP 52). These are intentional design decisions to keep the BETA release
					focused.
				</p>

				<h2 id="system-check">Step 1: Checking System Requirements</h2>
				<p>
					Before installing any software, it's important to verify your system meets the
					requirements. Vortex is picky—it only works on modern Linux systems.
				</p>

				<h3 id="kernel-check">Kernel Version</h3>
				<p>First, check your kernel version:</p>

				<CodeBlock lang="bash" code={`uname -r`} />

				<p>My system output:</p>

				<CodeBlock lang="console" code={`6.17.0-14-generic`} />

				<p>
					✅ <strong>Result:</strong> My kernel is 6.17.0, which is well above the 6.1 minimum requirement.
					If your kernel is older than 6.1, you'll need to upgrade before Vortex will work.
				</p>

				<h3 id="rust-check">Rust Installation</h3>
				<p>Vortex is distributed via cargo, so you need Rust installed:</p>

				<CodeBlock lang="bash" code={`cargo --version`} />

				<p>My output:</p>

				<CodeBlock lang="console" code={`cargo 1.95.0-nightly (ce69df6f7 2026-02-12)`} />

				<p>
					✅ I already had Rust installed. If you don't have it, install from <a
						href="https://rustup.rs">https://rustup.rs</a
					>.
				</p>

				<h2 id="installation">Step 2: Installing Vortex</h2>
				<p>
					Now for the installation. Vortex can be installed from crates.io, which is the easiest
					method:
				</p>

				<CodeBlock lang="bash" code={`cargo install --locked vortex-cli`} />

				<p><strong>What this command does:</strong></p>
				<ul>
					<li>Downloads the source code from crates.io</li>
					<li>Compiles it for your specific system (this takes 2-5 minutes)</li>
					<li>Installs the binary to <code>~/.cargo/bin/vortex-cli</code></li>
					<li>
						The <code>--locked</code> flag uses exact dependency versions tested by the author
					</li>
				</ul>

				<p>
					I ran the installation command, and after compilation finished, I verified it was ready:
				</p>

				<CodeBlock lang="bash" code={`vortex-cli --version`} />

				<CodeBlock lang="console" code={`vortex-cli 0.3.1`} />

				<p>
					✅ <strong>Success!</strong> Vortex 0.3.1 is installed and ready to use.
				</p>

				<h2 id="getting-test-torrent">Step 3: Getting a Test Torrent</h2>
				<p>
					For this test, I'm using the Arch Linux ISO from the Torrust Demo Index. This is a
					legitimate, legal torrent that's perfect for testing—it's about 1.5 GB, well-seeded, and
					represents a real-world use case.
				</p>

				<p><strong>Torrent Details:</strong></p>
				<ul>
					<li><strong>Name:</strong> Arch Linux 2026.02.01 x86_64 ISO</li>
					<li>
						<strong>Torrust Index Link:</strong>
						<a
							href="https://index.torrust-demo.com/torrent/8e3f4283d1c8360d2f18544a8b166813086675a1/archlinux-20260201-x86-64iso"
						>
							archlinux-20260201-x86-64iso
						</a>
					</li>
					<li><strong>Info Hash:</strong> <code>8e3f4283d1c8360d2f18544a8b166813086675a1</code></li>
					<li><strong>Size:</strong> 1.5 GB</li>
				</ul>

				<h3 id="starting-download">Starting the Download</h3>
				<p>
					One of Vortex's most powerful features is its ability to download torrents using just the
					info hash, without needing a .torrent file. It discovers peers via DHT (Distributed Hash
					Table), retrieves the metadata, and starts downloading:
				</p>

				<CodeBlock
					lang="bash"
					code={`vortex-cli --info-hash 8e3f4283d1c8360d2f18544a8b166813086675a1 -d ./downloads`}
				/>

				<p><strong>What this command does:</strong></p>
				<ul>
					<li>Uses only the info hash (no .torrent file needed)</li>
					<li>Discovers peers via DHT (Distributed Hash Table)</li>
					<li>Downloads the torrent metadata from peers</li>
					<li>Starts downloading the actual file</li>
					<li>Shows a real-time TUI with graphs and statistics</li>
				</ul>

				<h3 id="torrent-file-download">Alternative: Using a .torrent File</h3>
				<p>
					While DHT-only downloads are convenient, Vortex also supports traditional .torrent files.
					You can download the torrent file from the Torrust Demo Index:
				</p>

				<CodeBlock
					lang="bash"
					code={`mkdir -p ~/vortex-test && cd ~/vortex-test
wget -O archlinux-2026.02.01.torrent "https://index.torrust-demo.com/api/v1/torrent/download/8e3f4283d1c8360d2f18544a8b166813086675a1"`}
				/>

				<p>Then start the download with the torrent file:</p>

				<CodeBlock lang="bash" code={`vortex-cli -t archlinux-2026.02.01.torrent -d ./downloads`} />

				<p><strong>Benefits of using a .torrent file:</strong></p>
				<ul>
					<li>Contains tracker URLs for faster peer discovery</li>
					<li>Includes metadata, so no DHT lookup needed</li>
					<li>Can work in environments where DHT is blocked</li>
					<li>Standard method compatible with all BitTorrent clients</li>
				</ul>

				<h2 id="test-results">Step 4: Download Results</h2>

				<h3 id="the-experience">The TUI Experience</h3>
				<p>
					Vortex's TUI (Terminal User Interface) immediately impressed me. Within seconds of
					starting, I saw:
				</p>
				<ul>
					<li>Real-time throughput graphs showing download and upload speeds</li>
					<li>Progress bar showing download completion</li>
					<li>Peer count and connection information</li>
					<li>Live updates without terminal flicker or performance issues</li>
				</ul>

				<img
					src="/images/posts/vortex-rust-bittorrent-client-review/vortex-rust-bittorrent-client-screenshot.webp"
					alt="Vortex TUI showing real-time download progress with throughput graphs and peer information"
					loading="lazy"
					style="width: 100%; height: auto;"
				/>

				<p>
					The interface is clean, informative, and doesn't get in the way of the actual downloading.
				</p>

				<h3 id="performance-metrics">Performance Metrics</h3>
				<p>Here's what I observed during the download:</p>

				<ul>
					<li><strong>File Size:</strong> 1.5 GB</li>
					<li><strong>Initial Peer Discovery:</strong> Nearly instant via DHT</li>
					<li><strong>Metadata Download:</strong> Completed within seconds</li>
					<li>
						<strong>Download Speed:</strong> Consistently high, fully saturating my fiber connection
					</li>
					<li><strong>Download Completion:</strong> Very fast, completed in just over a minute</li>
					<li><strong>Final Status:</strong> Automatically switched to seeding mode</li>
				</ul>

				<Callout type="success">
					<strong>Performance Verdict:</strong> Vortex handled the 1.5 GB download smoothly and quickly.
					The DHT peer discovery was remarkably fast—no tracker needed! The download speeds maxed out
					my available bandwidth, showing that Vortex can fully utilize high-speed connections.
				</Callout>

				<h3 id="verification">File Verification</h3>
				<p>After the download completed, I verified the file:</p>

				<CodeBlock
					lang="bash"
					code={`ls -lh downloads/archlinux-2026.02.01-x86_64.iso/
file downloads/archlinux-2026.02.01-x86_64.iso/archlinux-2026.02.01-x86_64.iso`}
				/>

				<CodeBlock
					lang="console"
					code={`total 1.5G
-rw-rw-r-- 1 josecelano josecelano 1.5G Feb 13 13:54 archlinux-2026.02.01-x86_64.iso

archlinux-2026.02.01-x86_64.iso: ISO 9660 CD-ROM filesystem data (DOS/MBR boot sector) 'ARCH_202602' (bootable)`}
				/>

				<p>
					✅ <strong>Verification Success:</strong> The file is a valid ISO 9660 filesystem, correctly
					identified as an Arch Linux bootable ISO. The download was successful and the file is intact.
				</p>

				<h2 id="observations">Key Observations and Findings</h2>

				<h3 id="what-worked-well">What Worked Really Well</h3>
				<ul>
					<li>
						<strong>DHT Peer Discovery:</strong> Found peers almost instantly without any tracker—truly
						impressive
					</li>
					<li>
						<strong>Download Speed:</strong> Maxed out my connection with peak speeds near 60 MB/s
					</li>
					<li>
						<strong>TUI Interface:</strong> Clean, informative, and responsive even at high speeds
					</li>
					<li>
						<strong>Automatic Seeding:</strong> Seamlessly transitioned to seeding after download completed
					</li>
					<li>
						<strong>No Configuration Needed:</strong> Worked perfectly with zero config files or tweaking
					</li>
					<li>
						<strong>Resources Usage:</strong> Minimal CPU and memory usage throughout the download
					</li>
				</ul>

				<h3 id="minor-quirks">Minor Quirks</h3>
				<ul>
					<li>
						<strong>Download Directory Structure:</strong> Vortex creates a directory named after the
						torrent and places the file inside it, rather than just saving the ISO directly. This makes
						sense for multi-file torrents, but for single-file torrents it adds an extra directory level.
					</li>
					<li>
						<strong>No Pause/Resume:</strong> As documented, you can't pause and resume downloads yet
						(Issue #92). Once you start, you're committed until it finishes.
					</li>
					<li>
						<strong>Seeding Exit:</strong> Had to manually quit (Ctrl+C) to stop seeding—no automatic
						shutdown after a certain ratio or time period.
					</li>
				</ul>

				<p>
					These are all minor issues, and most are documented as planned features or deliberate
					design choices.
				</p>

				<h3 id="comparison-context">Comparison Context</h3>
				<p>
					The author claims Vortex is ~3x faster than transmission-cli (4.0.6). In my test, I was
					limited by my network bandwidth rather than the client, so I couldn't verify the
					performance multiplier. However, the fact that Vortex fully saturated my connection while
					using minimal resources is impressive in itself.
				</p>

				<p>
					For users on faster connections (10 Gbps+) or in data center environments, the
					io_uring-based architecture would likely show even more significant performance
					advantages.
				</p>

				<h2 id="final-verdict">Final Verdict</h2>

				<p>
					Vortex delivers on its core promise: exceptional BitTorrent performance on modern Linux
					systems. In my hands-on test, it successfully downloaded a 1.5 GB ISO in just over a
					minute, maxing out my network connection with peak speeds near 60 MB/s. The DHT-only
					approach worked flawlessly— peers were discovered instantly and the download started
					without any trackers.
				</p>

				<p>
					The TUI is clean and informative, providing real-time metrics without getting in the way.
					Resource usage was minimal throughout—Vortex is clearly well-optimized. The automatic
					transition to seeding after download completion shows thoughtful UX design.
				</p>

				<p>
					Yes, it's BETA software. Yes, it lacks features like pause/resume. Yes, it's Linux-only.
					But within its design constraints, Vortex is exceptional. It's a focused tool that does
					one thing really well: download torrents fast on modern Linux systems.
				</p>

				<Callout type="info">
					<strong>Real-World Performance:</strong> Successfully downloaded 1.5 GB quickly with consistently
					high speeds and full bandwidth saturation. Minimal CPU/RAM usage throughout. DHT peer discovery
					took only seconds.
				</Callout>

				<p>
					The project is actively developed, the codebase is clean, and the BSD-3-Clause license is
					permissive. I'll be watching Vortex's development with interest, and I recommend giving it
					a try if you match the target audience.
				</p>

				<Callout type="success">
					<strong>Bottom Line:</strong> If you're on Linux 6.1+ and want the fastest BitTorrent client
					available, try Vortex. It's BETA, but it works impressively well. Just don't expect a feature-complete
					replacement for traditional clients—yet.
				</Callout>

				<h2 id="learning-ecosystem">What I Learned About the BitTorrent Ecosystem</h2>

				<p>
					Testing Vortex reinforced something I already believed: the BitTorrent ecosystem is
					healthier when we have diverse implementations with different goals and trade-offs. Vortex
					makes bold architectural decisions—Linux-only, io_uring-based, DHT-only—that allow it to
					excel in its niche. That's valuable.
				</p>

				<p>
					Projects like Vortex, Torrust, Transmission, qBittorrent, and others serve different needs
					and push the technology forward in different ways. Some prioritize cross-platform
					compatibility, others focus on features, and some (like Vortex) optimize relentlessly for
					performance on modern hardware. All of these approaches contribute to a robust ecosystem.
				</p>

				<p>
					If you're interested in BitTorrent technology—whether as a user, developer, or just
					someone curious about decentralized systems—I encourage you to explore different
					implementations. Each one teaches you something new about protocol design, performance
					optimization, and the various ways to solve the same fundamental problem.
				</p>

				<p>
					Vortex is a great example of what's possible when you embrace modern technology and make
					focused design decisions. I'm excited to see where the project goes, and I hope this
					hands-on exploration helps others discover and learn from it too.
				</p>

				<h3 id="links">Useful Links</h3>
				<ul>
					<li>
						<strong>GitHub Repository:</strong>
						<a href="https://github.com/Nehliin/vortex">https://github.com/Nehliin/vortex</a>
					</li>
					<li>
						<strong>Library Documentation:</strong>
						<a href="https://docs.rs/vortex-bittorrent/">https://docs.rs/vortex-bittorrent/</a>
					</li>
					<li>
						<strong>Crates.io:</strong>
						<a href="https://crates.io/crates/vortex-bittorrent">vortex-bittorrent</a> |
						<a href="https://crates.io/crates/vortex-cli">vortex-cli</a>
					</li>
					<li>
						<strong>Author:</strong>
						<a href="https://github.com/Nehliin">Oskar Nehlin on GitHub</a>
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

	.content-preview > p,
	.content-preview > ul,
	.content-preview > h2,
	.content-preview > h3,
	.content-preview > h4 {
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
