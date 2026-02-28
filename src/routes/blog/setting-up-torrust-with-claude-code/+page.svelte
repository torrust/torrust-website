<script lang="ts">
	let { data } = $props();
	let currentPost = $derived(data.currentPost);
	let allPosts = $derived(data.allPosts);
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
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
				<h2 id="introduction">A Complete Development Environment Guide</h2>
				<p>
					Based on a real terminal session, this guide documents the complete process of setting up
					the Torrust BitTorrent index development environment using Claude Code, including all the
					challenges encountered and solutions applied.
				</p>
				<h2 id="overview">Overview</h2>
				<p>
					Torrust is a modern BitTorrent index system built with Rust and Vue.js, consisting of
					three main components:
				</p>
				<ul>
					<li>torrust-tracker – BitTorrent tracker backend (Rust)</li>
					<li>torrust-index – API backend for torrent indexing (Rust)</li>
					<li>torrust-index-gui – Web frontend (Nuxt.js/Vue.js)</li>
				</ul>

				<h2 id="setting-up-torrust-with-claude-code">Setting Up Torrust with Claude Code</h2>
				<h4 id="comprehensive-project-analysis">Comprehensive Project Analysis</h4>
				<p>Claude Code immediately analyzed the project structure and identified all components:</p>
				<CodeBlock
					lang="bash"
					code={`📁 torrust-tracker/      # Rust BitTorrent tracker
📁 torrust-index/        # Rust API backend
📁 torrust-index-gui/    # Nuxt.js frontend
📄 docker-compose.yml    # Container orchestration
📄 .env                  # Environment configuration`}
				/>
				<h4 id="dependency-verification">Dependency Verification</h4>
				<p>Claude Code verified the presence of required tools:</p>
				<ul>
					<li>✅ Rust toolchain (including nightly)</li>
					<li>✅ Node.js v20.12.2</li>
					<li>✅ Development tools (imdl, sqlx-cli)</li>
				</ul>

				<h4 id="following-official-documentation">Following Official Documentation</h4>
				<p>
					Claude Code followed the <a
						href="https://torrust.com/blog/how-to-setup-the-development-environment"
						>official Torrust development guide</a
					>, ensuring full compatibility with the intended setup process.
				</p>

				<h2 id="build-process">Build Process</h2>
				<h3 id="step-1-building-components">Step 1: Building Components</h3>
				<CodeBlock
					lang="bash"
					code={`# Build Torrust Tracker
cd torrust-tracker && cargo build

# Build Torrust Index  
cd torrust-index && cargo build

# Setup GUI dependencies
cd torrust-index-gui && npm install
cp .env.local .env`}
				/>
				<p>✅ All components built successfully without modification.</p>
				<h3 id="step-2-storage-directory-creation">Step 2: Storage Directory Creation</h3>
				<CodeBlock
					lang="bash"
					code={`# Tracker storage directories
mkdir -p ./torrust-tracker/storage/tracker/lib/database
mkdir -p ./torrust-tracker/storage/tracker/lib/tls
mkdir -p ./torrust-tracker/storage/tracker/etc

# Index storage directories
mkdir -p ./torrust-index/storage/index/lib/database
mkdir -p ./torrust-index/storage/index/lib/tls`}
				/>
				<p>✅ Directory structure matched the expected configuration.</p>
				<h2 id="major-issues-encountered-and-solutions">Major Issues Encountered and Solutions</h2>

				<h4 id="issue-1-database-initialization-failures">
					Issue 1: Database Initialization Failures
				</h4>
				<p><strong>Error:</strong></p>
				<CodeBlock
					lang="bash"
					code={`unable to open database file: ./storage/tracker/lib/database/sqlite3.db
thread 'main' panicked...`}
				/>
				<p><strong>Root Cause:</strong> The app expected an existing SQLite DB file.</p>
				<p><strong>Fix:</strong></p>
				<CodeBlock
					lang="bash"
					code={`touch storage/tracker/lib/database/sqlite3.db
touch storage/index/lib/database/sqlite3.db`}
				/>
				<p>
					✅ Why it worked: Torrust expects existing DB files and doesn’t create them automatically.
				</p>

				<h4 id="issue-2-port-conflicts">Issue 2: Port Conflicts</h4>
				<p><strong>Error:</strong></p>
				<CodeBlock
					lang="bash"
					code={`importer API TCP listener to bind to socket address: Os { code: 48, ... "Address already in use" }
`}
				/>

				<p><strong>Root Cause:</strong> Multiple Index services running on the same port.</p>
				<p><strong>Fix:</strong></p>
				<CodeBlock
					lang="bash"
					code={`lsof -i :3001
kill <pid>`}
				/>

				<p>✅ Why it worked: Ensured only one instance was listening on each port.</p>

				<h4 id="issue-3-cors-configuration-problems">Issue 3: CORS Configuration Problems</h4>
				<p><strong>Error:</strong></p>
				<CodeBlock
					lang="bash"
					code={`Access to fetch at 'http://localhost:3001/v1/user/token/renew' from origin 'http://localhost:3000' has been blocked by CORS policy...
`}
				/>
				<p><strong>Root Cause:</strong> The required CORS environment variable wasn’t set.</p>
				<p><strong>Fix:</strong></p>
				<CodeBlock lang="bash" code={`TORRUST_INDEX_API_CORS_PERMISSIVE=true cargo run`} />
				<p>
					✅ Why it worked: Claude identified TORRUST_INDEX_API_CORS_PERMISSIVE from source code and
					activated permissive CORS.
				</p>

				<h2 id="how-claude-code-helped">How Claude Code Helped</h2>
				<ul>
					<li>
						🔍 <strong>Systematic Debugging</strong>
						<ul>
							<li>Analyzed logs line-by-line</li>
							<li>Identified root causes instead of surface fixes</li>
							<li>Used diagnostic tools like <code>lsof</code>, <code>curl</code></li>
						</ul>
					</li>
					<li>
						📖 <strong>Code Analysis</strong>
						<ul>
							<li>Read source code to identify config logic</li>
							<li>Found undocumented environment variables</li>
							<li>Verified DB initialization logic in Rust code</li>
						</ul>
					</li>
					<li>
						⚙️ <strong>Service Orchestration</strong>
						<ul>
							<li>Ensured proper service startup order</li>
							<li>Understood dependencies between services</li>
						</ul>
					</li>
					<li>
						✅ <strong>Testing and Verification</strong>
						<ul>
							<li>Used <code>curl</code> to test APIs</li>
							<li>Verified CORS headers</li>
							<li>Confirmed DB presence</li>
						</ul>
					</li>
				</ul>

				<h2 id="final-working-setup">Final Working Setup</h2>

				<h3 id="required-running-services">Required Running Services (3 terminals)</h3>
				<ul>
					<li>
						<strong>Terminal 1 – Tracker</strong>
						<CodeBlock
							lang="bash"
							code={`cd torrust-tracker
cargo run`}
						/>
					</li>
					<li>
						<strong>Terminal 2 – Index</strong>
						<CodeBlock
							lang="bash"
							code={`cd torrust-index
TORRUST_INDEX_API_CORS_PERMISSIVE=true cargo run`}
						/>
					</li>
					<li>
						<strong>Terminal 3 – GUI</strong>
						<CodeBlock
							lang="bash"
							code={`cd torrust-index-gui
npm run dev`}
						/>
					</li>
				</ul>
				<h3 id="access-points">Access Points</h3>
				<ul>
					<li>🌐 GUI: <a href="http://localhost:3000/">http://localhost:3000/</a></li>
					<li>🔗 Index API: <a href="http://localhost:3001/">http://localhost:3001/</a></li>
					<li>🎯 Tracker: UDP: 6969, HTTP: 7070, API: 1212</li>
				</ul>

				<h2 id="clean-setup-guide-for-others">Clean Setup Guide for Others</h2>

				<h3 id="prerequisites">🧰 Prerequisites</h3>
				<ul>
					<li>Rust (nightly)</li>
					<li>Node.js v20.12.2+</li>
					<li>Git</li>
				</ul>

				<h3 id="setup-steps">📦 Setup Steps</h3>
				<CodeBlock
					lang="bash"
					code={`# Install Rust tools
cargo install imdl sqlx-cli

# Clone repos
mkdir torrust-dev && cd torrust-dev
git clone https://github.com/torrust/torrust-tracker.git
git clone https://github.com/torrust/torrust-index.git
git clone https://github.com/torrust/torrust-index-gui.git

# Build tracker
cd torrust-tracker && cargo build
mkdir -p storage/tracker/lib/database storage/tracker/lib/tls storage/tracker/etc
touch storage/tracker/lib/database/sqlite3.db

# Build index
cd ../torrust-index && cargo build
mkdir -p storage/index/lib/database storage/index/lib/tls
touch storage/index/lib/database/sqlite3.db

# Setup GUI
cd ../torrust-index-gui && npm install
cp .env.local .env`}
				/>

				<h2 id="key-takeaways">Key Takeaways</h2>
				<ul>
					<li>
						<strong>Database Files Are Critical:</strong> Must be created manually before app startup
					</li>
					<li>
						<strong>CORS Must Be Explicitly Enabled:</strong> Set
						<code>TORRUST_INDEX_API_CORS_PERMISSIVE=true</code>
					</li>
					<li>
						<strong>Service Dependencies Matter:</strong> GUI → Index → Tracker (start in that order)
					</li>
					<li>
						<strong>Expected 404s Are Normal:</strong> Token endpoint returns 404 if no user is logged
						in
					</li>
					<li>
						<strong>Claude Code Excels at Systematic Setup:</strong> It debugged, read source, and diagnosed
						like a seasoned engineer
					</li>
				</ul>

				<h2 id="conclusion">Conclusion</h2>
				<p>
					This setup process demonstrates how Claude Code can assist with complex multi-service
					development environments. By combining log analysis, source code reading, and iterative
					testing, it enabled a clean and fully functional Torrust development environment — even in
					the face of port conflicts, missing DBs, and CORS issues.
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
