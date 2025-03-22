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
				<p>
					Photo by David Dibert: <a
						href="https://www.pexels.com/photo/a-flock-of-geese-flying-7177008/"
						>https://www.pexels.com/photo/a-flock-of-geese-flying-7177008/</a
					>.
				</p>
				<p>Hello, Torrust community!</p>
				<p>
					We&#39;re always looking for ways to enhance your experience with Torrust, and today,
					we&#39;re excited to unveil our latest addition: <a
						href="https://github.com/torrust/torrents-importer-sample"
						>A sample migration tool written in Rust</a
					>, specifically designed for those looking to seamlessly import torrents from other
					sources into our
					<a href="https://github.com/torrust/torrust-index-backend">Torrust Index</a>!
				</p>

				<h2 id="why-this-tool-">Why this tool?</h2>
				<p>
					Many in our community have asked us for an efficient method to migrate torrents from their
					current Index/Trackers to Torrust. Recognizing this need, we took it upon ourselves to
					develop a solution that would make this process as hassle-free as possible.
				</p>
				<p>
					On the other hand, we have been doing an intensive testing of the Torrust Index Backend.
					We wanted to test the backend with a large set of real torrents. We found the site <a
						href="https://academictorrents.com/">https://academictorrents.com/</a
					> which has thousands of torrents and they kindly make them public available.
				</p>
				<p>
					We decided to create a tool that would allow us to import torrents from this site into our
					Torrust Index. This tool is a sample project that we are sharing with the community. We
					hope that it will be useful for those who want to migrate their torrents to Torrust.
				</p>
				<p>
					The example repo is <a href="https://github.com/torrust/torrents-importer-sample"
						>https://github.com/torrust/torrents-importer-sample</a
					>
				</p>
				<h2 id="capabilities">Capabilities</h2>
				<p>The migration tool sample offers a straightforward way to:</p>
				<ul>
					<li>
						Fetch Torrents from XML Lists: The tool takes torrents from a list in an XML file,
						ensuring you don’t have to manually pick and transfer torrents one by one.
					</li>
					<li>
						Download Torrents from Other Sites: No more downloading and re-uploading! Our tool will
						directly fetch the torrents for you.
					</li>
					<li>
						Upload to Torrust: With the help of the Torrust Index REST API, the torrents are then
						uploaded into our software, ready for classification and use.
					</li>
				</ul>
				<p>
					While our initial test run has been on an index containing academic torrents, the tool is
					versatile enough to handle a variety of sources. The underlying principles remain the
					same.
				</p>

				<Callout type="info">
					<strong>Disclaimer</strong>: This sample project is not intended to be a production-ready
					tool. It is a sample project that we are sharing with the community. We hope that it will
					be useful for those who want to migrate their torrents to Torrust. For larger datasets it
					would be convenient to handle errors asynchronously. In the current version the
					application exists immediately when something goes wrong and you have to handle the
					problem yourself and restart it.
				</Callout>

				<p>
					You will problably need to rewrite the whole &quot;source&quot; part of the application to
					adapt it to your needs. The &quot;destination&quot; part should be reusable as it is.
				</p>
				<p>When you run the importer, the output will be something like this:</p>

				<CodeBlock
					lang="bash"
					code={`$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.02s
     Running 'target/debug/torrents-importer-sample'
API login with username admin ...
Logged as admin with account admin
Reading file ./data/database.xml ...
Processing channel ...
  Title: Mandelbrot Set Collection
  description: Torrents with Mandelbrot Set Images
  Link: https://github.com/torrust/torrents-importer-sample
Processing only 1 torrent ...
Processing torrent #1 ...
  Title: MandelBrot Set 01
  Category: Fractal
  Infohash: 0c90fbf036e28370c1ec773401bc7620146b1d48
  Guid: https://raw.githubusercontent.com/torrust/torrents-importer-sample/main/tests/fixtures/torrents/mandelbrot_set_01.torrent
  Link: https://raw.githubusercontent.com/torrust/torrents-importer-sample/main/tests/fixtures/torrents/mandelbrot_set_01.torrent
  Description:  ...
  Size: 17130410419
Checking if the torrent 0c90fbf036e28370c1ec773401bc7620146b1d48 exist in the Torrust Index ...
Downloading the torrent file from the source server ...
Downloading torrent from https://raw.githubusercontent.com/torrust/torrents-importer-sample/main/tests/fixtures/torrents/0c90fbf036e28370c1ec773401bc7620146b1d48.torrent into ./data/torrents/0c90fbf036e28370c1ec773401bc7620146b1d48.torrent
Torrent successfully downloaded.
Uploading the torrent 0c90fbf036e28370c1ec773401bc7620146b1d48 to the Torrust Index ...
response: 200
Torrent uploaded UploadedTorrent {
    torrent_id: 2529,
    info_hash: "0c90fbf036e28370c1ec773401bc7620146b1d48",
}
Processed torrents: 1
Uploaded torrents:  1`}
				/>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					Being a sample project, we believe that there&#39;s always room for improvement. We invite
					the Torrust community to use the tool, provide feedback, and even contribute to its
					enhancement. Together, we can refine it and adapt it to cater to more diverse needs.
				</p>
				<p>
					We&#39;re committed to evolving and making Torrust a go-to solution for all torrent
					aficionados. Our new migration tool is just one step in this journey. Whether you&#39;re a
					casual user or an enterprise looking to migrate a large number of torrents, our tool aims
					to make the transition smoother for you.
				</p>
				<p>
					A big shout-out to everyone involved in this project! We encourage everyone to give it a
					try and share your experiences. Together, let&#39;s make the world of torrents even more
					connected and accessible.
				</p>
				<p>Happy torrenting!</p>
				<h2 id="links">Links</h2>
				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-index-backend">The Torrust Index Backend</a
						>.
					</li>
					<li>
						<a href="https://github.com/torrust/torrents-importer-sample"
							>The Torrust Torrents Importer Sample</a
						>.
					</li>
				</ul>
				<h2 id="acknowledgments">Acknowledgments</h2>
				<p>
					We would like to acknowledge the team from <a href="https://academictorrents.com/"
						>https://academictorrents.com/</a
					> for their great work and for making their torrents public available.
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
						Torrust Tracker: <a href="https://github.com/torrust/torrust-tracker/issues"
							>https://github.com/torrust/torrust-tracker/issues</a
						>
					</li>
					<li>
						Torrust Index Backend: <a href="https://github.com/torrust/torrust-index-backend/issues"
							>https://github.com/torrust/torrust-index-backend/issues</a
						>
					</li>
					<li>
						Torrust Index Frontend: <a
							href="https://github.com/torrust/torrust-index-frontend/issues"
							>https://github.com/torrust/torrust-index-frontend/issues</a
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
