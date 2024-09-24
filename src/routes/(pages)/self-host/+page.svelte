<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Toc from 'svelte-toc';
	import PostContainer from '$lib/components/molecules/PostContainer.svelte';
	import PostTable from '$lib/components/molecules/PostTable.svelte';
	import PostBody from '$lib/components/molecules/PostBody.svelte';

	let isLargeScreen = writable(false);

	onMount(() => {
		const mediaQueryList = window.matchMedia('(min-width: 1000px)');

		isLargeScreen.set(mediaQueryList.matches);

		const updateScreenSize = (event: MediaQueryListEvent) => {
			isLargeScreen.set(event.matches);
		};

		mediaQueryList.addEventListener('change', updateScreenSize);

		return () => {
			mediaQueryList.removeEventListener('change', updateScreenSize);
		};
	});
</script>

<div class="container">
	<h1>Self-host</h1>
	<PostContainer>
		{#if $isLargeScreen}
			<PostTable>
				<Toc
					title=""
					--toc-active-color="rgba(255, 49, 0, 0.96)"
					--toc-li-hover-color="rgba(255, 49, 0, 0.96)"
					--toc-active-bg="transparent"
				/>
			</PostTable>
		{:else}
			<PostTable>
				<ul class="toc">
					<li>
						<a href="#torrustSolution">Torrent solution (Index + Tracker)</a>
					</li>
					<li><a href="#buildSources">Build from sources (Rust)</a></li>
					<li><a href="#docker">Docker</a></li>
					<li><a href="#tutorials">Tutorials</a></li>
					<li><a href="#torrustTracker">Torrust tracker</a></li>
				</ul>
			</PostTable>
		{/if}
		<PostBody>
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
		</PostBody>
	</PostContainer>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	h1 {
		font-size: 36px;
		padding-top: 64px;
		margin-inline: 1rem;
	}

	h2,
	p {
		padding-top: 1.2rem;
	}

	.toc li a {
		color: white;
	}

	.toc li a:hover {
		color: rgba(255, 49, 0, 0.96);
	}
</style>
