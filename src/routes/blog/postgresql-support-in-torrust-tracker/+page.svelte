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
					We are excited to announce that
					<a
						href="https://github.com/torrust/torrust-tracker"
						target="_blank"
						rel="noopener noreferrer">Torrust Tracker</a
					>
					now supports
					<strong
						><a href="https://www.postgresql.org/" target="_blank" rel="noopener noreferrer"
							>PostgreSQL</a
						></strong
					>
					as a first-class database backend, alongside the existing
					<a href="https://www.sqlite.org/" target="_blank" rel="noopener noreferrer">SQLite</a> and
					<a href="https://www.mysql.com/" target="_blank" rel="noopener noreferrer">MySQL</a> drivers.
					This has been a long-standing feature request, and it is the result of a long journey that involved
					a full overhaul of the persistence layer, new tooling, and valuable contributions from the community.
				</p>
				<p>
					In this post we will walk through the history of this feature, explain what changed under
					the hood, highlight the new tooling built along the way, and share our plans for the
					upcoming major release.
				</p>

				<h2 id="a-long-requested-feature">A Long-Requested Feature</h2>
				<p>
					The first request for PostgreSQL support was filed back on <strong
						>September 20, 2023</strong
					>
					in
					<a
						href="https://github.com/torrust/torrust-tracker/issues/462"
						target="_blank"
						rel="noopener noreferrer">issue #462</a
					>. PostgreSQL is widely used in production environments and it was a natural fit for
					operators who already run PostgreSQL infrastructure and want to avoid introducing a second
					database engine.
				</p>
				<p>
					At the time, however, adding PostgreSQL support was not straightforward. The tracker's
					persistence layer was synchronous, using the
					<a href="https://crates.io/crates/r2d2" target="_blank" rel="noopener noreferrer"
						><code>r2d2</code></a
					>
					connection pool crate with
					<a href="https://crates.io/crates/rusqlite" target="_blank" rel="noopener noreferrer"
						><code>rusqlite</code></a
					>
					and
					<a href="https://crates.io/crates/mysql" target="_blank" rel="noopener noreferrer"
						><code>mysql</code></a
					>. The problem is that the
					<a href="https://crates.io/crates/postgres" target="_blank" rel="noopener noreferrer"
						><code>postgres</code></a
					>
					crate wraps
					<a
						href="https://crates.io/crates/tokio-postgres"
						target="_blank"
						rel="noopener noreferrer"><code>tokio_postgres</code></a
					>, which tries to spawn a nested
					<a href="https://tokio.rs/" target="_blank" rel="noopener noreferrer">Tokio</a> runtime —
					something that conflicts with the tracker's existing async runtime. The community
					<a
						href="https://github.com/torrust/torrust-tracker/pull/1684"
						target="_blank"
						rel="noopener noreferrer">PR #1684</a
					> worked around this by spawning a fresh OS thread per database operation, but that approach
					was rejected as a performance concern: under load, each query would pay the cost of OS thread
					creation and context switching.
				</p>
				<p>
					The real fix was to migrate all drivers to an async-native library. Rather than bolt
					PostgreSQL on top of the synchronous stack with a workaround, we decided to do the right
					thing first: replace <code>r2d2</code> / <code>rusqlite</code> / <code>mysql</code> with
					async
					<a href="https://crates.io/crates/sqlx" target="_blank" rel="noopener noreferrer"
						><code>sqlx</code></a
					> across all drivers, and then add PostgreSQL on top of that clean foundation.
				</p>

				<h2 id="the-persistence-overhaul-epic">The Persistence Overhaul EPIC</h2>
				<p>
					In May 2025 we opened
					<a
						href="https://github.com/torrust/torrust-tracker/issues/1525"
						target="_blank"
						rel="noopener noreferrer">EPIC #1525 — Overhaul persistence</a
					>, which became the umbrella for all the work needed before PostgreSQL could be added
					cleanly. The driving insight was the
					<a href="https://martinfowler.com/" target="_blank" rel="noopener noreferrer"
						>Martin Fowler</a
					> quote we kept returning to:
				</p>
				<blockquote>"Make the change easy, then make the easy change."</blockquote>
				<p>
					The EPIC was broken down into two phases and nine sequential sub-issues, each
					independently reviewable and mergeable into <code>develop</code>.
				</p>

				<h3 id="phase-1-make-the-change-easy">Phase 1 — Make the Change Easy</h3>
				<p>Before touching a single PostgreSQL file, we had to modernise the persistence stack:</p>
				<ol>
					<li>
						<strong>Persistence test coverage</strong> — A compatibility-matrix CI workflow that
						tests the tracker against a range of supported SQLite, MySQL, and PostgreSQL versions
						(see the
						<a href="#db-compatibility-matrix">DB Compatibility Matrix</a> section below).
					</li>
					<li>
						<strong>qBittorrent end-to-end runner</strong> — A Rust binary that runs a full seeder → tracker
						→ leecher download using real, containerised qBittorrent clients, so we can verify correct
						behaviour at the protocol level.
					</li>
					<li>
						<strong>Persistence benchmarking</strong> — A benchmark runner (<code
							>persistence_benchmark_runner</code
						>) that measures per-operation latency for each driver using <code>--driver</code>,
						<code>--db-version</code>, and <code>--ops</code> flags, and outputs a JSON report for easy
						diffing across runs.
					</li>
					<li>
						<strong>Split persistence traits</strong> — The monolithic <code>Database</code> trait
						was split into four narrow context traits (<code>SchemaMigrator</code>,
						<code>TorrentMetricsStore</code>, <code>WhitelistStore</code>,
						<code>AuthKeyStore</code>) plus a blanket aggregate supertrait, reducing coupling and
						making each driver easier to implement and test in isolation.
					</li>
					<li>
						<strong>Migrate SQLite and MySQL to sqlx</strong> — Both existing drivers were rewritten
						using async <code>sqlx</code> connection pools, replacing the old synchronous
						<code>r2d2</code> / <code>rusqlite</code> / <code>mysql</code> stack.
					</li>
					<li>
						<strong>Introduce schema migrations</strong> — Raw DDL was replaced with
						<code>sqlx::migrate!()</code>, and a legacy-bootstrap path was added to history-align
						databases that were created before migrations existed.
					</li>
					<li>
						<strong>Align Rust and DB types</strong> — The MySQL download-counter columns were
						widened from <code>INTEGER</code> (signed 32-bit, max ~2.1 billion) to
						<code>BIGINT</code> via a versioned migration. The Rust type
						<code>NumberOfDownloads</code> stays <code>u32</code> — the wider column is intentional; the
						application type bounds writes at compile time.
					</li>
				</ol>

				<h3 id="phase-2-make-the-easy-change">Phase 2 — Make the Easy Change</h3>
				<p>
					With the foundation in place, adding PostgreSQL (sub-issue <strong>1525-08</strong>,
					tracked in
					<a
						href="https://github.com/torrust/torrust-tracker/issues/1723"
						target="_blank"
						rel="noopener noreferrer">issue #1723</a
					>) became straightforward:
				</p>
				<ul>
					<li>
						A new <code>Driver::PostgreSQL</code> variant in the configuration crate (serialises as
						<code>"postgresql"</code>).
					</li>
					<li>
						Four PostgreSQL migration files, timestamp-aligned with the existing SQLite/MySQL
						history.
					</li>
					<li>
						A new <code>postgres.rs</code> driver implementing all four narrow traits via async
						<code>sqlx</code>.
					</li>
					<li>Wiring in the driver factory and setup dispatch.</li>
					<li>
						<a href="https://testcontainers.com/" target="_blank" rel="noopener noreferrer"
							>Testcontainers</a
						>-based driver tests and environment-gated execution.
					</li>
					<li>
						The compatibility-matrix, qBittorrent E2E runner, and benchmark runner all extended for
						PostgreSQL.
					</li>
					<li>Default PostgreSQL container config and updated documentation.</li>
				</ul>

				<h2 id="community-contribution">A Community-Driven Feature</h2>
				<p>
					A key part of this story is the contribution from community member
					<a href="https://github.com/DamnCrab" target="_blank" rel="noopener noreferrer"
						>DamnCrab</a
					>. They opened
					<a
						href="https://github.com/torrust/torrust-tracker/pull/1684"
						target="_blank"
						rel="noopener noreferrer">PR #1684</a
					>
					with an initial PostgreSQL implementation using
					<a href="https://crates.io/crates/r2d2_postgres" target="_blank" rel="noopener noreferrer"
						><code>r2d2_postgres</code></a
					>, which started the conversation about the right approach. Their follow-up
					<a
						href="https://github.com/torrust/torrust-tracker/pull/1695"
						target="_blank"
						rel="noopener noreferrer">PR #1695</a
					>
					incorporated review feedback, and reviewer guidance was provided in
					<a
						href="https://github.com/torrust/torrust-tracker/pull/1700"
						target="_blank"
						rel="noopener noreferrer">PR #1700</a
					>
					to help bridge the gap.
				</p>
				<p>Three ideas from DamnCrab's work were retained in the final implementation:</p>
				<ul>
					<li>
						The DB compatibility matrix script to validate tracker compatibility across database
						versions.
					</li>
					<li>
						End-to-end tests using a real BitTorrent client (containerised
						<a href="https://www.qbittorrent.org/" target="_blank" rel="noopener noreferrer"
							>qBittorrent</a
						>).
					</li>
					<li>
						Basic database benchmarking to compare persistence performance before/after the <code
							>sqlx</code
						> migration and across database engines.
					</li>
				</ul>
				<p>
					Thank you, DamnCrab, for the contributions and ideas that made their way into the final
					result.
				</p>

				<h2 id="new-tooling">New Tooling</h2>
				<p>
					The overhaul produced several tools that are useful beyond just adding PostgreSQL support:
				</p>
				<h3 id="db-compatibility-matrix">DB Compatibility Matrix</h3>
				<p>
					A
					<a
						href="https://github.com/torrust/torrust-tracker/blob/develop/.github/workflows/db-compatibility.yaml"
						target="_blank"
						rel="noopener noreferrer"
						>GitHub Actions workflow (<code>db-compatibility.yaml</code>)</a
					>
					that runs the tracker's full driver test suite against a matrix of database versions on every
					push and pull request:
				</p>
				<ul>
					<li><strong>MySQL</strong>: 8.0, 8.4</li>
					<li><strong>PostgreSQL</strong>: 14, 15, 16, 17</li>
				</ul>
				<p>
					Each combination spins up a real container via
					<a href="https://testcontainers.com/" target="_blank" rel="noopener noreferrer"
						>testcontainers</a
					>
					and runs the driver tests with the <code>db-compatibility-tests</code> feature flag. This explicitly
					documents which database versions the tracker is compatible with, and protects users who run
					infrastructure with a version that differs from what the developers typically test against.
					If a new database release introduces a breaking change, the matrix catches it before it reaches
					users.
				</p>

				<h3 id="qbittorrent-e2e-runner">qBittorrent End-to-End Runner</h3>
				<p>
					A
					<a href="https://www.rust-lang.org/" target="_blank" rel="noopener noreferrer">Rust</a>
					binary that runs a complete BitTorrent transfer — seeder announces, leecher connects, download
					completes — using real
					<a href="https://www.qbittorrent.org/" target="_blank" rel="noopener noreferrer"
						>qBittorrent</a
					> clients running in containers. This is the closest we can get to a real-world integration
					test without deploying to production.
				</p>
				<h3 id="benchmark-runner">Benchmark Runner</h3>
				<p>
					The
					<a
						href="https://github.com/torrust/torrust-tracker/blob/develop/packages/tracker-core/src/bin/persistence_benchmark_runner.rs"
						target="_blank"
						rel="noopener noreferrer"><code>persistence_benchmark_runner</code></a
					>
					is a developer binary that measures the persistence-layer operations implemented by the
					<code>Database</code> trait. It benchmarks one driver per invocation and prints a JSON
					report to standard output with per-operation timing statistics: <code>count</code>,
					<code>best</code>,
					<code>median</code>, and <code>worst</code> in microseconds.
				</p>
				<p>Run it with:</p>
				<CodeBlock
					lang="bash"
					code={`# SQLite
cargo run -p bittorrent-tracker-core --bin persistence_benchmark_runner -- \\
  --driver sqlite3

# MySQL
cargo run -p bittorrent-tracker-core --bin persistence_benchmark_runner -- \\
  --driver mysql --db-version 8.4

# PostgreSQL
cargo run -p bittorrent-tracker-core --bin persistence_benchmark_runner -- \\
  --driver postgresql --db-version 16`}
				/>
				<p>
					The output is plain JSON so you can redirect it to a file, diff runs, or feed it into any
					visualisation tool:
				</p>
				<CodeBlock
					lang="bash"
					code={`cargo run -p bittorrent-tracker-core --bin persistence_benchmark_runner -- \\
  --driver sqlite3 > .benchmarks/bench-results-sqlite3.json`}
				/>
				<p>A sample report looks like this:</p>
				<CodeBlock
					lang="json"
					code={`{
  "meta": {
    "git_revision": "16c9c8a4...",
    "driver": "sqlite3",
    "db_version": "-",
    "ops": 100,
    "timestamp": "2026-04-28T16:23:24Z"
  },
  "operations": [
    {
      "name": "save_torrent_downloads",
      "count": 100,
      "best_us": 66,
      "median_us": 70,
      "worst_us": 79
    }
  ]
}`}
				/>
				<p>
					It is intentionally simple — there is no built-in comparison mode. The value comes from
					running it before and after a change (or across drivers) and diffing the JSON files. This
					makes it easy to catch performance regressions early, without the overhead of a full
					criterion benchmark suite.
				</p>
				<p>
					There is also a
					<a
						href="https://github.com/torrust/torrust-tracker/blob/develop/.github/workflows/db-benchmarking.yaml"
						target="_blank"
						rel="noopener noreferrer">GitHub Actions workflow (<code>db-benchmarking.yaml</code>)</a
					>
					that runs the benchmark against all three drivers on every push and pull request. It runs with
					<code>--ops 10</code> — just enough to confirm the binary builds and executes cleanly — rather
					than producing statistically significant numbers. The main purpose in CI is to catch compilation
					breakages and driver-level errors early, not to track performance over time.
				</p>

				<Callout type="info">
					Detailed documentation for all three tools is available in the
					<a
						href="https://github.com/torrust/torrust-tracker"
						target="_blank"
						rel="noopener noreferrer">Torrust Tracker repository</a
					>.
				</Callout>

				<h2 id="benchmark-results">Benchmark Results</h2>
				<p>
					With all three drivers in place we ran the benchmark runner for the first time across all
					engines on the same machine (AMD Ryzen 9 7950X, Ubuntu 25.10, Docker 28.3.3) with
					<code>--ops 100</code>. The full report is available in the repository at
					<a
						href="https://github.com/torrust/torrust-tracker/blob/develop/packages/tracker-core/docs/benchmarking/runs/2026-05-01/REPORT.md"
						target="_blank"
						rel="noopener noreferrer"><code>docs/benchmarking/runs/2026-05-01/REPORT.md</code></a
					>.
				</p>

				<h3 id="benchmark-results-total-time">Total benchmark time</h3>
				<table>
					<thead>
						<tr>
							<th>Driver</th>
							<th>Total (ms)</th>
						</tr>
					</thead>
					<tbody>
						<tr><td>SQLite3</td><td>119 ms</td></tr>
						<tr><td>MySQL 8.4</td><td>6 372 ms</td></tr>
						<tr><td>MySQL 8.0</td><td>7 272 ms</td></tr>
						<tr><td>PostgreSQL 17</td><td>1 451 ms</td></tr>
					</tbody>
				</table>

				<h3 id="benchmark-results-per-operation">Per-operation medians (µs)</h3>
				<table>
					<thead>
						<tr>
							<th>Operation</th>
							<th>SQLite3</th>
							<th>MySQL 8.4</th>
							<th>MySQL 8.0</th>
							<th>PostgreSQL 17</th>
						</tr>
					</thead>
					<tbody>
						<tr><td>save_torrent_downloads</td><td>89</td><td>769</td><td>984</td><td>298</td></tr>
						<tr><td>load_torrent_downloads</td><td>23</td><td>112</td><td>115</td><td>88</td></tr>
						<tr
							><td>load_all_torrents_downloads</td><td>77</td><td>172</td><td>171</td><td>146</td
							></tr
						>
						<tr
							><td>increase_downloads_for_torrent</td><td>70</td><td>773</td><td>1 005</td><td
								>302</td
							></tr
						>
						<tr><td>save_global_downloads</td><td>76</td><td>793</td><td>1 066</td><td>299</td></tr>
						<tr><td>load_global_downloads</td><td>21</td><td>115</td><td>137</td><td>86</td></tr>
						<tr
							><td>increase_global_downloads</td><td>67</td><td>774</td><td>1 036</td><td>305</td
							></tr
						>
						<tr
							><td>add_info_hash_to_whitelist</td><td>81</td><td>735</td><td>981</td><td>294</td
							></tr
						>
						<tr
							><td>get_info_hash_from_whitelist</td><td>21</td><td>109</td><td>118</td><td>95</td
							></tr
						>
						<tr><td>load_whitelist</td><td>55</td><td>161</td><td>175</td><td>135</td></tr>
						<tr
							><td>remove_info_hash_from_whitelist</td><td>81</td><td>766</td><td>962</td><td
								>293</td
							></tr
						>
						<tr><td>add_key_to_keys</td><td>81</td><td>750</td><td>974</td><td>292</td></tr>
						<tr><td>get_key_from_keys</td><td>22</td><td>118</td><td>129</td><td>95</td></tr>
						<tr><td>load_keys</td><td>77</td><td>167</td><td>189</td><td>155</td></tr>
						<tr><td>remove_key_from_keys</td><td>73</td><td>739</td><td>994</td><td>300</td></tr>
					</tbody>
				</table>

				<h3 id="benchmark-results-takeaways">Takeaways</h3>
				<ul>
					<li>
						<strong>SQLite3 is the fastest</strong> for single-node, embedded use cases — no network round-trip,
						everything in-process. It is best suited for development, testing, or single-server deployments
						where concurrent write load is low.
					</li>
					<li>
						<strong>PostgreSQL 17 comfortably beats both MySQL versions</strong> for write operations.
						Write medians (~290–305 µs) are roughly 2.5–3× faster than MySQL 8.0 and ~60% faster than
						MySQL 8.4.
					</li>
					<li>
						<strong>Read performance is comparable</strong> between PostgreSQL 17 and MySQL 8.4 for
						simple lookups; aggregate reads (<code>load_*</code>) are slightly slower on PostgreSQL.
					</li>
					<li>
						<strong>Overall PostgreSQL is significantly faster than MySQL</strong> in total benchmark
						time (1 451 ms vs 6 372 ms for MySQL 8.4), driven primarily by faster write operations.
					</li>
				</ul>
				<p>
					These numbers are the first PostgreSQL baseline. Future runs will track regressions as the
					persistence layer continues to evolve, and will provide a growing picture of how the
					drivers compare over time.
				</p>

				<h2 id="roadmap">What's Next</h2>
				<p>
					PostgreSQL support is already merged into the <code>develop</code> branch and will be
					included in the next major release (<strong>v4.0.0</strong>), which we are planning to
					ship this year — though no date is set yet. If you want to try it out today, you can build
					from
					<code>develop</code> and set the driver in your tracker configuration:
				</p>
				<CodeBlock
					lang="toml"
					code={`[core.database]
driver = "postgresql"
path = "postgresql://USER:PASSWORD@localhost:5432/DBNAME"`}
				/>
				<p>
					A default Docker Compose configuration for PostgreSQL is also included in the repository,
					so you can spin up a local instance with a single command.
				</p>
				<h2 id="resources">Resources &amp; External Links</h2>
				<ul>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/issues/462"
							target="_blank"
							rel="noopener noreferrer"
						>
							torrust-tracker#462 — Original PostgreSQL feature request (Sep 2023)
						</a>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/issues/1525"
							target="_blank"
							rel="noopener noreferrer"
						>
							torrust-tracker#1525 — EPIC: Overhaul persistence
						</a>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/issues/1723"
							target="_blank"
							rel="noopener noreferrer"
						>
							torrust-tracker#1723 — Sub-issue 1525-08: Add PostgreSQL driver
						</a>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/pull/1684"
							target="_blank"
							rel="noopener noreferrer"
						>
							torrust-tracker PR#1684 — Community PR: Add PostgreSQL database driver (DamnCrab)
						</a>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/pull/1695"
							target="_blank"
							rel="noopener noreferrer"
						>
							torrust-tracker PR#1695 — Community follow-up PR (DamnCrab)
						</a>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/pull/1700"
							target="_blank"
							rel="noopener noreferrer"
						>
							torrust-tracker PR#1700 — Reviewer guidance and additional changes
						</a>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/pull/1725"
							target="_blank"
							rel="noopener noreferrer"
						>
							torrust-tracker PR#1725 — Close EPIC #1525: persistence overhaul
						</a>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/blob/develop/packages/tracker-core/docs/benchmarking/runs/2026-05-01/REPORT.md"
							target="_blank"
							rel="noopener noreferrer"
						>
							Benchmark report 2026-05-01 — first run including PostgreSQL 17 baseline
						</a>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/blob/develop/packages/tracker-core/src/bin/persistence_benchmark_runner.rs"
							target="_blank"
							rel="noopener noreferrer"
						>
							persistence_benchmark_runner.rs — source code of the benchmark runner binary
						</a>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/blob/develop/.github/workflows/db-benchmarking.yaml"
							target="_blank"
							rel="noopener noreferrer"
						>
							db-benchmarking.yaml — GitHub Actions workflow running benchmarks on every push/PR
						</a>
					</li>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/blob/develop/.github/workflows/db-compatibility.yaml"
							target="_blank"
							rel="noopener noreferrer"
						>
							db-compatibility.yaml — GitHub Actions workflow testing MySQL and PostgreSQL version
							compatibility
						</a>
					</li>
					<li>
						<a href="https://github.com/launchbadge/sqlx" target="_blank" rel="noopener noreferrer">
							sqlx — Async, pure-Rust SQL toolkit
						</a>
					</li>
					<li>
						<a
							href="https://kerkour.com/rust-postgres-everything"
							target="_blank"
							rel="noopener noreferrer"
						>
							Rust, PostgreSQL, and sqlx — article by @skerkour
						</a>
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

	ul,
	ol {
		display: flex;
		flex-direction: column;
		list-style-type: disc;
		margin: 0;
		padding-left: 1.5rem;
		word-break: keep-all;
	}

	ol {
		list-style-type: decimal;
	}

	ul li,
	ol li {
		margin: 0.25rem 0;
		word-break: keep-all;
	}

	blockquote {
		border-left: 4px solid rgba(254, 13, 0, 0.6);
		padding: 0.5rem 1rem;
		margin: 1rem 0;
		color: rgba(245, 245, 245, 0.7);
		font-style: italic;
	}

	code {
		background-color: rgba(0, 0, 0, 0.3);
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
		font-size: 0.9em;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	th,
	td {
		padding: 0.6rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.15);
		text-align: left;
		color: rgba(245, 245, 245, 0.8);
	}

	th {
		background-color: rgba(0, 0, 0, 0.3);
		font-weight: 600;
	}

	.content-preview > p,
	.content-preview > ul,
	.content-preview > ol,
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
