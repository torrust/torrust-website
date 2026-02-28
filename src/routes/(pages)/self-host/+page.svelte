<script lang="ts">
	import Callout from '$lib/components/molecules/Callout.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
</script>

<PagesWrapper heading="Self-host">
	<div class="wrapper">
		<Toc class="toc" />
		<div id="toc-contents" class="content-preview">
			<h2 id="torrustSolution">Torrust Solution (Index + Tracker)</h2>

			<p>
				Considering hosting your own torrent site? Torrust offers a comprehensive solution with both
				the Torrust <a href="torrent-index">Index</a>
				and the <a href="torrent-tracker">Tracker</a>.
			</p>

			<p>
				The Torrust Tracker is integrated with the Index, ensuring that downloaded torrents
				automatically include it in their tracker list.
			</p>

			<p>
				Torrust is highly flexible. You can run both the Tracker and Index together on the same
				server, or set them up separately. You can choose to build from source or use pre-built
				containers. If you don't expect heavy traffic, we recommend using Docker Compose to simplify
				setup. For detailed instructions, refer to our guide on <a
					href="blog/deploying-torrust-to-production">Deploying Torrust to Production</a
				>.
			</p>

			<Callout type="warning">
				Note: You can install the Tracker independently, but the Index cannot function without the
				Torrust Tracker.
			</Callout>

			<p>
				Our tutorial demonstrates how to install both the Tracker and Index on a single server using
				a shared Docker Compose configuration. However, if your deployment requires more resources,
				you can host the Tracker and Index on separate servers. In that case, modify the Docker
				Compose setup to split the services, and configure the Index to connect to the external
				Tracker.
			</p>

			<p>For more information on installation, refer to the following resources:</p>

			<ul>
				<li>
					<a href="https://docs.rs/torrust-tracker/latest/torrust_tracker/">Tracker Documentation</a
					>
				</li>
				<li>
					<a href="https://docs.rs/torrust-tracker/latest/torrust_index/">Index Documentation</a>
				</li>
				<li>
					<a href="https://github.com/torrust/torrust-tracker/blob/develop/docs/containers.md"
						>Tracker Containerization Guide</a
					>
				</li>
				<li>
					<a href="https://github.com/torrust/torrust-index/blob/develop/docs/containers.md"
						>Index Containerization Guide</a
					>
				</li>
				<li>
					<a href="https://github.com/torrust/torrust-compose">Torrust Compose Repository</a> (Docker
					Compose setups)
				</li>
				<li>
					<a href="https://github.com/torrust/torrust-demo">Torrust Demo Repository</a> (issues and feedback)
				</li>
				<li><a href="http://localhost:5173/tags/Deployment">Deployment Tutorials</a> (blog)</li>
			</ul>

			<Callout type="info">
				If you're not familiar with system administration, we recommend using Docker Compose for
				installation. It simplifies the process and provides automated certificate provisioning and
				renewal.
			</Callout>

			<h2 id="torrustIndex">Torrust Index</h2>

			<p>
				For instructions on installing the Index independently, visit the <a
					href="torrent-index#installation">installation section</a
				> where you'll find guides for both source-based and Docker installations.
			</p>

			<h2 id="torrustTracker">Torrust Tracker</h2>

			<p>
				If you choose to install only the Tracker, please refer to the <a
					href="torrent-tracker#installation">installation section</a
				> for detailed instructions on building from source or using Docker.
			</p>

			<p>
				If your tracker traffic is high, you might prefer to run the Tracker on a separate server.
				To do so, simply remove the Tracker service from your Docker Compose configuration (if
				you're using Docker Compose) and set it up independently using source builds or containers.
			</p>
		</div>
	</div>
</PagesWrapper>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		position: relative;
		margin-inline: 2rem;
	}

	.content-preview {
		flex: 1;
		word-break: keep-all;
		padding-top: 2rem;
	}

	h2 {
		font-size: 1.8rem;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem;
	}

	p {
		font-size: 1rem;
		padding-top: 1.5rem;
		color: rgba(245, 245, 245, 0.8);
	}

	a {
		word-break: keep-all;
		color: var(--color-link);
	}

	ul {
		display: flex;
		flex-direction: column;
		list-style-type: disc;
		margin: 0;
		padding-left: 1.5rem;
		padding-top: 1rem;
	}

	ul li {
		margin: 0.25rem 0;
		word-break: keep-all;
	}

	@include bp.for-desktop-up {
		.wrapper {
			flex-direction: row;
			gap: 4rem;
		}

		.wrapper :global(.toc) {
			position: sticky;
			top: 4rem;
			height: min-content;
		}

		.content-preview {
			overflow-y: scroll;
			scrollbar-width: none;
			-ms-overflow-style: none;
			padding-top: 0rem;
		}
	}
</style>
