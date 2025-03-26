<script lang="ts">
	let { data } = $props();
	let { currentPost, allPosts } = data;
	import Toc from '$lib/components/atoms/Toc.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
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
	<a
		href="https://www.pexels.com/photo/shallow-focus-photography-of-black-and-silver-compasses-on-top-of-map-1203808"
	>
		Photo by Alex Andrews.
	</a>
	<PagesWrapper>
		<div class="wrapper">
			<Toc class="toc" />
			<div id="toc-contents" class="content-preview">
				<h2>Introduction</h2>

				<p>
					Usually, when we think about Torrents, we think about a program used to download files
					from a group of people through the internet. But some of those users don’t know what a
					tracker is.
				</p>

				<p>
					In this article, I will explain a BitTorrent tracker and the two types of trackers (public
					and private).
				</p>

				<h2>What is a BitTorrent Tracker</h2>

				<p>
					A BitTorrent tracker is a server (actually an app running on a server) that helps peers
					who use the BitTorrent protocol share their files.
				</p>

				<p>
					It is responsible for keeping track of what peer machines (BitTorrent clients and their
					IPs) have what files and whether they are available or not, so when you add a .torrent
					file to your torrent client, the tracker lets you know where to start getting parts of
					that file.
				</p>

				<p>
					It also helps with the communication between peers and data transmission, making the
					entire process more efficient.
				</p>

				<p>
					When downloading files, the client will go back to the tracker every once in a while to
					send statistics and improve the download speed, as it gets newly updated info about other
					peers sharing the files.
				</p>

				<h2>Public trackers</h2>

				<p>
					Public trackers are open to everybody. They don’t require registration, even though some
					will allow it and provide benefits to those users. They usually contain torrent files
					about different themes (music, films, games, etc.).
				</p>

				<p>
					They are the most straightforward way to get torrents, which may be a good starting point
					for beginners.
				</p>

				<p>There are also some cons when using public trackers.</p>

				<p>
					Malware can be found in torrent files and websites, which many people use. It is the
					perfect target for people with malicious intentions. You should always check for .exe,
					.bat or other executable files, and remember to read the comments of the torrent file you
					want to download.
				</p>

				<p>
					You can also wait a few days if the torrent is new and let other people test the file and
					see if they comment about the torrent containing any malware.
				</p>

				<p>
					Another downside regarding security is that if you don’t use methods to avoid tracking,
					like a VPN, anyone can get access to your IP.
				</p>

				<p>
					Also, public trackers may attract more attention from authorities. Hence, using public
					trackers to download illegal stuff has a greater chance of getting you into trouble.
				</p>

				<h2>Private trackers</h2>

				<p>
					Private trackers require registration. Some of them are also hidden, and their access
					depends on private invitations or a process defined by the tracker. It may include an
					interview or other means.
				</p>

				<p>Private trackers usually contain better-quality torrents and hard-to-find ones.</p>

				<p>
					They might ask you to have a good ratio, so when using them, you need to make sure you
					share files and download them, which can be cumbersome at times.
				</p>

				<p>
					It is still recommended that you use a VPN to increase privacy and security; people can
					still access your IP if not hidden, and authorities can still lurk around private
					torrents.
				</p>

				<p>Also, always be aware of malware on private trackers.</p>

				<p>
					I also recommend using common sense regarding sharing private information in the interview
					process, which some private trackers require.
				</p>

				<h2>BitTorrent Index vs BitTorrent Tracker</h2>

				<p>
					It is essential to differentiate between a BitTorrent tracker and an index, as some people
					use the terms index and tracker indistinctively when, actually, there are two different
					things.
				</p>

				<p>
					A BitTorrent index is a website that serves as a directory of classified torrent files
					where users can search for and download them.
				</p>

				<p>
					When you download a torrent file from a BitTorrent index site, it usually contains a list
					of URLs for trackers where your client can request torrent pieces.
				</p>

				<p>
					Often, the index site has an associated tracker that is included in the list of tracker
					URLs in the torrent file.
				</p>

				<p>
					A tracker, as previously described above, takes care of efficient data transmission
					between the peers in the swarm when sharing files using the BitTorrent protocol.
				</p>

				<p><strong>I hope you have found this article useful!</strong></p>

				<p>
					If you have any questions or issues regarding this post, please [open an
					issue](https://github.com/torrust/torrust-website/issues/new).
				</p>

				<p>
					For any other questions or issues related to Torrust repositories, please open an issue on
					the corresponding repository:
				</p>

				<ul>
					<li><a href="https://github.com/torrust/torrust-tracker/issues">Torrust Tracker</a></li>
					<li>
						<a href="https://github.com/torrust/torrust-index-backend/issues"
							>Torrust Index Backend</a
						>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-index-frontend/issues"
							>Torrust Index Frontend</a
						>
					</li>
				</ul>

				<p>We very welcome any contributions to the project!</p>
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
