<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Table from '$lib/components/atoms/Table.svelte';
	import Slider from '$lib/components/atoms/Slider.svelte';
	import Banner from '$lib/components/atoms/Banner.svelte';

	import Sqlite from '$lib/icons/sqlite.svelte';
	import Rust from '$lib/icons/rust.svelte';
	import Mysql from '$lib/icons/mysql.svelte';
	import Nuxt from '$lib/icons/nuxt.svelte';

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

	import TorrustIndexPost from '$lib/components/singletons/TorrustIndexPost.svelte';
	import {
		indexTitleArr1,
		indexBasicTableHeadings,
		indexFeaturesTableHeadings,
		indexTableData
	} from '$lib/constants/constants';
</script>

<Banner title={'index'} />

<div class="container">
	<div class="inner-container">
		<h2>Key Features</h2>
		<p>
			Torrust Index provides a highly optimized and scalable platform for organizing torrent
			metadata. With fast search capabilities and a robust backend powered by Rust, the index
			ensures efficient performance for even the most demanding use cases. Designed with privacy in
			mind, it allows users to manage their content freely while upholding strong data integrity
			principles.
		</p>
	</div>

	<div class="slider-wrapper">
		<div class="slider-content">
			<Slider titleArr={indexTitleArr1} />
		</div>
	</div>

	<div class="inner-container">
		<h2>Stack</h2>
		<p>
			Torrust Index is powered by SQLite and MySQL, leveraging Rust (Axum) for the REST API and Nuxt
			(VUE) for the frontend.
		</p>
		<div class="stack-icons">
			<div>
				<Sqlite />
				<Rust />
			</div>
			<div>
				<Mysql />
				<Nuxt />
			</div>
		</div>
	</div>

	<div class="inner-container">
		<h2>Comparison to other products</h2>

		<p>
			Compared to other torrent indexing solutions, Torrust Index offers a unique blend of speed,
			security, and scalability. By leveraging modern technologies like Rust and SQLite, it
			outperforms many competitors in resource efficiency and ease of use. Its open-source nature
			ensures transparency, allowing contributors to shape the future development of the platform
			based on community needs.
		</p>

		<p>
			If you want to include your Index on the following tables or update data for any of them,
			please open a <a href="https://github.com/torrust/torrust-website-v2">PR</a>.
		</p>
	</div>

	<div class="inner-container">
		<h2>General information</h2>

		<Table tableHeading={indexBasicTableHeadings} tableData={indexTableData} />
	</div>

	<div class="inner-container">
		<h2>Features</h2>

		<Table tableHeading={indexFeaturesTableHeadings} tableData={indexTableData} />
	</div>

	<TorrustIndexPost />
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
		display: flex;
		justify-content: center;

		.slider-content {
			width: 100%;
			max-width: 2100px;
			display: flex;
			justify-content: center;
		}
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
		flex-direction: row;
		justify-content: center;
		padding-inline: 1.5rem;
	}

	.stack-icons div {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
		margin-top: 3rem;
	}

	@include for-tablet-portrait-up {
		.stack-icons {
			gap: 1.5rem;
		}

		.stack-icons div {
			flex-direction: row;
			gap: 1.5rem;
		}

		.stack-icons div:nth-of-type(1) {
			justify-content: flex-end;
		}

		.stack-icons div:nth-of-type(2) {
			justify-content: flex-start;
		}
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
