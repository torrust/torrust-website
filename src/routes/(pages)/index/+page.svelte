<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Toc from 'svelte-toc';
	import Table from '$lib/components/atoms/Table.svelte';
	import PostContainer from '$lib//components/molecules/PostContainer.svelte';
	import PostTable from '$lib/components/molecules/PostTable.svelte';
	import PostBody from '$lib/components/molecules/PostBody.svelte';
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

	import { indexTitleArr1, indexTableHeadings, indexTableData } from '$lib/constants/constants';
</script>

<Banner title={'index'} />
<div class="container">
	<div class="inner-container">
		<h2>Key Features</h2>
		<p>
			Sapien malesuada massa quam gravida ipsum iaculis nisl massa id. Sit tortor morbi in aenean
			lectus vel nulla dolor. Facilisis rhoncus viverra consequat dictum. Lobortis venenatis morbi
			et tortor feugiat.
		</p>
	</div>
	<div>
		<Slider titleArr={indexTitleArr1} />
	</div>
	<div class="inner-container">
		<h2>Stack</h2>
		<p>
			Torrust Index is powered by SQLite and mySQL, leveraging Rust (Axum) for the REST API and Nuxt
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
			Sapien malesuada massa quam gravida ipsum iaculis nisl massa id. Sit tortor morbi in aenean
			lectus vel nulla dolor. Facilisis rhoncus viverra consequat dictum. Lobortis venenatis morbi
			et tortor feugiat.
		</p>
		<Table tableHeading={indexTableHeadings} tableData={indexTableData} />
	</div>

	<PostContainer>
		{#if $isLargeScreen}
			<PostTable>
				<Toc
					title=""
					--toc-active-color="rgba(255, 49, 0, 0.96)"
					--toc-li-hover-color="rgba(255, 49, 0, 0.96)"
					--toc-active-bg="transparent"
				>
					<ul>
						<li><a href="#installation">Installation</a></li>
						<ul>
							<li><a href="#softwareRequirements">Software requirements</a></li>
							<li><a href="#buildSources">Build from sources (Rust)</a></li>
							<li><a href="#docker">Docker</a></li>
						</ul>
						<li><a href="#licenses">Licenses</a></li>
						<ul>
							<li><a href="#copyright">Copyright (c) 2023 The Torrust Developers</a></li>
							<li><a href="#legacyException">Legacy Exception</a></li>
						</ul>
						<li><a href="#roadmap">Roadmap</a></li>
						<ul>
							<li><a href="#futureFeatures">Future Features</a></li>
						</ul>
					</ul>
				</Toc>
			</PostTable>
		{:else}
			<PostTable>
				<ul class="toc">
					<li><a href="#installation">Installation</a></li>
					<ul class="toc">
						<li><a href="#softwareRequirements">Software requirements</a></li>
						<li><a href="#buildSources">Build from sources (Rust)</a></li>
						<li><a href="#docker">Docker</a></li>
					</ul>
					<li><a href="#licenses">Licenses</a></li>
					<ul class="toc">
						<li><a href="#copyright">Copyright (c) 2023 The Torrust Developers</a></li>
						<li><a href="#legacyException">Legacy Exception</a></li>
					</ul>
					<li><a href="#roadmap">Roadmap</a></li>
					<ul class="toc">
						<li><a href="#futureFeatures">Future Features</a></li>
					</ul>
				</ul>
			</PostTable>
		{/if}
		<PostBody>
			<h2 id="installation">Installation</h2>
			<p>
				Massa sit tempor massa blandit suscipit. Vestibulum in faucibus suspendisse enim at sit.
				Velit eget at cursus vel adipiscing. Tristique feugiat aliquam risus etiam. Auctor
				scelerisque dignissim facilisi faucibus.
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
				See <a href="https://docs.rs/torrust-index/latest/torrust_index/#prerequisites">here</a> for
				details.
			</p>
			<p>You can install the Index from sources or using docker.</p>
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
				Sed quis enim amet tempor aliquet eget. Phasellus sem vel tincidunt pellentesque non
				hendrerit cras magna. Volutpat convallis aliquet non lectus quam enim. Nunc ut augue urna
				vitae venenatis. Pellentesque congue blandit facilisi lectus ac libero.
			</p>
			<h2 id="docker">Docker</h2>
			<p>
				Interdum augue mattis tortor ornare in. Feugiat phasellus integer massa mauris. Leo sit
				tempus leo eu tellus feugiat malesuada purus. Metus erat eleifend ante sed sem gravida nunc
				lobortis et. Arcu elit faucibus eget egestas aliquet vivamus consectetur.
			</p>
			<p>
				Laoreet id nisl pharetra sed ut massa dis interdum. Eget eu lacus fringilla sem dignissim
				cras ridiculus. Potenti cras diam nunc ultricies. Ut metus amet faucibus quam nibh mattis
				at. Cras in rhoncus ipsum ut id sit id.
			</p>
			<h2 id="licenses">Licenses</h2>
			<h2 id="copyright">Copyright (c) 2023 The Torrust Developers.</h2>
			<p>
				This program is free software: you can redistribute it and/or modify it under the terms
				ofthe <a
					href="https://github.com/torrust/torrust-index/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
					>GNU Affero General Public License</a
				>
				as published by the <a href="https://www.fsf.org/">Free Software Foundation</a>, version 3.
			</p>
			<p>
				This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
				without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
				See the <a
					href="https://github.com/torrust/torrust-index/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
					>GNU Affero General Public License</a
				> for more details.
			</p>
			<p>
				You should have received a copy of the GNU Affero General Public License along with this
				program. If not, see <a href="https://www.gnu.org/licenses/"
					>https://www.gnu.org/licenses/</a
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
				<a
					href="https://github.com/torrust/torrust-index/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
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
		</PostBody>
	</PostContainer>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

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

	a {
		color: rgba(255, 49, 0, 0.96);
	}

	.toc li a {
		color: white;
	}

	.toc li a:hover {
		color: rgba(255, 49, 0, 0.96);
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
