<script lang="ts">
	import TableOfContents from '$lib/components/atoms/TableOfContents.svelte'; // Adjust the path if needed

	// Array of section objects with display names and IDs
	let sections = [
		{ name: 'Installation', id: 'installation' },
		{ name: 'Software requirements', id: 'softwareRequirements' },
		{ name: 'Build from sources (Rust)', id: 'buildSources' },
		{ name: 'Docker', id: 'docker' },
		{ name: 'Licenses', id: 'licenses' },
		{ name: 'Copyright (c) 2023 The Torrust Developers.', id: 'copyright' },
		{ name: 'Legacy Exception', id: 'legacyException' },
		{ name: 'Roadmap', id: 'roadmap' },
		{ name: 'Future Features', id: 'futureFeatures' }
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
			Massa sit tempor massa blandit suscipit. Vestibulum in faucibus suspendisse enim at sit. Velit
			eget at cursus vel adipiscing. Tristique feugiat aliquam risus etiam. Auctor scelerisque
			dignissim facilisi faucibus.
		</p>
		<h2 id="softwareRequirements">Software requirements</h2>
		<ul>
			<li>SQLite 3 or MySQL 8.0.</li>
			<li>Rust Stable 1.68 if you compile from sources.</li>
			<li>
				A running Torrust Tracker. You can check the Tracker page for installation instructions.
			</li>
		</ul>
		<p>
			See <a href="https://docs.rs/torrust-index/latest/torrust_index/#prerequisites">here</a> for details.
		</p>
		<p>You can install the Index from sources or using docker.</p>
		<h2 id="buildSources">Build from sources (Rust)</h2>
		<p>TODO</p>
		<h2 id="docker">Docker</h2>
		<p>TODO</p>
		<h2 id="licenses">Licenses</h2>
		<h2 id="copyright">Copyright (c) 2023 The Torrust Developers.</h2>
		<p>
			This program is free software: you can redistribute it and/or modify it under the terms ofthe <a
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
			program. If not, see <a href="https://www.gnu.org/licenses/">https://www.gnu.org/licenses/</a
			>. Some files include explicit copyright notices and/or license notices.
		</p>
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
		<h2 id="futureFeatures">Future Features:</h2>
		<ul>
			<li>Persistence:</li>
			<ul>
				<li>Support other databases</li>
			</ul>
			<li>Integrations:</li>
			<ul>
				<li>Webhooks</li>
			</ul>
			<li>Administration:</li>
			<ul>
				<li>Improve categories and tag management</li>
				<li>User management: list, ban users</li>
				<li>Full-private mode</li>
				<li>User statistics</li>
			</ul>
			<li>Users:</li>
			<ul>
				<li>Reset or change password</li>
				<li>User profile</li>
				<li>Invitation system</li>
				<li>User moderation</li>
				<li>Add torrent providing only infohash</li>
				<li>
					Improve search: Import Torrent Index Entries as Documents and Provide Real Searching
					Capabilites
				</li>
			</ul>
			<li>Torrents:</li>
			<ul>
				<li>Change source field</li>
				<li>Change creator field</li>
				<li>Implement BEP 19: WebSeed - HTTP/FTP Seeding (GetRight style)</li>
				<li>Implement BEP 32: BitTorrent DHT Extensions for IPv6</li>
			</ul>
			<li>Others:</li>
			<ul>
				<li>Multi-tracker</li>
				<li>Multi-language</li>
			</ul>
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
