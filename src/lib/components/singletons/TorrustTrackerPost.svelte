<script lang="ts">
	import CodeBlock from '$lib/components/molecules/CodeBlock.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
</script>

<PagesWrapper heading="">
	<div class="wrapper">
		<Toc class="toc" />
		<div id="toc-contents" class="content-preview">
			<h2 id="installation">Installation</h2>

			<p>
				We have made the installation of the Tracker as easy and flexible as possible, offering
				multiple ways to set ip up. You can either
				<a
					href="https://docs.rs/torrust-tracker/3.0.0-alpha.11/torrust_tracker/#install-from-sources"
					>compile from sources</a
				>
				or use
				<a href="https://hub.docker.com/r/torrust/tracker/tags">pre-built container images</a>. For
				cloud deployments, we provide simple solutions to deploy the tracker across various hosting
				providers, wether you're using virtual machines or containers. Additionally, we've deployed
				a public tracker on cloud service (<a target="_blank" href="https://www.digitalocean.com/"
					>Digital Ocean</a
				>) to gather feedback and ensure the application is production-ready. Out goal is to help
				system administrators by offering:
			</p>

			<ul>
				<li>Simple backup of the database and app configurations.</li>
				<li>Easy access to logs to monitor for errors.</li>
				<li>Quick access to running services.</li>
				<li>Automatic health checks to monitor services.</li>
			</ul>

			<p>
				The application also allows configuration through TOML files or environment variables. We’ve
				focused on providing clear and actionable error messages to help admins quickly resolve any
				issues.
			</p>

			<h2 id="softwareRequirements">Software requirements</h2>

			<ul>
				<li>Rust Stable 1.68 if you're compiling from source.</li>
				<li>
					<a target="_blank" href="https://www.sqlite.org/">SQLite 3</a>
					or <a target="_blank" href="https://www.mysql.com/">MySQL 8.0.</a>
					(only if persistence is enabled) .
				</li>
				<li>Some system dependencies. In Linux: pkg-config, make, libssl-dev, libsqlite3-dev.</li>
			</ul>

			<p>
				For more detailed installation requirements, refer to the <a
					href="https://docs.rs/torrust-tracker/3.0.0-alpha.11/torrust_tracker/#installation"
					>latest documentation</a
				>
				for more details about installation and requirements.
			</p>

			<h2 id="buildSources">Build from sources</h2>

			<p>Building the Rust app from source is simple using cargo.</p>

			<CodeBlock
				lang="bash"
				code={`git clone https://github.com/torrust/torrust-tracker.git \\
  && cd torrust-tracker \\
  && cargo build --release \\
  && mkdir -p ./storage/tracker/lib/database \\
  && mkdir -p ./storage/tracker/lib/tls
				`}
			/>

			Once built, you can run it with:

			<CodeBlock lang="bash" code={`./target/release/torrust-tracker`} />

			<h2 id="docker">Run with docker</h2>

			<p>
				You can use <a href="https://www.docker.com/">docker</a> or
				<a href="https://podman.io/">podman</a>
				to run the containerized application:
			</p>

			<CodeBlock
				lang="bash"
				code={`cd /tmp
  && mkdir torrust-tracker
  && cd torrust-tracker
  && export USER_ID=1000
  && docker run -it
    --env USER_ID="$USER_ID"
    --publish 3001:3001/tcp
    --volume "$(pwd)/storage/tracker/lib":"/var/lib/torrust/tracker"
    --volume "$(pwd)/storage/tracker/log":"/var/log/torrust/tracker"
    --volume "$(pwd)/storage/tracker/etc":"/etc/torrust/tracker"
    torrust/tracker:develop
  `}
			/>

			Please refer to
			<a href="https://docs.rs/torrust-tracker/3.0.0-alpha.11/torrust_tracker/#run-with-docker"
				>the official documentation</a
			>
			to learn more about running the index with docker.

			<h2 id="roadmap">Roadmap</h2>

			<p>
				The vision of Torrust is to provide a robust set of tools for the BitTorrent ecosystem. We
				recognize that this is a long-term effort, and we’ve planned ahead. Here’s a summary of what
				we’re working on:
			</p>

			<p>
				You can participate in defining the future of Torrust. Join our public <a
					href="https://github.com/torrust/torrust-index/discussions">discussions on GitHub.</a
				>
			</p>

			<ul>
				<li>Core</li>
				<ul>
					<li>
						New argument in announce requests: <a
							href="https://github.com/torrust/torrust-tracker/discussions/532"
							>want_ip_from_query_string.</a
						>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/discussions/139"
							>Peer and torrents specific statistics</a
						>
					</li>
				</ul>

				<li>Persistence</li>
				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/issues/462"
							>Support other databases like PostgreSQL</a
						>
					</li>
				</ul>

				<li>Performance</li>
				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/discussions/774"
							>More optimizations</a
						>
					</li>
				</ul>

				<li>Protocols</li>
				<ul>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/discussions/138">Webtorrent</a>
					</li>
				</ul>

				<li>Integrations</li>
				<ul>
					<li>
						Monitoring (<a href="https://github.com/torrust/torrust-tracker/discussions/135"
							>Prometheus</a
						>)
					</li>
				</ul>

				<li>Utils</li>
				<ul>
					<li>
						<a
							href="https://github.com/torrust/torrust-tracker/blob/develop/src/bin/tracker_checker.rs"
							>Tracker checker</a
						>
					</li>
					<li>
						<a href="https://github.com/torrust/torrust-tracker/discussions/660">Tracker client</a> (an
						unified console client for the UDP and HTTP tracker clients)
					</li>
				</ul>
			</ul>

			<h2 id="license">License</h2>

			<p>We aim to make this software as accessible and widely used as possible.</p>

			<h3 id="copyright">Copyright</h3>

			<p>
				This program is free software: you can redistribute it and/or modify it under the terms of
				the <a
					href="https://github.com/torrust/torrust-tracker/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
					>GNU Affero General Public License</a
				>
				as published by the <a href="https://www.fsf.org/">Free Software Foundation</a>, version 3.
			</p>

			<p>
				This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
				without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
				See the <a
					href="https://github.com/torrust/torrust-tracker/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
					>GNU Affero General Public License</a
				> for more details.
			</p>

			<p>
				You should have received a copy of the GNU Affero General Public License along with this
				program. If not, see <a target="_blank" href="https://www.gnu.org/licenses/"
					>www.gnu.org/licenses</a
				>. Some files include explicit copyright notices and/or license notices.
			</p>

			<h3 id="legacyException">Legacy Exception</h3>

			<p>
				For prosperity, versions of Torrust Tracker that are older than five years are automatically
				granted the <a
					target="_blank"
					href="https://github.com/torrust/torrust-tracker/blob/develop/docs/licenses/LICENSE-MIT_0"
					>MIT-0</a
				>
				license in addition to the existing
				<a
					target="_blank"
					href="https://github.com/torrust/torrust-tracker/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
					>AGPL-3.0-only</a
				> license.
			</p>
		</div>
	</div>
</PagesWrapper>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		position: relative;
	}

	.content-preview {
		flex: 1;
		word-break: keep-all;
		padding-top: 2rem;
	}

	h2 {
		font-size: 1.8rem;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem;
	}

	h3 {
		font-size: 1.3rem;
		font-weight: bold;
		padding-top: 1rem;
	}

	p {
		font-size: 1rem;
		padding-top: 1.5rem;
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
		padding-top: 1rem;
	}

	ul li {
		margin: 0.25rem 0;
		word-break: keep-all;
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
			overflow-y: scroll;
			scrollbar-width: none;
			-ms-overflow-style: none;
			padding-top: 0rem;
		}
	}
</style>
