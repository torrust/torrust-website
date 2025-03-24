<script lang="ts">
	let { data } = $props();
	let { currentPost, allPosts } = data;
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
					In our quest to elevate the Torrust BitTorrent Tracker&#39;s performance, we&#39;ve
					embraced a suite of sophisticated benchmarking and profiling tools. This article builds on
					our previous discussion, &quot;<a href="benchmarking-the-torrust-bittorrent-tracker"
						>Benchmarking the Torrust BitTorrent Tracker</a
					>&quot; and delves into the metrics that guide our optimization efforts. Join us as we
					explore the intricacies of profiling in the dynamic landscape of BitTorrent technology.
				</p>
				<p>
					In the previous article we introduced to the community the benchmarking tools we are using
					at the moment to know whether the Tracker performs at the same level as other applications
					on the market.
				</p>
				<p>
					With those benchmarking tools we ensure that the Tracker has a good performance and we
					don&#39;t have regressions. If you are curious about how we do benchmarking you can read
					the &quot;<a href="benchmarking-the-torrust-bittorrent-tracker"
						>Benchmarking the Torrust BitTorrent Tracker</a
					>&quot; article.
				</p>
				<p>
					In this article we will explain how we are collecting metrics to know which parts of the
					code we should improve.
				</p>
				<h2 id="understanding-the-tracker">Understanding The Tracker</h2>
				<p>
					Before you continue reading this article you should know a little bit about the tracker
					internal structure. You can see an overview on the &quot;<a
						href="benchmarking-the-torrust-bittorrent-tracker"
						>Benchmarking the Torrust BitTorrent Tracker</a
					>&quot; article.
				</p>

				<Image
					src="/images/posts/benchmarking-the-torrust-bittorrent-tracker/torrust-tracker-simplified-architecture.png"
					alt="Torrust Architecture"
				/>

				<h2 id="current-challenges">Current Challenges</h2>
				<p>
					Balancing feature-rich functionality with performance is our central challenge. The <strong
						>Torrents Repository</strong
					>, a critical component, has been our focus, serving as the primary bottleneck for scaling
					request handling capabilities.
				</p>
				<p>
					Regardless which protocol clients use to connect to the tracker, eventually all requests
					reach the internal &quot;Tracker&quot; domain service. This tracker contains a repository
					with the list of all torrents. Each entry on the list contains two pieces of information:
				</p>
				<ul>
					<li>
						<strong>The statistics about that torrent</strong>: number of seeders, leechers and
						peers that have completed downloading.
					</li>
					<li>
						<strong>The peer list</strong>: a list of all the clients announcing the same torrent
						(swarm).
					</li>
				</ul>

				<CodeBlock
					lang="json"
					code={`{
	"info_hash": "090c6d4fb3a03191c4ef1fda6236ef0efb2d5c10",
	"seeders": 1,
	"completed": 1,
	"leechers": 0,
	"peers": [
		{
			"peer_id": {
				"id": "0x2d71423030303030303030303030303030303031",
				"client": null
			},
			"peer_addr": "0.0.0.0:17548",
			"updated": 1709916034742,
			"updated_milliseconds_ago": 1709916034742,
			"uploaded": 0,
			"downloaded": 0,
			"left": 0,
			"event": "Completed"
		}
	]
}`}
				/>

				<p>
					The reason why we have been focusing on that part is because we think that&#39;s the main
					bottleneck if we want to increase the number of requests the tracker can handle per
					second.
				</p>
				<p>
					The <code>announce</code> request is the most important request a tracker needs to handle.
					Peers get the list of other peers from the tracker by making announce requests. The purpose
					of that request is:
				</p>
				<ul>
					<li>
						To include the peer making the request in the list of peers which are seeding or
						downloading the torrent.
					</li>
					<li>
						Return the list of other peers so that the client can start asking for torrent pieces to
						the other peers.
					</li>
				</ul>
				<p>
					Every request is a write/read request. The system is intensive in writes. All requests
					eventually try to acquire a write lock to include themselves in the peer list. That&#39;s
					why we think that&#39;s the main bottleneck in our implementation, at the moment. For that
					reason we have been trying different implementations of the torrents repository:
				</p>

				<CodeBlock
					lang="rust"
					code={`pub type TorrentsRwLockStd = RwLockStd<EntrySingle>;
pub type TorrentsRwLockStdMutexStd = RwLockStd<EntryMutexStd>;
pub type TorrentsRwLockStdMutexTokio = RwLockStd<EntryMutexTokio>;
pub type TorrentsRwLockTokio = RwLockTokio<EntrySingle>;
pub type TorrentsRwLockTokioMutexStd = RwLockTokio<EntryMutexStd>;
pub type TorrentsRwLockTokioMutexTokio = RwLockTokio<EntryMutexTokio>;
pub type TorrentsSkipMapMutexStd = CrossbeamSkipList<EntryMutexStd>; // Default
pub type TorrentsSkipMapMutexParkingLot = CrossbeamSkipList<EntryMutexParkingLot>;
pub type TorrentsSkipMapRwLockParkingLot = CrossbeamSkipList<EntryRwLockParkingLot>;
pub type TorrentsDashMapMutexStd = XacrimonDashMap<EntryMutexStd>;`}
				/>

				<p>
					The default implementation used in production is <code>TorrentsSkipMapMutexStd</code>.
				</p>

				<Callout type="info">
					<strong>NOTICE</strong>: All implementations are based on types that support ordering like
					<code>BTreeMap</code> or <code>SkipMap</code>. The reason we use those types is because
					the tracker API has an endpoint where you can get the ordered list of all torrents in the
					tracker repository.
				</Callout>

				<h2 id="internal-repository-benchmarking">Internal Repository Benchmarking</h2>
				<p>
					As we explained in a previous article (&quot;<a
						href="benchmarking-the-torrust-bittorrent-tracker"
						>Benchmarking the Torrust BitTorrent Tracker</a
					>&quot;) you can run the benchmark for those different repository implementations with the
					following command:
				</p>

				<CodeBlock lang="bash" code={`cargo bench -p torrust-tracker-torrent-repository`} />

				<p>The output at the time of writing this post is similar to:</p>

				<CodeBlock
					lang="bash"
					code={`Running benches/repository_benchmark.rs (target/release/deps/repository_benchmark-a9b0013c8d09c3c3)
add_one_torrent/RwLockStd
    time:   [63.057 ns 63.242 ns 63.506 ns]
Found 12 outliers among 100 measurements (12.00%)
  2 (2.00%) low severe
  2 (2.00%) low mild
  2 (2.00%) high mild
  6 (6.00%) high severe

add_one_torrent/RwLockStdMutexStd
    time:   [62.505 ns 63.077 ns 63.817 ns]
Found 11 outliers among 100 measurements (11.00%)
  4 (4.00%) high mild
  7 (7.00%) high severe

Benchmarking add_one_torrent/RwLockStdMutexTokio: Collecting 100 samples in estimated 1.0004 s (10M iterations)
add_one_torrent/RwLockStdMutexTokio
    time:   [98.440 ns 98.551 ns 98.660 ns]
Found 4 outliers among 100 measurements (4.00%)
  3 (3.00%) low mild
  1 (1.00%) high severe

add_one_torrent/RwLockTokio
    time:   [107.84 ns 108.18 ns 108.54 ns]
Found 3 outliers among 100 measurements (3.00%)
  2 (2.00%) low mild
  1 (1.00%) high mild

Benchmarking add_one_torrent/RwLockTokioMutexStd: Collecting 100 samples in estimated 1.0001 s (8.7M iterations)
add_one_torrent/RwLockTokioMutexStd
    time:   [116.34 ns 116.48 ns 116.63 ns]
Found 2 outliers among 100 measurements (2.00%)
  1 (1.00%) high mild
  1 (1.00%) high severe

Benchmarking add_one_torrent/RwLockTokioMutexTokio: Collecting 100 samples in estimated 1.0005 s (6.9M iterations)
add_one_torrent/RwLockTokioMutexTokio
    time:   [143.39 ns 143.51 ns 143.63 ns]`}
				/>

				<h2 id="profiling-with-valgrind">Profiling With Valgrind</h2>
				<p>
					&quot;Valgrind is an instrumentation framework for building dynamic analysis tools&quot;.
					In fact it&#39;s a suite of tools. The tool we are going to use is <code>callgrind</code>
					which collects data that can be later visualized with <code>kcachegrind</code>.
				</p>
				<p>
					Valgrind, coupled with Kcachegrind, offers a powerful profiling solution for in-depth
					analysis of BitTorrent tracker performance. By simulating cache behavior and collecting
					call graphs, developers gain valuable insights into code execution dynamics and potential
					optimizations.
				</p>
				<p>In order to profile the UDP tracker you need to:</p>
				<ol>
					<li>Build and run the tracker for profiling.</li>
					<li>Make requests to the tracker while it&#39;s running.</li>
				</ol>
				<p>Build and run the binary for profiling with:</p>
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
		color: rgba(255, 49, 0, 1);
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
