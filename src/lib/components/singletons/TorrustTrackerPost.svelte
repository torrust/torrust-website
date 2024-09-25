<script lang="ts">
	import TableOfContents from '$lib/components/atoms/TableOfContents.svelte'; // Adjust the path if needed

	// Array of section objects with display names and IDs
	let sections = [
		{ name: 'Installation', id: 'installation' },
		{ name: 'Software requirements', id: 'softwareRequirements' },
		{ name: 'Build from sources (Rust)', id: 'buildSources' },
		{ name: 'Docker', id: 'docker' },
		{ name: 'Licenses', id: 'licenses' },
		{ name: 'Copyright (c) 2023 The Torrust Developers', id: 'copyright' },
		{ name: 'Legacy Exception', id: 'legacyException' },
		{ name: 'Roadmap', id: 'roadmap' },
		{ name: 'Core', id: 'core' },
		{ name: 'Persistence', id: 'persistence' },
		{ name: 'Performance', id: 'performance' },
		{ name: 'Protocols', id: 'protocols' },
		{ name: 'Integrations', id: 'integrations' },
		{ name: 'Utils', id: 'utils' },
		{ name: 'Others', id: 'others' }
	];

	let activeSection = '';
</script>

<div class="layout">
	<div>
		<TableOfContents {sections} {activeSection} />
	</div>
	<div class="content">
		<h2 id="installation">Installation</h2>
		<h2 id="softwareRequirements">Software requirements</h2>
		<ul>
			<li>Optional: SQLite 3 or MySQL 8.0. Only if persistence is enabled.</li>
			<li>Rust Stable 1.68 if you compile from sources.</li>
		</ul>
		<p>
			See <a href="https://docs.rs/torrust-index/latest/torrust_index/#prerequisites">here</a> for details.
		</p>
		<p>You can install the Tracker from sources or use docker.</p>
		<ul>
			<li>
				Install from sources: <a
					href="https://docs.rs/torrust-tracker/latest/torrust_tracker/#install-from-sources"
					>here</a
				>
			</li>
			<li>
				Run with docker: <a
					href="https://docs.rs/torrust-index/latest/torrust_index/#run-with-docker">here</a
				>
			</li>
		</ul>
		<p>
			There is a tutorial to install the Tracker and Index on a Digital Ocean droplet: <a
				href="https://torrust.com/deploying-torrust-to-production"
				>Deploying Torrust to Production</a
			>
		</p>
		<p>
			The setup should be very similar in any hosting providing VMs. If you need help or find a
			problem trying to install the tracker you can open a question on the GitHub <a
				href="https://github.com/torrust/torrust-tracker/discussions/categories/q-a">discussions</a
			>.
		</p>
		<h2 id="buildSources">Build from sources (Rust)</h2>

		<p>
			Commodo ullamcorper blandit massa odio mauris odio ornare. Adipiscing imperdiet neque
			convallis nisl quisque quisque. Fringilla bibendum sit lectus tellus ut urna condimentum
			tristique. Nisi lectus malesuada consectetur morbi id fringilla et. Blandit mus senectus a
			elit nisl.
		</p>
		<p>
			Mauris ut dolor dolor nam. Dolor viverra tincidunt egestas ac vulputate. Phasellus sed massa
			facilisis rhoncus in. Ipsum fermentum est diam justo nibh quis. Libero rutrum quam donec
			tellus at et.
		</p>
		<p>
			Sed quis enim amet tempor aliquet eget. Phasellus sem vel tincidunt pellentesque non hendrerit
			cras magna. Volutpat convallis aliquet non lectus quam enim. Nunc ut augue urna vitae
			venenatis. Pellentesque congue blandit facilisi lectus ac libero.
		</p>
		<h2 id="docker">Docker</h2>
		<p>
			Interdum augue mattis tortor ornare in. Feugiat phasellus integer massa mauris. Leo sit tempus
			leo eu tellus feugiat malesuada purus. Metus erat eleifend ante sed sem gravida nunc lobortis
			et. Arcu elit faucibus eget egestas aliquet vivamus consectetur.
		</p>
		<p>
			Laoreet id nisl pharetra sed ut massa dis interdum. Eget eu lacus fringilla sem dignissim cras
			ridiculus. Potenti cras diam nunc ultricies. Ut metus amet faucibus quam nibh mattis at. Cras
			in rhoncus ipsum ut id sit id.
		</p>
		<h2 id="licenses">Licenses</h2>
		<p>Copyright (c) 2023 The Torrust Developers.</p>
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
			program. If not, see <a href="https://www.gnu.org/licenses/">here</a>.
		</p>
		<p>Some files include explicit copyright notices and/or license notices.</p>
		<h2 id="copyright">Copyright (c) 2023 The Torrust Developers.</h2>

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
			program. If not, see <a href="https://www.gnu.org/licenses/">here</a>.
		</p>
		<p>Some files include explicit copyright notices and/or license notices.</p>
		<h2 id="legacyException">Legacy Exception</h2>

		<p>
			For prosperity, versions of Torrust Tracker that are older than five years are automatically
			granted the <a
				href="https://github.com/torrust/torrust-index/blob/develop/docs/licenses/LICENSE-MIT_0"
				>MIT-0</a
			>
			license in addition to the existing
			<a href="https://github.com/torrust/torrust-index/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
				>AGPL-3.0-only</a
			> license.
		</p>
		<h2 id="roadmap">Roadmap</h2>
		<p>Future features:</p>
		<h2 id="core">Core</h2>

		<ul>
			<li>
				New option 'want_ip_from_query_string'. See <a
					href="https://github.com/torrust/torrust-tracker/discussions/532#issuecomment-1836642956"
					>here</a
				>.
			</li>
			<li>
				Permanent keys. See <a href="https://github.com/torrust/torrust-tracker/discussions/244"
					>here</a
				>.
			</li>
			<li>
				Peer and torrents specific statistics. See <a
					href="https://github.com/torrust/torrust-tracker/discussions/139">here</a
				>.
			</li>
		</ul>
		<h2 id="persistence">Persistence</h2>

		<ul>
			<li>Support other databases.</li>
			<li>Support for PostgreSQL.</li>
		</ul>
		<h2 id="performance">Performance</h2>
		<ul>
			<li>Concurrent write torrents repository (DashMap)</li>
		</ul>
		<h2 id="protocols">Protocols</h2>

		<ul>
			<li>WebTorrent</li>
		</ul>
		<h2 id="integrations">Integrations</h2>

		<ul>
			<li>Monitoring (Prometheus)</li>
		</ul>
		<h2 id="utils">Utils</h2>

		<ul>
			<li>Tracker client</li>
			<li>Tracker checker</li>
		</ul>
		<h2 id="others">Others</h2>
		<ul>
			<li>Support Windows</li>
			<li>Docker images for other architectures</li>
		</ul>
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
