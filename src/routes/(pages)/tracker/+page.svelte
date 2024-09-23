<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Toc from 'svelte-toc';
	import Table from '$lib/components/atoms/Table.svelte';
	import PostContainer from '$lib/components/molecules/PostContainer.svelte';
	import PostTable from '$lib/components/molecules/PostTable.svelte';
	import PostBody from '$lib/components/molecules/PostBody.svelte';
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

	import { trackerTitleArr1, trackerTableHeadings, indexTableData } from '$lib/constants/constants';
</script>

<Banner title={'tracker'} />
<div class="container">
	<div class="inner-container">
		<h2>Key Features</h2>
			<ul>
			  <li><b>Efficient and Reliable:</b> The Torrust Tracker is built to handle 
			  high loads while ensuring reliable and accurate tracking of peers 
			  and torrents.</li>
			  <li><b>Customizable:</b> Offers flexible configurations to support different 
			  use cases, from private trackers to large public ones.</li>
			  <li><b>Scalable Persistence:</b> Choose between SQLite and MySQL for 
			  persistence, allowing the Tracker to scale according to your needs.</li>
			  <li><b>Written in Rust:</b> Benefit from the performance and safety features 
			  of Rust, which powers both the REST API and the HTTP tracker.</li>
			</ul>
	<div>
			<Slider titleArr={trackerTitleArr1} />
		</div>
	</div>
	<div class="inner-container">
		<h2>Stack</h2>
		<p>
			Torrust Tracker uses SQLite or MySQL for persistence and is built 
			with Rust using the Axum framework for its REST API and HTTP tracker. 
			This combination allows for high-performance and secure operations, 
			giving developers flexibility in deployment options.
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
			Unlike other trackers, Torrust Tracker balances speed with feature 
			richness. While some trackers prioritize minimalism at the cost of 
			flexibility, Torrust focuses on offering extensive functionality 
			with only a small compromise in speed.
		</p>
		<Table tableHeading={trackerTableHeadings} tableData={indexTableData} />
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
				“Accepting a minor reduction in speed for significant gains highlights our dedication to
				offering a tracker that excels in features and user-friendliness, not just in speed.”
			</em>
		</p>
		<p>
			We are using the aquatic <a
				href="https://github.com/greatest-ape/aquatic/tree/master/crates/bencher">"bencher"</a
			> tool for benchmarking.
		</p>
		<p>
			You can also read our blog article about <a
				href="https://torrust.com/benchmarking-the-torrust-bittorrent-tracker"
				>"benchmarking for the tracker"</a
			>.
		</p>
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
							<li><a href="#buildSources">Build from sources (Rust)</a></li>
						</ul>
						<li><a href="#roadmap">Roadmap</a></li>
						<ul>
							<li><a href="#core">Core</a></li>
							<li><a href="#persistence">Persistence</a></li>
							<li><a href="#performance">Performance</a></li>
							<li><a href="#protocols">Protocols</a></li>
							<li><a href="#integrations">Integrations</a></li>
							<li><a href="#utils">Utils</a></li>
							<li><a href="#others">Others</a></li>
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
						<li><a href="#buildSources">Build from sources (Rust)</a></li>
					</ul>
					<li><a href="#roadmap">Roadmap</a></li>
					<ul class="toc">
						<li><a href="#core">Core</a></li>
						<li><a href="#persistence">Persistence</a></li>
						<li><a href="#performance">Performance</a></li>
						<li><a href="#protocols">Protocols</a></li>
						<li><a href="#integrations">Integrations</a></li>
						<li><a href="#utils">Utils</a></li>
						<li><a href="#others">Others</a></li>
					</ul>
				</ul>
			</PostTable>
		{/if}
		<PostBody>
			<h2 id="installation">Installation</h2>
			<h2 id="softwareRequirements">Software requirements</h2>
			<ul>
				<li>Optional: SQLite 3 or MySQL 8.0. Only if persistence is enabled.</li>
				<li>Rust Stable 1.68 if you compile from sources.</li>
			</ul>
			<p>
				See <a href="https://docs.rs/torrust-index/latest/torrust_index/#prerequisites">here</a> for
				details.
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
					href="https://github.com/torrust/torrust-tracker/discussions/categories/q-a"
					>discussions</a
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
			<p>Copyright (c) 2023 The Torrust Developers.</p>
			<p>
				This program is free software: you can redistribute it and/or modify it under the terms of
				the <a
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
				program. If not, see <a href="https://www.gnu.org/licenses/">here</a>.
			</p>
			<p>Some files include explicit copyright notices and/or license notices.</p>
			<h2 id="copyright">Copyright (c) 2023 The Torrust Developers.</h2>

			<p>
				This program is free software: you can redistribute it and/or modify it under the terms of
				the <a
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
				<a
					href="https://github.com/torrust/torrust-index/blob/develop/docs/licenses/LICENSE-AGPL_3_0"
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

	.toc li a {
		color: white;
	}

	.toc li a:hover {
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
