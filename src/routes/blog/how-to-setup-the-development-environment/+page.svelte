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
					Before explaining how to setup the development environment, it&#39;s important to
					understand how the Torrust Index works. The Torrust Index is composed of multiple
					services, each one with its own codebase and repository. The services are:
				</p>
				<ul>
					<li>
						A <a href="https://github.com/torrust/torrust-tracker">BitTorrent Tracker</a>, which is
						responsible for tracking the torrents and providing the peers to the clients.
					</li>
					<li>
						The <a href="https://github.com/torrust/torrust-index">Index</a>, which is a REST API
						that provides the data to the frontend.
					</li>
					<li>
						And the <a href="https://github.com/torrust/torrust-index-gui">Index GUI</a>, which is a
						webapp that displays the data to the user.
					</li>
				</ul>

				<Image src="/images/posts/torrust-architecture.png" alt="Torrust Architecture" />

				<p>
					You do not need to setup all services to contribute to the Torrust Index, but in this
					article we will explain how to setup the full development environment, which includes all
					services. Sometimes you might want to contribute with a full feature that involves
					multiple services, so it&#39;s useful to have the full development environment setup.
				</p>
				<p>Setting up the development environment requires to setup the three main services.</p>
				<p>
					First, we need to create the folder (in this example, a temp folder) where we will store
					the repositories of our services.
				</p>

				<CodeBlock
					lang="bash"
					code={`cd /tmp/
mkdir -p torrust
cd torrust`}
				/>

				<Callout type="info">
					This guide uses bash commands and it has been tested on Ubuntu Ubuntu 23.04. You should
					not encounter any problem if you are using a different Linux distribution, but there are
					some reported issues with Windows compilation for the Tracker. The installation scripts
					are very simple, so you can easily adapt them to your system or run the commands manually.
				</Callout>

				<h2 id="common-dependencies">Common Dependencies</h2>
				<p>
					If you are using SQLite3 as database driver for the Tracker or the Backend, you will need
					to install the following dependency:
				</p>

				<CodeBlock lang="bash" code={`sudo apt-get install libsqlite3-dev`} />

				<h2 id="set-up-the-torrust-tracker">Set Up the Torrust Tracker</h2>
				<p>This tutorial is tested with this Rust version:</p>
				<ul>
					<li>rustc 1.80.0-nightly (9cdfe285c 2024-05-22)</li>
				</ul>
				<p>
					Since we are using the openssl crate with the <a
						href="https://docs.rs/openssl/latest/openssl/#vendored">vendored</a
					> feature, enabled, you will need to install the following dependencies:
				</p>

				<CodeBlock lang="bash" code={`sudo apt-get install pkg-config libssl-dev make`} />

				<p>
					Now, we will build the tracker and create the storage folders where persistent data like
					databases will be stored:
				</p>

				<CodeBlock
					lang="bash"
					code={`git clone https://github.com/torrust/torrust-tracker.git \\
  && cd torrust-tracker \\
  && cargo build \\
  && mkdir -p ./storage/tracker/lib/database \\
  && mkdir -p ./storage/tracker/lib/tls \\
  && mkdir -p ./storage/tracker/etc`}
				/>

				<p>You can run the Tracker with the following command:</p>

				<CodeBlock lang="bash" code={`cargo run`} />

				<Callout type="info">
					NOTICE: You do not need to change the default values for development.
				</Callout>

				<p>
					After running the Tracker with <code>cargo run</code> you should see the following output:
				</p>

				<CodeBlock
					lang="bash"
					code={`Finished \`dev\` profile [optimized + debuginfo] target(s) in 0.09s
Running \`target/debug/torrust-tracker\`
Loading configuration from default configuration file: \`./share/default/config/tracker.development.sqlite3.toml\` ...
2024-05-27T11:39:21.332802857+01:00 [torrust_tracker::bootstrap::logging][INFO] logging initialized.
2024-05-27T11:39:21.333426924+01:00 [UDP TRACKER][INFO] Starting on: udp://0.0.0.0:6969
2024-05-27T11:39:21.333462384+01:00 [torrust_tracker::bootstrap::jobs][INFO] TLS not enabled
2024-05-27T11:39:21.333491694+01:00 [HTTP TRACKER][INFO] Starting on: http://0.0.0.0:7070
2024-05-27T11:39:21.333599174+01:00 [HTTP TRACKER][INFO] Started on: http://0.0.0.0:7070
2024-05-27T11:39:21.333615604+01:00 [torrust_tracker::bootstrap::jobs][INFO] TLS not enabled
2024-05-27T11:39:21.333814923+01:00 [API][INFO] Starting on http://127.0.0.1:1212
2024-05-27T11:39:21.333839143+01:00 [API][INFO] Started on http://127.0.0.1:1212
2024-05-27T11:39:21.333883712+01:00 [HEALTH CHECK API][INFO] Starting on: http://127.0.0.1:1313
2024-05-27T11:39:21.333948472+01:00 [HEALTH CHECK API][INFO] Started on: http://127.0.0.1:1313`}
				/>

				<Callout type="info">
					IMPORTANT: Every time you change the configuration you need to restart the service.
				</Callout>

				<p>
					By default, if you don&#39;t specify any <code>Config.toml</code> file, the application will
					use this:
				</p>

				<CodeBlock
					lang="bash"
					code={`Loading default configuration file: \`./share/default/config/tracker.development.sqlite3.toml\` ..`}
				/>

				<p>
					You can&#39;t change that file because it&#39;s a template included in the repo. If you
					want to set your custom configuration, you can either:
				</p>
				<ol>
					<li>Use a different path for the config file.</li>
					<li>Inject the configuration with an environment variable.</li>
				</ol>
				<h2 id="custom-config-file">Custom config file</h2>
				<p>First, copy the template file to the storage folder:</p>

				<CodeBlock
					lang="bash"
					code={`cp share/default/config/tracker.development.sqlite3.toml storage/tracker/etc/tracker.toml`}
				/>

				<p>Then, you can change any value and finally run the tracker with:</p>

				<CodeBlock
					lang="bash"
					code={`TORRUST_TRACKER_CONFIG_TOML_PATH="./storage/tracker/etc/tracker.toml" cargo run`}
				/>

				<p>That would give you this output:</p>

				<CodeBlock
					lang="bash"
					code={`TORRUST_TRACKER_CONFIG_TOML_PATH="./storage/tracker/etc/tracker.toml" cargo run
    Finished \`dev\` profile [optimized + debuginfo] target(s) in 0.09s
Running \`target/debug/torrust-tracker\`
Loading configuration from file: \`./storage/tracker/etc/tracker.toml\` ...
2024-05-27T12:52:00.364641064+01:00 [torrust_tracker::bootstrap::logging][INFO] logging initialized.
2024-05-27T12:52:00.365277963+01:00 [UDP TRACKER][INFO] Starting on: udp://0.0.0.0:6969
2024-05-27T12:52:00.365309093+01:00 [torrust_tracker::bootstrap::jobs][INFO] TLS not enabled
2024-05-27T12:52:00.365355473+01:00 [HTTP TRACKER][INFO] Starting on: http://0.0.0.0:7070
2024-05-27T12:52:00.365496743+01:00 [HTTP TRACKER][INFO] Started on: http://0.0.0.0:7070
2024-05-27T12:52:00.365504943+01:00 [torrust_tracker::bootstrap::jobs][INFO] TLS not enabled
2024-05-27T12:52:00.365596502+01:00 [API][INFO] Starting on http://127.0.0.1:1212
2024-05-27T12:52:00.365599702+01:00 [API][INFO] Started on http://127.0.0.1:1212
2024-05-27T12:52:00.365616862+01:00 [HEALTH CHECK API][INFO] Starting on: http://127.0.0.1:1313
2024-05-27T12:52:00.365711472+01:00 [HEALTH CHECK API][INFO] Started on: http://127.0.0.1:1313`}
				/>

				<h2 id="inject-the-configuration-with-an-environment-variable">
					Inject the configuration with an environment variable
				</h2>
				<p>You can also inject the configuration with:</p>

				<CodeBlock
					lang="bash"
					code={`TORRUST_TRACKER_CONFIG_TOML=\`cat share/default/config/tracker.development.sqlite3.toml\` cargo run`}
				/>

				<Callout type="info">
					NOTICE: We load the whole file into the env var. This is not useful for development, but
					it's a different way to inject the configuration. It's used when running the tracker with
					docker.
				</Callout>

				<p>The response should be like this:</p>

				<CodeBlock
					lang="json"
					code={`{
	"torrents": 0,
	"seeders": 0,
	"completed": 0,
	"leechers": 0,
	"tcp4_connections_handled": 0,
	"tcp4_announces_handled": 0,
	"tcp4_scrapes_handled": 0,
	"tcp6_connections_handled": 0,
	"tcp6_announces_handled": 0,
	"tcp6_scrapes_handled": 0,
	"udp4_connections_handled": 0,
	"udp4_announces_handled": 0,
	"udp4_scrapes_handled": 0,
	"udp6_connections_handled": 0,
	"udp6_announces_handled": 0,
	"udp6_scrapes_handled": 0
}`}
				/>

				<p>
					For more details about the Torrust Tracker, check the <a
						href="https://docs.rs/torrust-tracker/">Tracker documentation</a
					>.
				</p>
				<h2 id="set-up-the-torrust-index">Set Up the Torrust Index</h2>
				<p>This tutorial has been tested with this Rust version:</p>
				<ul>
					<li>rustc 1.80.0-nightly (9cdfe285c 2024-05-22)</li>
				</ul>
				<p>
					To run the tests you will also need to install a command line tool to handle torrent files
					called <a href="https://github.com/casey/intermodal">imdl</a>. You can install it with the
					following command:
				</p>

				<CodeBlock lang="bash" code={`cargo install imdl`} />

				<p>
					You will also need to install a tool for database migrations if you are going to make
					changes to the database schema. We are using <a href="https://github.com/launchbadge/sqlx"
						>SQLx</a
					>. You can install it with the following command:
				</p>

				<CodeBlock lang="bash" code={`cargo install sqlx-cli`} />

				<p>We will now clone the <code>torrust-index</code> repository:</p>

				<CodeBlock
					lang="bash"
					code={`git clone https://github.com/torrust/torrust-index.git \\
  && cd torrust-index \\
  && cargo build \\
  && mkdir -p ./storage/index/lib/database \\
  && mkdir -p ./storage/index/lib/tls`}
				/>

				<p>You can run the Torrust Index with the following commands:</p>

				<CodeBlock lang="bash" code={`TORRUST_INDEX_API_CORS_PERMISSIVE=true cargo run`} />

				<p>
					As you can see we are using the environment variable <code
						>TORRUST_IDX_BACK_CORS_PERMISSIVE</code
					>
					to enable a permissive CORS policy. The default port for the Backend is <code>3001</code>
					and for the web server serving the frontend application is <code>3000</code>. Since they
					are different ports, we need to tell the backend to allow requests from a different port
					so that the frontend can make request to the API. To know more about CORS, check the
					<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
						>Mozilla CORS documentation</a
					>.
				</p>
				<p>
					After running the Index with <code>TORRUST_INDEX_API_CORS_PERMISSIVE=true cargo run</code>
					you should see the following output:
				</p>

				<CodeBlock
					lang="bash"
					code={`Loading configuration from default configuration file: \`./share/default/config/index.development.sqlite3.toml\` ...
2024-05-27T12:56:25.300980998+01:00 [torrust_index::bootstrap::logging][INFO] logging initialized.
2024-05-27T12:56:25.425949219+01:00 [torrust_index::web::api::server][INFO] TLS not enabled
2024-05-27T12:56:25.425976429+01:00 [torrust_index::console::cronjobs::tracker_statistics_importer][INFO] Tracker statistics importer launcher started
2024-05-27T12:56:25.426077258+01:00 [torrust_index::console::cronjobs::tracker_statistics_importer][INFO] Tracker statistics importer cronjob starting ...
2024-05-27T12:56:25.426233288+01:00 [torrust_index::web::api::server][INFO] Starting API server with net config: 0.0.0.0:3001 ...
2024-05-27T12:56:25.426290848+01:00 [torrust_index::console::cronjobs::tracker_statistics_importer][INFO] Tracker statistics importer API server listening on http://127.0.0.1:3002
2024-05-27T12:56:25.426250898+01:00 [torrust_index::console::cronjobs::tracker_statistics_importer][INFO] Running tracker statistics importer every 2000 milliseconds ...
2024-05-27T12:56:25.427603675+01:00 [torrust_index::web::api::server][INFO] API server listening on http://0.0.0.0:3001`}
				/>

				<p>
					You should be able to load the API entrypoint on <a href="http://0.0.0.0:3001/"
						>http://0.0.0.0:3001/</a
					>
				</p>

				<Image
					src="/images/posts/torrust-backend-api-entrypoint-response-screenshot.png"
					alt="Screenshot of Torrust Backend API entrypoint response"
				/>

				<p>
					For more details about the Torrust Index Backend, check the <a
						href="https://docs.rs/torrust-index/">Index Backend documentation</a
					>.
				</p>
				<h2 id="set-up-the-torrust-index-gui">Set Up the Torrust Index GUI</h2>
				<p>At the time of writing, the Index GUI requires:</p>
				<ul>
					<li>Node: <code>^v20.12.2</code></li>
				</ul>
				<p>The frontend is a <a href="https://nuxt.com/">Nuxt</a> application.</p>
				<p>
					The last repository we need to clone is the <code>torrust-index-gui</code> repository . Remember
					to install Node.js and we need to be in the torrust folder to clone the repository.
				</p>

				<CodeBlock
					lang="bash"
					code={`git clone https://github.com/torrust/torrust-index-gui.git \\
  && cd torrust-index-gui \\
  && npm install \\
  && cp .env.local .env \\
  && npm run dev`}
				/>

				<p>You should see the following output:</p>

				<Image
					src="/images/posts/how-to-setup-the-development-environment/npm-run-dev-output.png"
					alt="Screenshot of Torrust Index GUI running from the terminal"
				/>

				<p>
					Go to <a href="http://localhost:3000/torrents">http://localhost:3000/torrents</a> and you should
					see the torrent list page page:
				</p>

				<Image
					src="/images/posts/how-to-setup-the-development-environment/index-gui-after-fresh-install.png"
					alt="Screenshot of torrent list page on the browser"
				/>

				<p>
					For more details about the Torrust Index GUI, check the <a
						href="https://github.com/torrust/torrust-index-gui">Index GUI documentation</a
					>.
				</p>
				<h2 id="application-setup">Application Setup</h2>
				<p>
					There are some public pages like the torrent list or torrent details pages. But there are
					some pages that require authentication like the admin pages or the pages for uploading or
					editing torrents.
				</p>
				<p>
					To access those pages you need to create an account. You can do it from the signup page:
				</p>
				<p><a href="http://localhost:3000/signup">http://localhost:3000/signup</a></p>

				<Callout type="info">
					The first user created will be the <code>admin</code> user.
				</Callout>

				<h2 id="development-tools">Development tools</h2>
				<p>
					We found some tools very useful to develop the Torrust Tracker and Index. We hope you find
					them useful too.
				</p>
				<ul>
					<li>
						DB Browser for SQLite: <a href="https://sqlitebrowser.org/"
							>https://sqlitebrowser.org/</a
						>
					</li>
					<li>
						BitTorrent client: qBittorrent <a href="https://www.qbittorrent.org/"
							>https://www.qbittorrent.org/</a
						>
					</li>
					<li>
						Torrent file editor: imdl <a href="https://github.com/casey/intermodal"
							>https://github.com/casey/intermodal</a
						>
					</li>
					<li>
						DaisyUI component library: <a href="https://daisyui.com/components/"
							>https://daisyui.com/components/</a
						>
					</li>
				</ul>
				<h2 id="conclusion">Conclusion</h2>
				<p>
					As you can see, the Torrust Tracker and Index are very easy to set up. We hope you find
					this guide useful. You might have problems:
				</p>
				<ul>
					<li>
						Setting up some of the projects on Windows. <a
							href="https://github.com/torrust/torrust-tracker/issues/325">We are working on it</a
						>.
					</li>
					<li>Or with some missing system dependencies.</li>
				</ul>
				<p>
					If you have any questions or issues please open an issue on the corresponding repository:
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
						Torrust Index GUI: <a href="https://github.com/torrust/torrust-index-gui/issues"
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
