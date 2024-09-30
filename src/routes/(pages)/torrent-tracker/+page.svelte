<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Table from '$lib/components/atoms/Table.svelte';
	import Slider from '$lib/components/atoms/Slider.svelte';
	import Banner from '$lib/components/atoms/Banner.svelte';

	import Sqlite from '$lib/icons/sqlite.svelte';
	import Rust from '$lib/icons/rust.svelte';
	import Mysql from '$lib/icons/mysql.svelte';

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

	import {
		trackerTitleArr1,
		trackerBasicTableHeadings,
		trackerFeaturesTableHeadings,
		trackerTableData
	} from '$lib/constants/constants';
	import TorrustTrackerPost from '$lib/components/singletons/TorrustTrackerPost.svelte';
</script>

<Banner title={'tracker'} />
<div class="container">
	<div class="inner-container">
		<h2>Key Features</h2>

		<div>
			<p>
				The Torrust Tracker is built to handle high loads while ensuring
				<b>reliable</b> and <b>accurate</b> tracking of peers and torrents. It also offers flexible
				configurations to support different use cases, from private trackers to large public ones.
				You can benefit from the performance and safety features of <b>Rust</b>, which powers both
				the REST API and the HTTP tracker.
			</p>
		</div>

		<div class="slider-wrapper">
			<Slider titleArr={trackerTitleArr1} />
		</div>
	</div>

	<div class="inner-container">
		<h2>Stack</h2>

		<p>
			Torrust Tracker optionally uses persistence with SQLite3 or Mysql database, and is built with
			Rust using the <a target="_blank" href="https://github.com/tokio-rs/axum">Axum</a>
			framework for its REST API and HTTP tracker. This combination allows for high-performance and secure
			operations, giving developers flexibility in deployment options.
		</p>

		<div class="stack-icons">
			<div>
				<Sqlite />
				<Mysql />
				<Rust />
			</div>
		</div>
	</div>

	<div class="inner-container">
		<h2>Comparison to other products</h2>

		<p>
			Unlike other trackers, Torrust Tracker balances speed with feature richness. While some
			trackers prioritize minimalism at the cost of flexibility, Torrust focuses on offering
			extensive functionality with only a small compromise in speed.
		</p>

		<p>
			If you want to include your Tracker on the following tables or update data for any of them,
			please open a <a href="https://github.com/torrust/torrust-website-v2">PR</a>.
		</p>
	</div>

	<div class="inner-container">
		<h2>General information</h2>

		<Table tableHeading={trackerBasicTableHeadings} tableData={trackerTableData} />
	</div>

	<div class="inner-container">
		<h2>Features</h2>

		<Table tableHeading={trackerFeaturesTableHeadings} tableData={trackerTableData} />
	</div>

	<div class="inner-container">
		<h2>Performance</h2>
		<p>
			It's important to outline the compromises made during the Torrust Tracker's development. Our
			aim was to create a tracker that is not only quick and reliable but also feature-rich and
			maintainable. Often, these two sets of goals conflict with each other. We acknowledge that
			achieving the highest speed comes with certain limitations.
		</p>
		<p>Generally, our approach has been:</p>
		<p>
			<em>
				Accepting a minor reduction in speed for significant gains highlights our dedication to
				offering a tracker that excels in features and user-friendliness, not just in speed.
			</em>
		</p>
		<p>
			We are using the aquatic <a
				target="_blank"
				href="https://github.com/greatest-ape/aquatic/tree/master/crates/bencher">bencher</a
			> tool for benchmarking.
		</p>
		<p>
			You can also read our blog article about <a href="benchmarking-the-torrust-bittorrent-tracker"
				>benchmarking for the tracker</a
			>.
		</p>
	</div>

	<TorrustTrackerPost />
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.slider-wrapper {
		width: 100vw;
		margin-left: calc(50% - 50vw);
		overflow-x: hidden;
	}

	.inner-container {
		text-align: center;

		h2 {
			margin-top: 4rem;
			padding-inline: 1.5rem;
		}

		p {
			margin-top: 1.4rem;
			padding-inline: 1.5rem;
		}
	}

	h2,
	p {
		padding-top: 1.2rem;
	}

	.stack-icons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-inline: 1.5rem;
	}

	.stack-icons div {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 3rem;
		gap: 1.5rem;
	}

	.stack-icons div:nth-of-type(2) {
		justify-content: center;
	}

	a {
		color: rgba(255, 49, 0, 0.96);
	}

	@include for-tablet-portrait-up {
		.inner-container {
			padding-top: 3rem;
		}

		.inner-container h2,
		.inner-container p {
			width: 640px;
			margin: 0 auto;
		}
	}
</style>
