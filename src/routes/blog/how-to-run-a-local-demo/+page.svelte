<script lang="ts">
	let { data } = $props();
	let currentPost = $derived(data.currentPost);
	let allPosts = $derived(data.allPosts);
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import Callout from '$lib/components/molecules/Callout.svelte';
	import CodeBlock from '$lib/components/molecules/CodeBlock.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
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
					If you want to try the Torrust Index <strong>demo</strong> on your computer, you can
					easily run it with Git and Docker. This guide will explain how to setup the demo on your
					own computer in <strong>a few seconds</strong>.
				</p>

				<h2 id="requirements">Requirements</h2>
				<p>You are going to need the following tools:</p>

				<ul>
					<li>Git</li>
					<li>Docker</li>
				</ul>

				<p>
					At the time of writing, we are using Git version <code>2.39.2</code> and Docker version
					<code>26.1.3</code>, but it should work with any recent version.
				</p>
				<p>
					By default, the demo uses SQLite3 as database driver, but you can also use MySQL. If you
					want to use SQLite3, you do not need to install anything else. If you want to take a look
					at the internal database structure or data, you can install <a
						href="https://sqlitebrowser.org/">DB Browser for SQLite</a
					>.
				</p>

				<Callout type="info">
					Although we use some small bash scripts, you can run the demo on different operating
					systems by executing the docker-compose command manually. We have tested it on Linux.
				</Callout>

				<h2 id="running-the-demo">Running the demo</h2>
				<p>
					We are going to use a temporary directory to run the demo. You can install the demo with
					the following commands:
				</p>

				<CodeBlock
					lang="bash"
					code={`mkdir -p /tmp/torrust \\
            && cd /tmp/torrust \\
            && git clone git@github.com:torrust/torrust-compose.git \\
            && cd torrust-compose/demo \\
            && ./bin/install.sh
            `}
				/>

				<p>To start the application:</p>

				<CodeBlock lang="bash" code={`./bin/start.sh`} />

				<p>To stop the application:</p>

				<CodeBlock lang="bash" code={`./bin/stop.sh`} />

				<p>
					After starting the demo you can check that all container are running with the following
					command:
				</p>

				<CodeBlock
					lang="bash"
					code={`$ docker ps
CONTAINER ID   IMAGE                       COMMAND                  CREATED         STATUS                            PORTS                                                                                                      NAMES
e380a435eede   torrust/index-gui:develop   "/usr/local/bin/entrypoint.sh"   4 seconds ago   Up 3 seconds (health: starting)   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp, 0.0.0.0:24678->24678/tcp, :::24678->24678/tcp                   torrust-index-gui-1
db8f7c679b66   torrust/index:develop       "/usr/local/bin/entrypoint.sh"   5 seconds ago   Up 3 seconds (health: starting)   0.0.0.0:3001->3001/tcp, :::3001->3001/tcp                                                                  torrust-index-1
820720c37d80   torrust/tracker:develop     "/usr/local/bin/entrypoint.sh"   5 seconds ago   Up 4 seconds (health: starting)   1313/tcp, 0.0.0.0:1212->1212/tcp, :::1212->1212/tcp, 7070/tcp, 0.0.0.0:6969->6969/udp, :::6969->6969/udp   torrust-tracker-1
a9668e78f3cc   mysql:8.0                   "docker-entrypoint.s…"   5 seconds ago   Up 4 seconds (health: starting)   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp                                                       torrust-mysql-1
c10ad938b283   dockage/mailcatcher:0.8.2   "entrypoint mailcatcher"   5 seconds ago   Up 4 seconds                      0.0.0.0:1025->1025/tcp, :::1025->1025/tcp, 0.0.0.0:1080->1080/tcp, :::1080->1080/tcp                       torrust-mailcatcher-1`}
				/>

				<Callout type="info">
					IMPORTANT! We use the latest commit from the develop branches of the Torrust repositories.
					If you want to use the latest stable version, you can change the tag for the docker images
					in the <code>docker-compose.yml</code> file.
				</Callout>

				<p>
					Once the demo is running, you go to <a href="http://localhost:3000/"
						>http://localhost:3000/</a
					> to start using it.
				</p>

				<h2 id="application-setup">Application Setup</h2>
				<p>
					The application has some public pages like the torrent list or torrent details pages. But
					other pages require authentication. To access those pages you need to create an account.
					You can do it from the signup page:
				</p>

				<p>
					<a href="http://localhost:3000/signup">http://localhost:3000/signup</a>
				</p>

				<Callout type="info">
					The first user registered will be the <code>admin</code> user. The application only has one
					admin user.
				</Callout>

				<p>
					The application is very easy to use but you can find comprehensive documentation in the
					following links:
				</p>

				<ul>
					<li>
						<a href="https://torrust.github.io/torrust-index-gui-user-guide/"
							>Torrust Index GUI User&#39;s Guide</a
						>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-index-gui/blob/develop/docs/index.md"
							>Torrust Index GUI</a
						>
					</li>
					<li>
						<a href="https://docs.rs/torrust-index">Torrust Index</a>
					</li>
					<li>
						<a href="https://docs.rs/torrust-tracker">Torrust Tracker</a>
					</li>
				</ul>

				<h2 id="advanced-setup">Advanced Setup</h2>
				<p>
					You can modify the configuration of the demo to use different ports, database drivers,
					etcetera. But we are going to use the default configuration in this guide.
				</p>
				<p>
					If you want to change the configuration for the Tracker or the Index Backend, you can do
					it by modifying the <code>config-tracker.local.toml</code> or
					<code>config-index.local.toml</code>
					files and stopping (<code>./bin/stop.sh</code>) and starting (<code>./bin/start.sh</code>)
					the docker containers again.
				</p>
				<p>
					Refer to the documentation of the corresponding application to know more about the
					configuration options:
				</p>

				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-tracker">Torrust Tracker</a>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-index">Torrust Index</a>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-index-gui">Torrust Index GUI</a>
					</li>
				</ul>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					That's it. Enjoy the demo! We will publish a new blog post soon explaining how to use the
					demo for basics tasks like uploading a torrent, adding categories or tags, etcetera.
				</p>
				<p>
					If you have any questions or issues please open an issue on the corresponding repository:
				</p>

				<ul>
					<li><a href="https://github.com/torrust/torrust-tracker/issues">Torrust Tracker</a></li>
					<li><a href="https://github.com/torrust/torrust-index/issues">Torrust Index</a></li>
					<li>
						<a href="https://github.com/torrust/torrust-index-gui/issues">Torrust Index GUI</a>
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
		color: var(--color-link);
	}

	.content-preview > p,
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
