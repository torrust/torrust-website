<script lang="ts">
	let { data } = $props();
	let currentPost = $derived(data.currentPost);
	let allPosts = $derived(data.allPosts);
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
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
				<h2 id="hello-world-">Hello World!</h2>
				<p>
					We haven&#39;t introduced the Torrust Organization in this blog yet, including its vision,
					mission, and roadmap. This should have been the first post, but after contributing to the
					BitTorrent ecosystem for over three years, we now have a better understanding of what the
					BitTorrent protocols offer and how we can enhance the ecosystem.
				</p>
				<p>
					Torrust is an Open-Source Organization. It was created by <a
						href="https://github.com/mickvandijke">@mickvandijke</a
					>
					in 2021. Mick started by forking the UDP tracker from a
					<a href="https://github.com/naim94a">@naim94a</a>&#39;s&#39; repository
					<a href="https://github.com/naim94a/udpt">https://github.com/naim94a/udpt</a>
					and using some packages for the UDP tracker from
					<a href="https://github.com/greatest-ape">@greatest-ape</a>&#39;s
					<a href="https://github.com/greatest-ape/aquatic">Aquatic</a>
					repo. <a href="https://github.com/naim94a">@naim94a</a> had been working on the tracker
					since December 2012. In August 2022,
					<a href="https://github.com/Nautilus-Cyberneering">Nautilus Cyberneering</a>
					joined the project. <a href="https://github.com/mickvandijke">@mickvandijke</a> was already
					in contact with the Nautilus, and Nautilus decided to contribute due to the traction it was
					getting from the community and the alignment with their interests.
				</p>
				<p>
					We would like to thank <a href="https://github.com/naim94a">@naim94a</a> and
					<a href="https://github.com/greatest-ape">@greatest-ape</a> and all other contributors for
					their invaluable contributions in coding, opening issues, PRs, improving documentation, sharing
					ideas, etc.
				</p>
				<p>
					Over the last two years, significant efforts have been made to establish Torrust software
					as a leading software in the BitTorrent open-source community. We have applied the best
					languages, tools, and practices to bring a modern, reliable <a
						href="https://github.com/torrust/torrust-tracker">Tracker</a
					>
					and <a href="https://github.com/torrust/torrust-index">Index</a>. We are close to
					releasing the version v3.0.0, which we consider a solid foundation for future web3
					projects requiring file-sharing services.
				</p>
				<p>
					During this time, we have focused not only on building great products but also on
					contributing to the community in different ways like improving BitTorrent documentation,
					helping maintainers to maintain their Rust-based BitTorrents packages, participating in
					protocol discussions, and writing articles about BitTorrent.
				</p>
				<p>
					We have also prioritized onboarding contributors to the organization. We strive to provide
					a good experience for anyone interested in contributing, whether it&#39;s fixing a small
					typo, improving documentation, or submitting a large PR with a new feature. We respond
					quickly and make it easy to contribute, exemplified by the extensive documentation we have
					written.
				</p>
				<h2 id="why-is-bittorrent-important-">Why is BitTorrent important?</h2>
				<p>
					BitTorrent is a peer-to-peer (P2P) file sharing protocol, first released in 2001 by <a
						href="https://github.com/bramcohen">Bram Cohen</a
					>. It revolutionized file distribution across the internet by allowing efficient
					peer-to-peer sharing without relying on a single centralized server, making it highly
					resilient and scalable. BitTorrent enables each downloader to become an uploader, creating
					a network of file sharing that boosts download speeds and balances server loads.
				</p>
				<p>
					BitTorrent has been very often related to illegal sharing of copyrighted material,
					it&#39;s worth noting that BitTorrent itself is not illegal. It is a tool, and like any
					tool, its legality depends on how it&#39;s used. It has numerous legitimate uses such as
					distributing open-source software, sharing large datasets, real-time communications, and
					even reducing server load for large-scale events like product launches or game updates.
				</p>
				<p>There have been many interesting and useful projects over the years, such as:</p>
				<ul>
					<li>
						<a href="https://academictorrents.com/">https://academictorrents.com/</a> for sharing enormous
						datasets, for researchers, by researchers.
					</li>
					<li>
						<a href="https://help.archive.org/help/archive-bittorrents/">The Internet Archive</a> is
						also using torrents since 2012.
					</li>
					<li>
						<a href="https://www.legittorrents.info/">https://www.legittorrents.info/</a> was a collection
						of legal torrents.
					</li>
				</ul>
				<p>
					More recently, the <a href="https://webtorrent.io/">webtorrent</a> extension has enabled BitTorrent
					clients to run in a browser, unlocking new capabilities like:
				</p>
				<ul>
					<li>
						<a href="https://peertube.cpy.re/">PeerTube</a>: Prototype of a decentralized video
						streaming platform in the web browser.
					</li>
					<li>
						<a href="https://cinetimes.org/">CineTimes</a>: A streaming website of public domain
						movies.
					</li>
					<li>
						<a href="https://www.bitchute.com/">BitChute</a>: A decentralized video streaming social
						network.
					</li>
				</ul>
				<p>You can find more <a href="https://webtorrent.io/faq">here</a>.</p>
				<p>
					Despite the emergence of blockchain alternatives like <a href="https://ipfs.tech/">IPFS</a
					>
					(InterPlanetary File System) or
					<a href="https://www.btfs.io/">BitTorrent File System 3.0</a>, we believe off-chain basic
					BitTorrent protocols without monetary incentives still fit many decentralization use
					cases. Many web3 applications could be based on what we already have, as shown in this
					<a href="https://webtorrent.io/faq">list</a>.
				</p>
				<h2 id="current-bittorrent-issues">Current BitTorrent Issues</h2>
				<p>
					After being involved in the BitTorrent ecosystem for a couple of years, we believe there
					is a lot of room for improvement. For example:
				</p>
				<h3 id="documentation">Documentation</h3>
				<p>
					The source of true for BitTorrent protocols are <a
						href="https://www.bittorrent.org/beps/bep_0000.html">BEPs</a
					>. While it&#39;s a good starting point, the information provided is often insufficient
					for implementation. Important details are sometimes missing, and there are commonly
					applied extensions that are not documented.
				</p>
				<p>
					We aim to improve the official documentation in two stages. . First, we will write new <a
						href="https://github.com/torrust/teps">Torrust Enhancement Proposals</a
					>, and some of them could be converted into BEPs if they are generic enough.
				</p>
				<p>
					Not only the official protocol documentation is sometimes vague but also clients, trackers
					implementations, etc. We think the documentations should be:
				</p>
				<ul>
					<li>Clear</li>
					<li>Comprehensive</li>
					<li>Accessible</li>
					<li>Up-to-date</li>
					<li>User-focused</li>
					<li>Interactive and engaging</li>
					<li>Easy to update and maintain</li>
				</ul>
				<p>
					And that should be for all levels, from low-level protocols to high-level end-user
					applications.
				</p>
				<p>At Torrust, we document:</p>
				<ul>
					<li>Classes</li>
					<li>Modules</li>
					<li>Crates</li>
					<li>Application (including setup, how to use, ADRs, licenses, etc)</li>
					<li>
						Processes ((including how to contribute, how to release new version, how to make
						decisions, etc)
					</li>
				</ul>
				<h3 id="sustainability">Sustainability</h3>
				<p>
					Many projects are very old, which isn&#39;t necessarily bad because they have proven to be
					robust and reliable. However, onboarding new contributors is often challenging.
				</p>
				<h3 id="scalability">Scalability</h3>
				<p>
					We haven&#39;t seen many projects ready to scale horizontally. The focus is often on
					optimization for a single server. For example, the Tracker uses memory to keep peer lists,
					making it harder to use multiple servers. While our Tracker still has this limitation,
					other trackers like <a href="https://erdgeist.org/arts/software/opentracker/"
						>opentracker</a
					> can run in a cluster.
				</p>
				<h3 id="lack-of-interest">Lack of interest</h3>
				<p>
					Despite the advent of blockchain, it seems that average people are not concerned about the
					problems of centralization. Blockchain projects might still attract developers and users,
					but BitTorrent is often seen as &quot;old&quot; technology for a problem that people
					don&#39;t see or care about.
				</p>
				<h3 id="missing-features">Missing features</h3>
				<p>
					Several missing features make it harder to use BitTorrent in modern web3 applications:
				</p>
				<ul>
					<li>
						<strong>Versioning</strong>: There is no official way to create versions of the same
						torrent. Releasing new versions requires creating a completely new torrent, which
						duplicates its contents.
					</li>
					<li>
						<strong>Guaranteed Seeding</strong>: Torrents might include URLs for seeding, but
						hosting the content when no peer is sharing the torrent can be challenging.
						Blockchain-based solutions solve this problem with monetary incentives.
					</li>
					<li>
						<strong>Standards for Content Formats</strong>: Even if you build a web3 app based on
						BitTorrent, interoperability is not guaranteed if content doesn&#39;t follow standards.
						For example, if you want to build a &quot;hiking&quot; app, you should specify the
						format of the files included in the torrents: title, description, track, images,
						waypoints, etc.
					</li>
				</ul>
				<h2 id="vision">Vision</h2>
				<p>
					Have you ever considered what would happen if the three big hosting providers (AWS, Azure,
					Google) disappeared?
				</p>
				<p>
					You would probably be affected, just like millions of others. The internet was conceived
					as a decentralized network (Usenet, DNS, Fidonet, etc.), but it has become increasingly
					centralized, raising the risk of a global collapse. Decentralized apps are more resilient,
					though more complex to build and less efficient.
				</p>
				<p>
					There is content that we should all care about, such as scientific papers, datasets, and
					user-generated data like Wikipedia.
				</p>
				<p>
					Decentralization is the only way to make data truly open and accessible for all. It also
					allows for interoperability and data migration, so data owners are not locked into a
					specific provider.
				</p>
				<p>
					Our vision is to <strong
						>enable future generations to build a resilient information repositories that ensures
						data access for everyone</strong
					>. There is a lot of valuable information locked in data centers that could be lost
					forever. For example, if you enjoy hiking, you might use an app to follow a track and find
					the starting point. This cultural heritage, created over generations, could be needed
					again in the future.
				</p>
				<h2 id="mission">Mission</h2>
				<p>
					Where does Torrust fit into this picture? We aim to improve upon this impressive
					technology. Torrust is dedicated to developing robust, fault-tolerant tools for the
					BitTorrent ecosystem, with a focus on providing good testing coverage and thorough
					documentation for developers and users alike.
				</p>
				<p>
					Our current portfolio includes a Tracker and an Index. The tracker, written in Rust, is a
					server that helps coordinate peers in the BitTorrent protocol. The Index is a website that
					serves as a database of torrent files, comprising a frontend web app (Index GUI) for user
					interaction and a backend REST API written in Rust for data and business logic (Index).
				</p>
				<p>We are planning to:</p>
				<ul>
					<li>
						Provide these two components as a first step. In the medium term, we would like to
						extract more packages that could be used by other open-source BitTorrent projects, such
						as a core tracker, a tracker client library, etc.
					</li>
					<li>
						Build the foundations (libraries, apps, etc.) that will enable the creation of better
						BitTorrent apps more efficiently in the future.
					</li>
				</ul>
				<h2 id="roadmap">Roadmap</h2>
				<p>Core:</p>
				<ul>
					<li>Implement more BEPs.</li>
					<li>Support for <a href="https://webtorrent.io/">WebTorrent</a>.</li>
					<li>
						Extract packages that could be useful for other OS projects: tracker client, tracker
						checker.
					</li>
				</ul>
				<p>New features:</p>
				<ul>
					<li>Permanent keys for the Tracker.</li>
					<li>Peer and torrents specific statistics.</li>
				</ul>
				<p>Persistence:</p>
				<ul>
					<li>Support other databases like PostgreSQL.</li>
					<li>Migration to NoSQL?.</li>
				</ul>
				<p>Performance:</p>
				<ul>
					<li>More optimizations for the tracker.</li>
				</ul>
				<p>Integrations:</p>
				<ul>
					<li>Monitoring (Prometheus).</li>
				</ul>
				<p>Improve interoperability:</p>
				<ul>
					<li>Better support for Windows.</li>
					<li>Docker images for other architectures.</li>
				</ul>
				<h2 id="why-should-you-consider-collaborating-with-us-">
					Why should you consider collaborating with us?
				</h2>
				<p>
					Torrust is an excellent way to learn and gain practical experience with Rust and
					cutting-edge technologies that are quickly gaining popularity in the industry. It is also
					a fantastic opportunity to be part of a community that values knowledge sharing and
					collaboration. You can contribute to making data more open and accessible, potentially
					building an alternative infrastructure that can help avoid data loss or monopolization,
					which can be crucial for the survival of humanity.
				</p>
				<h2 id="contributing">Contributing</h2>
				<p>If you see something wrong or you want to contribute to this article by:</p>
				<ul>
					<li>Adding new sections.</li>
					<li>Fixing typos.</li>
					<li>Making it clearer.</li>
					<li>Adding links.</li>
					<li>Or whatever you think that could be interesting to have,</li>
				</ul>
				<p>
					please open an <a href="https://github.com/torrust/torrust-website/issues">issue</a> or a
					<a href="https://github.com/torrust/torrust-website/pulls">PR</a>.
				</p>
				<p>
					If you have any questions or issues please open an issue in the corresponding repository:
				</p>
				<ul>
					<li>
						Torrust Tracker: <a href="https://github.com/torrust/torrust-tracker/issues"
							>https://github.com/torrust/torrust-tracker/issues</a
						>
					</li>
					<li>
						Torrust Index: <a href="https://github.com/torrust/torrust-index/issues"
							>https://github.com/torrust/torrust-index/issues</a
						>
					</li>
					<li>
						Torrust Website: <a href="https://github.com/torrust/torrust-index-gui/issues"
							>https://github.com/torrust/torrust-index-gui/issues</a
						>
					</li>
					<li>
						Torrust Compose: <a href="https://github.com/torrust/torrust-compose"
							>https://github.com/torrust/torrust-compose</a
						>
					</li>
					<li>
						Containerizing Rust Applications Examples: <a
							href="https://github.com/torrust/containerizing-rust-apps-examples"
							>https://github.com/torrust/containerizing-rust-apps-examples</a
						>
					</li>
				</ul>
				<p>
					We very welcome any contributions to the projects or <a
						href="https://github.com/torrust/torrust-website/issues">this article</a
					>.
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
			overflow-y: auto;
			padding-top: 0rem;
		}
	}
</style>
