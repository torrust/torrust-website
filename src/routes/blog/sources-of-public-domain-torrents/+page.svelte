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
					BitTorrent is often associated with copyright infringement, but the protocol itself is
					simply a peer-to-peer file-sharing technology — and there is a wealth of content that can
					be shared and downloaded entirely legally. From public-domain movies and classic
					literature to open-source software and open-licensed creative works, torrents are used
					every day to distribute content that the creators <em>want</em> you to share.
				</p>
				<p>
					This guide collects the most reliable sources of legal, public-domain, and openly-licensed
					torrents. Whether you are a developer seeding Linux ISOs, a researcher distributing
					datasets, or just someone looking for classic films, these sites are safe, legal, and
					actively maintained.
				</p>

				<Callout type="info">
					<strong>Looking for the latest list?</strong> Sources go offline and new ones appear over
					time. The canonical, community-maintained version of this list lives on GitHub:
					<a
						href="https://github.com/torrust/awesome-legal-torrent-sources"
						target="_blank"
						rel="noreferrer">torrust/awesome-legal-torrent-sources</a
					>. Pull requests to add or update sources are welcome!
				</Callout>

				<h2 id="public-domain-and-cultural-archives">Public Domain and Cultural Archives</h2>

				<h3 id="internet-archive">Internet Archive</h3>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://archive.org" target="_blank" rel="noreferrer">https://archive.org</a>
					</li>
					<li>
						<strong>Torrents:</strong>
						<a href="https://archive.org/details/bittorrent" target="_blank" rel="noreferrer"
							>https://archive.org/details/bittorrent</a
						>
					</li>
				</ul>
				<p>
					The Internet Archive is one of the largest digital libraries in the world. It offers
					millions of free books, movies, music recordings, software packages, and datasets. Many
					collections are available via BitTorrent, making it the most comprehensive source of
					unquestionably legal torrents on the internet.
				</p>

				<h3 id="project-gutenberg">Project Gutenberg</h3>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://www.gutenberg.org" target="_blank" rel="noreferrer"
							>https://www.gutenberg.org</a
						>
					</li>
				</ul>
				<p>
					Project Gutenberg provides more than 70,000 free public-domain ebooks. While many are
					available as direct downloads, some collections are also distributed via torrents. It is
					the oldest and largest repository of freely redistributable literary works whose copyright
					has expired.
				</p>

				<h3 id="public-domain-torrents">Public Domain Torrents</h3>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://www.publicdomaintorrents.info" target="_blank" rel="noreferrer"
							>https://www.publicdomaintorrents.info</a
						>
					</li>
				</ul>
				<p>
					A site dedicated exclusively to public-domain movies. It hosts classic films, B-movies,
					and lesser-known titles spanning genres like horror, drama, animation, and comedy. All
					content is verified to be in the public domain, making it a safe and legal source for
					movie torrents.
				</p>

				<h2 id="open-source-software">Open-Source Software</h2>
				<p>
					Many open-source projects use BitTorrent to distribute large installation images, reducing
					bandwidth costs and speeding up downloads for users worldwide.
				</p>

				<h3 id="debian">Debian</h3>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://www.debian.org/CD/torrent-cd/" target="_blank" rel="noreferrer"
							>https://www.debian.org/CD/torrent-cd/</a
						>
					</li>
				</ul>
				<p>
					Debian provides official torrent downloads for all its installation images. This is one of
					the longest-running legal torrent distributions, with every stable, testing, and unstable
					release available via BitTorrent.
				</p>

				<h3 id="ubuntu">Ubuntu</h3>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://ubuntu.com/download" target="_blank" rel="noreferrer"
							>https://ubuntu.com/download</a
						>
					</li>
				</ul>
				<p>
					Canonical offers BitTorrent as an alternative download method for Ubuntu desktop and
					server releases. It is a great way to seed the distribution and help the community.
				</p>

				<h3 id="fedora">Fedora</h3>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://torrent.fedoraproject.org/" target="_blank" rel="noreferrer"
							>https://torrent.fedoraproject.org/</a
						>
					</li>
				</ul>
				<p>
					Fedora provides official torrents for its workstation, server, and atomic images. The
					torrent download is listed alongside direct HTTP downloads on the Fedora website.
				</p>

				<h3 id="linux-tracker">Linux Tracker</h3>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://linuxtracker.org" target="_blank" rel="noreferrer"
							>https://linuxtracker.org</a
						>
					</li>
				</ul>
				<p>
					Linux Tracker is a community-driven tracker dedicated entirely to Linux distribution
					torrents. It hosts torrents for a wide variety of distros — including smaller niche
					distributions that may not have the bandwidth for direct downloads. If you enjoy
					distro-hopping, this is the place to find ISOs.
				</p>

				<h2 id="open-movies-and-media">Open Movies and Media</h2>

				<h3 id="blender-foundation-open-movies">Blender Foundation Open Movies</h3>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://studio.blender.org/films/" target="_blank" rel="noreferrer"
							>https://studio.blender.org/films/</a
						>
					</li>
				</ul>
				<p>
					The Blender Foundation produces and distributes open-licensed animated films to
					demonstrate the capabilities of Blender. Notable titles include:
				</p>
				<ul>
					<li>Big Buck Bunny</li>
					<li>Sintel</li>
					<li>Tears of Steel</li>
					<li>Cosmos Laundromat</li>
				</ul>
				<p>
					Many of these films have been distributed via BitTorrent. All are released under Creative
					Commons licenses.
				</p>

				<h2 id="music">Music</h2>

				<h3 id="etree">eTree</h3>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://www.etree.org" target="_blank" rel="noreferrer"
							>https://www.etree.org</a
						>
					</li>
				</ul>
				<p>
					eTree is a community dedicated to trading live concert recordings of musical artists who
					allow non-commercial trading of their performances. It is a long-standing hub for legal,
					fan-recorded live music torrents.
				</p>

				<h2 id="academic-and-scientific-data">Academic and Scientific Data</h2>

				<h3 id="academic-torrents">Academic Torrents</h3>
				<ul>
					<li>
						<strong>Website:</strong>
						<a href="https://academictorrents.com" target="_blank" rel="noreferrer"
							>https://academictorrents.com</a
						>
					</li>
				</ul>
				<p>
					Academic Torrents is a distributed dataset-sharing platform built on BitTorrent. It is
					commonly used for machine learning datasets, scientific research data, and large-scale
					academic information. Researchers and data scientists can download and seed datasets,
					reducing the load on institutional servers.
				</p>

				<h2 id="finding-more-sources">Finding More Sources</h2>
				<p>
					Beyond the curated list above, you can discover additional legal torrent sources by
					searching for these keywords:
				</p>
				<ul>
					<li><code>public domain torrent</code></li>
					<li><code>creative commons torrent</code></li>
					<li><code>open source software torrent</code></li>
					<li><code>linux iso torrent</code></li>
					<li><code>academic torrents</code></li>
					<li><code>internet archive torrent</code></li>
				</ul>

				<Callout type="info">
					<strong>Note:</strong> The availability of individual sources may change over time. The
					canonical, community-maintained version of this list is on GitHub at
					<a
						href="https://github.com/torrust/awesome-legal-torrent-sources"
						target="_blank"
						rel="noreferrer">torrust/awesome-legal-torrent-sources</a
					>— check there for the most up-to-date status of each source.
				</Callout>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					BitTorrent is a powerful and legitimate technology. From the Internet Archive's vast
					digital library to the specialized collections on Linux Tracker and eTree, there is no
					shortage of content that can be shared and downloaded legally. Whether you are
					contributing to open-source software, accessing public-domain literature, or distributing
					research data, these sources provide a solid foundation for legal torrenting.
				</p>
				<p>
					This list is now maintained as a community resource on GitHub. If a source goes offline or
					a new one appears,
					<a
						href="https://github.com/torrust/awesome-legal-torrent-sources"
						target="_blank"
						rel="noreferrer">contributions are welcome</a
					>.
				</p>
				<p>
					The Torrust project itself builds on this spirit of open sharing. Our BitTorrent tracker
					and index implementations are designed to help communities host their own legal torrent
					ecosystems. If you run a legal torrent service, we would love to hear about it.
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
