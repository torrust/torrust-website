<script lang="ts">
	import TableOfContents from '$lib/components/atoms/TableOfContents.svelte'; // Adjust the path if needed

	// Array of section objects with display names and IDs
	let sections = [
		{ name: 'Torrent solution (Index + Tracker)', id: 'torrustSolution' },
		{ name: 'Build from sources (Rust)', id: 'buildSources' },
		{ name: 'Docker', id: 'docker' },
		{ name: 'Tutorials', id: 'tutorials' },
		{ name: 'Torrust tracker', id: 'torrustTracker' }
	];

	let activeSection = '';
</script>

<div>
	<h1>Self-host</h1>
	<div class="layout">
		<div>
			<TableOfContents {sections} {activeSection} />
		</div>
		<div class="content">
			<h2 id="torrustSolution">Torrent solution (Index + Tracker)</h2>

			<p>
				The Torrust Solution is a complete installation of bot a BitTorrent Index which is
				associated to one Torrust Tracker. Downloaded torrents will include the the associated
				tracker in the list of trackers.
			</p>
			<p>
				In our tutorial we explain how to install both in the same server using a single docker
				compose configiration, but if you need more resources you could install the tracker and the
				index in different servers. You just need to spits the docker compose configuration and
				change the tracker configiration in the index to connect to the external tracker.
			</p>

			<h2 id="buildSources">Build from sources (Rust)</h2>

			<p>TODO</p>
			<h2 id="docker">Docker</h2>

			<p>TODO</p>

			<h2 id="tutorials">Tutorials</h2>

			<p>TODO</p>

			<h2 id="torrustTracker">Torrust tracker</h2>

			<p>TODO</p>
		</div>
	</div>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	h1,
	.layout {
		padding-inline: 1.5rem;
	}

	.layout {
		margin-top: 4rem;
	}

	.content {
		margin-top: 3rem;
	}

	h1 {
		padding-top: 4rem;
		font-size: 2.25rem;
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
		h1,
		.layout {
			display: flex;
			padding-inline: 9.25rem;
			gap: 2rem;
		}

		.content {
			margin-top: 0rem;
		}

		h1 {
			padding-top: 8rem;
		}
	}
</style>
