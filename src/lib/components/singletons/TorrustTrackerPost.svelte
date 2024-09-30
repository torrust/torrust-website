<script lang="ts">
	import TableOfContents from '$lib/components/atoms/TableOfContents.svelte'; // Adjust the path if needed
	import CodeBlock from '$lib/components/molecules/CodeBlock.svelte';

	// Array of section objects with display names and IDs
	let sections = [
		{ name: 'Installation', id: 'installation' },
		{ name: 'Software requirements', id: 'softwareRequirements' },
		{ name: 'Build from sources', id: 'buildSources' },
		{ name: 'Run with docker', id: 'docker' },
		{ name: 'Roadmap', id: 'roadmap' },
		{ name: 'License', id: 'license' }
	];

	let activeSection = '';
</script>

<div class="layout">
	<div>
		<TableOfContents {sections} {activeSection} />
	</div>

	<div class="content">
		<h2 id="installation">Installation</h2>

		<p>
			We have made the installation of the Tracker as easy and flexible as possible, offering
			multiple ways to set ip up. You can either
			<a href="https://docs.rs/torrust-tracker/3.0.0-alpha.11/torrust_tracker/#install-from-sources"
				>compile from sources</a
			>
			or use
			<a href="https://hub.docker.com/r/torrust/tracker/tags">pre-built container images</a>. For
			cloud deployments, we provide simple solutions to deploy the tracker across various hosting
			providers, wether you're using virtual machines or containers. Additionally, we've deployed a
			public tracker on cloud service (<a target="_blank" href="https://www.digitalocean.com/"
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

		<CodeBlock lang="terminal">
			<code
				><pre>
git clone https://github.com/torrust/torrust-tracker.git \
  && cd torrust-tracker \
  && cargo build --release \
  && mkdir -p ./storage/tracker/lib/database \
  && mkdir -p ./storage/tracker/lib/tls
</pre></code
			>
		</CodeBlock>

		Once built, you can run it with:

		<CodeBlock lang="terminal">./target/release/torrust-tracker</CodeBlock>

		<h2 id="docker">Run with docker</h2>

		<p>
			You can use <a href="https://www.docker.com/">docker</a> or
			<a href="https://podman.io/">podman</a>
			to run the containerized application:
		</p>

		<CodeBlock lang="terminal">
			<code
				><pre>
cd /tmp \
  && mkdir torrust-tracker \
  && cd torrust-tracker \
  && export USER_ID=1000 \
  && docker run -it \
    --env USER_ID="$USER_ID" \
    --publish 3001:3001/tcp \
    --volume "$(pwd)/storage/tracker/lib":"/var/lib/torrust/tracker" \
    --volume "$(pwd)/storage/tracker/log":"/var/log/torrust/tracker" \
    --volume "$(pwd)/storage/tracker/etc":"/etc/torrust/tracker" \
    torrust/tracker:develop
</pre></code
			>
		</CodeBlock>

		Please refer to the [official
		documentation](https://docs.rs/torrust-tracker/3.0.0-alpha.11/torrust_tracker/#run-with-docker)
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

		<p></p>
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
					<a href="https://github.com/torrust/torrust-tracker/discussions/774">More optimizations</a
					>
				</li>
			</ul>

			<li>Protocols</li>
			<ul>
				<li><a href="https://github.com/torrust/torrust-tracker/discussions/138">Webtorrent</a></li>
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

		<p></p>

		<h3>Copyright</h3>

		<p>
			This program is free software: you can redistribute it and/or modify it under the terms of the <a
				href="https://github.com/torrust/torrust-tracker/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
				>GNU Affero General Public License</a
			>
			as published by the <a href="https://www.fsf.org/">Free Software Foundation</a>, version 3.
		</p>

		<p>
			This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
			without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See
			the <a
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

		<p></p>

		<h3>Legacy Exception</h3>

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

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.layout {
		padding-inline: 1.5rem;
		margin-top: 8rem;
		border: 1px solid transparent;
	}

	.content {
		margin-top: 3rem;
	}

	h2 {
		font-size: 1.875rem;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem; /* Add top padding to all h2 elements except the first one */
	}

	p {
		font-size: 1rem;
		padding-top: 1.5rem;
		color: rgba(245, 245, 245, 0.8);
	}

	@include for-desktop-up {
		.layout {
			display: flex;
			gap: 2rem;
			padding-inline: 0rem;
		}

		.content {
			margin-top: 0rem;
		}
	}
</style>
