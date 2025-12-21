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
				<h1>Hello, Torrust community!</h1>
				<p>
					We are thrilled to introduce our newest project: <a href="https://hash2torrent.com/"
						>Hash2Torrent</a
					>, a web service that allows you to easily retrieve torrent files using only their
					infohash (version 1).
				</p>
				<p>
					Hash2Torrent is designed to make torrent management more accessible and user-friendly,
					without the need to install a BitTorrent client.
				</p>

				<Callout type="success">https://hash2torrent.com</Callout>

				<p>
					In our quest to find a straightforward tool that allows users to download torrent files
					directly from an infohash, we discovered that there wasn&#39;t a simple, reliable service
					available. We set out to change that by creating Hash2Torrent — a service that fills this
					gap. With Hash2Torrent, you can now quickly download torrent files by simply entering the
					infohash on our website (<a href="https://hash2torrent.com/">hash2torrent.com</a>) or
					using a direct URL format:
				</p>

				<Callout type="info">
					<pre><code>https://hash2torrent.com/&#123;info-hash&#125;</code></pre>
				</Callout>

				<p>
					For example: <a href="https://hash2torrent.com/443c7602b4fde83d1154d6d9da48808418b181b6"
						>https://hash2torrent.com/443c7602b4fde83d1154d6d9da48808418b181b6</a
					>
				</p>

				<Callout type="warning">
					The service does NOT download the contents described in the torrent file. It only ask
					other peers for the torrent file, also called metainfo file. Besides, the file (called
					metadata in BEP 9) includes only the info dictionary because is the only part covered by
					the info-hash. See <a href="https://www.bittorrent.org/beps/bep_0009.html">BEP 9</a> for more
					information.
				</Callout>

				<h2 id="implementation">Implementation</h2>
				<p>
					The project is a thin API wrapper that uses the Rust BitTorrent client <a
						href="https://github.com/ikatson/rqbit">rqbit</a
					>. rqbit has an option to add a torrent to the client in <code>list-only</code> mode, meaning
					the torrent is not downloaded, but only listed in the client. When you add a new torrent from
					a magnet-link, the client automatically gets the torrent file from other peers if it&#39;s
					available.
				</p>
				<p>
					The API generates a magnet-link for the info-hash and adds that magnet-link to the client
					in <code>list-only</code> mode. The clients returns the torrent file.
				</p>

				<Callout type="warning">
					For the time being, the service API only returns a direct (not user-friendly) timeout
					(408) if the client behind the service can't find any peer having that torrent.
				</Callout>

				## Alternative Methods Traditionally, if you wanted to retrieve a torrent file using its
				infohash, you would have to: - Open a BitTorrent client that supports DHT (Distributed Hash
				Table). - Add the infohash as a magnet link. - Wait for the client to find peers that have
				the torrent file. While this method works, it can be cumbersome and is not ideal if you're
				looking for a lightweight solution or need to automate the process for integration into
				other services.

				<Callout type="info">
					<strong>NOTICE:</strong> You need the DHT to find other peers having the torrent. In the future
					we could also also user to introduce a magnet-link that may contain a list of trackers. In
					that case, the client could use those tracker to find peers.
				</Callout>

				<h2 id="benefits-of-using-hash2torrent">Benefits of Using Hash2Torrent</h2>
				<p>Hash2Torrent is all about simplicity and ease of integration:</p>
				<ul>
					<li>
						<strong>User-Friendly Interface:</strong> Just like a Google search, simply type the infohash
						into our form, click download, and if peers are available, the torrent file will be downloaded
						within seconds.
					</li>
					<li>
						<strong>Direct URL Access:</strong> Use our direct URL format to fetch torrent files programmatically,
						making it ideal for integration with other tools and services.
					</li>
					<li>
						<strong>Efficiency:</strong> No need to deal with BitTorrent clients or complex setups. Hash2Torrent
						is the simplest way to get a torrent file from an infohash. We have also added a torrents
						cache so it will be even faster if the torrent is already cached.
					</li>
					<li>
						<strong>Contribution to the Ecosystem:</strong> By providing this service, we aim to empower
						the community with more tools that enhance the overall BitTorrent experience.
					</li>
				</ul>

				<Callout type="info">
					Try it out! Visit Hash2Torrent (<a href="https://hash2torrent.com/">hash2torrent.com</a>)
					and give it a try with your favorite torrents' infohashes. We are eager to hear your
					feedback and suggestions.
				</Callout>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					We built Hash2Torrent to make torrent retrieval from infohashes as easy as possible.
					Whether you&#39;re a casual user who needs the occasional torrent file or a developer
					looking to integrate torrent retrieval into your application, Hash2Torrent is here to
					help.
				</p>
				<p>
					This project is just one of the many ways we plan to contribute to the BitTorrent
					ecosystem by providing practical, user-friendly tools. We believe in building a more
					accessible torrenting experience for everyone, and Hash2Torrent is a significant step in
					that direction. We are excited to continue innovating and supporting the community with
					more tools like this!
				</p>
				<p>Happy torrenting!</p>
				<h2 id="links">Links</h2>
				<ul>
					<li><a href="https://hash2torrent.com/">The live demo</a>.</li>
					<li><a href="https://github.com/torrust/torrust-hash2torrent">Github repo</a>.</li>
				</ul>
				<h2 id="acknowledgments">Acknowledgments</h2>
				<p>
					A massive thank you to all contributors who made this project possible, especially those
					involved in developing the Rust-based BitTorrent client that powers Hash2Torrent,
					specially to <a href="https://github.com/ikatson">Igor Katson</a> whose work underpins Hash2Torrent.
					Their dedication and contributions have been instrumental in bringing this service to life.
				</p>
				<p>
					If you have any questions or issues regarding this post, please <a
						href="https://github.com/torrust/torrust-website/issues/new">open an issue</a
					>.
				</p>
				<p>
					For any other questions or issues related to Torrust repositories, please open an issue on
					the corresponding repository:
				</p>
				<ul>
					<li>
						Torrust Hash2Torrent: <a href="https://github.com/torrust/torrust-hash2torrent/issues"
							>https://github.com/torrust/torrust-hash2torrent/issues</a
						>
					</li>
					<li>
						Torrust Tracker: <a href="https://github.com/torrust/torrust-tracker/issues"
							>https://github.com/torrust/torrust-tracker/issues</a
						>
					</li>
					<li>
						Torrust Index Backend: <a href="https://github.com/torrust/torrust-index/issues"
							>https://github.com/torrust/torrust-index/issues</a
						>
					</li>
					<li>
						Torrust Index Frontend: <a href="https://github.com/torrust/torrust-index-gui/issues"
							>https://github.com/torrust/torrust-index-gui/issues</a
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
