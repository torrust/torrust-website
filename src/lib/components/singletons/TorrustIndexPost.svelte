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
			We have made the installation of the Index as easy and enjoyable as possible. First at all,
			offering different ways to run it. You can
			<a href="https://docs.rs/torrust-index/3.0.0-rc.1/torrust_index/#install-from-sources"
				>compile from sources</a
			>
			or use the
			<a href="https://hub.docker.com/r/torrust/index/tags">pre-built container images</a>. We have
			also taken into consideration cloud environments, making it easy to deploy the index to
			multiple hosting providers (using either VMs or containers).
		</p>

		<p>
			We have also taken into consideration cloud environments, making it easy to deploy the index
			to multiple hosting providers (using either VMs or containers). We run a <a
				href="https://index.torrust-demo.com/torrents">demo site</a
			>
			on Digital Ocean to collect direct feedback about how easy it is to manage the application on production.
			Our goal is to make sure sysadmins can:
		</p>

		<ul>
			<li>Easily backup the database or app configuration.</li>
			<li>Collect logs to check if the application is running without errors.</li>
			<li>Access the running services.</li>
			<li>Monitor services with automatic healthchecks.</li>
		</ul>

		<p>
			Besides that, the application also provides two ways to inject the configuration, via TOML
			files or environment variables. We've make an extra effort to make it clear, easy to change
			and provide the admin concise error messages when is wrong.
		</p>

		<h2 id="softwareRequirements">Software requirements</h2>

		<ul>
			<li>SQLite 3 or MySQL 8.0.</li>
			<li>Rust Stable 1.68 if you compile from sources.</li>
			<li>
				A running Torrust Tracker. You can check the <a href="/torrent-tracker">Tracker</a> page for
				installation instructions.
			</li>
		</ul>

		<p>
			Check <a href="https://docs.rs/torrust-index/latest/torrust_index/#prerequisites"
				>the latest documentation</a
			>
			for more details about installation and requirements.
		</p>

		<h2 id="buildSources">Build from sources</h2>

		<p>You can easily build the Rust app with cargo.</p>

		<CodeBlock lang="terminal">
			<code
				><pre>
git clone git@github.com:torrust/torrust-index.git \
  && cd torrust-index && cargo build --release \
  && mkdir -p ./storage/database
</pre></code
			>
		</CodeBlock>

		Then you can run it with:

		<CodeBlock lang="terminal">./target/release/torrust-index</CodeBlock>

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
  && mkdir torrust-index \
  && cd torrust-index \
  && export USER_ID=1000 \
  && docker run -it \
    --env USER_ID="$USER_ID" \
    --publish 3001:3001/tcp \
    --volume "$(pwd)/storage/index/lib":"/var/lib/torrust/index" \
    --volume "$(pwd)/storage/index/log":"/var/log/torrust/index" \
    --volume "$(pwd)/storage/index/etc":"/etc/torrust/index" \
    torrust/index:develop
</pre></code
			>
		</CodeBlock>

		Please refer to the [official
		documentation](https://docs.rs/torrust-index/3.0.0-rc.1/torrust_index/#run-with-docker) to learn
		more about running the index with docker.

		<h2 id="roadmap">Roadmap</h2>

		<p>
			Torrust vision is to provide a good set of tools for the BitTorrent ecosystem. We know that
			this take a big effort and a long time. That's why we plan for the future. This is a summary
			of all things we are planning to implement.
		</p>

		<p>
			You can participate in defining the future of Torrust. Join our public <a
				href="https://github.com/torrust/torrust-index/discussions">discussions on GitHub.</a
			>
		</p>

		<p></p>
		<ul>
			<li>Persistence</li>
			<ul>
				<li>Support other databases</li>
			</ul>
			<li>Integrations</li>
			<ul>
				<li>Webhooks</li>
			</ul>
			<li>Administration</li>
			<ul>
				<li>Improve categories and tag management</li>
				<li>User management: list, ban users</li>
				<li>Full-private mode</li>
				<li>User statistics</li>
			</ul>
			<li>User management</li>
			<ul>
				<li>Reset or change password</li>
				<li>User profile</li>
				<li>Invitation system</li>
				<li>User moderation</li>
				<li>Add torrent providing only infohash</li>
				<li>Improve search: Import torrents documents and provide better search capabilities</li>
			</ul>
			<li>Torrents</li>
			<ul>
				<li>Customize "source" and "creator" torrent fields after uploading</li>
				<li>
					Implement <a target="_blank" href="http://bittorrent.org/beps/bep_0019.html">BEP 19</a>:
					WebSeed - HTTP/FTP Seeding (GetRight style)
				</li>
				<li>
					Implement <a target="_blank" href="http://bittorrent.org/beps/bep_0032.html">BEP 32</a>:
					BitTorrent DHT Extensions for IPv6
				</li>
			</ul>
			<li>Others</li>
			<ul>
				<li>Multi-tracker</li>
				<li>Multi-language</li>
			</ul>
		</ul>

		<h2 id="license">License</h2>

		<p>We want the software to be as useful and spread as possible.</p>

		<p></p>

		<h3>Copyright</h3>

		<p>
			This program is free software: you can redistribute it and/or modify it under the terms of the <a
				href="https://github.com/torrust/torrust-index/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
				>GNU Affero General Public License</a
			>
			as published by the <a href="https://www.fsf.org/">Free Software Foundation</a>, version 3.
		</p>

		<p>
			This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
			without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See
			the <a
				href="https://github.com/torrust/torrust-index/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
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
				href="https://github.com/torrust/torrust-index/blob/develop/docs/licenses/LICENSE-MIT_0"
				>MIT-0</a
			>
			license in addition to the existing
			<a
				target="_blank"
				href="https://github.com/torrust/torrust-index/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
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
		margin-top: 2rem;
	}

	h1 {
		padding-top: 1rem;
		font-size: 2.25rem;
	}

	h2 {
		padding-top: 0.5rem;
		font-size: 1.8rem;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem; /* Add top padding to all h2 elements except the first one */
	}

	h3 {
		padding-top: 2rem;
		font-size: 1.3rem;
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
