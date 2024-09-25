<script lang="ts">
	import HeroCard from '$lib/components/atoms/HeroCard.svelte';
</script>

<div class="svg-container">
	<div class="svg-content">
		<h1 class="hero-heading">Modern BitTorrent index and tracker</h1>
		<p class="hero-para">
			Torrust is an open source project that aims to provide you with the tools you need to host
			your own torrent indexes with ease.
		</p>
		<div class="details">
			<HeroCard
				title={'index'}
				details={'The Index is a feature-rich torrent indexing site split between an API (backend) built with Rust, and our reference web app that consumes the API, built with Vue 3.'}
				version={'https://github.com/torrust/torrust-index/releases'}
				liveDemo={'https://index.torrust-demo.com/torrents'}
				learnMore={'/torrent-index'}
			/>
			<HeroCard
				title={'tracker'}
				details={'A lightweight Rust-based BitTorrent tracker for efficient torrent serving to many peers with high performance, robustness, security, and community support.'}
				version={'https://github.com/torrust/torrust-tracker/releases'}
				liveDemo={'https://index.torrust-demo.com/torrents'}
				learnMore={'/torrent-tracker'}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.svg-container {
		display: flex;
		flex-direction: column;
		text-align: center;
		background-color: rgba(255, 49, 0, 1);
		color: rgba(245, 245, 245, 0.96);
		padding: 0;
	}

	.svg-container {
		width: 100%;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width='768' height='480' viewBox='0 0 768 480' fill='rgb(254, 74, 30)'><path d='M1005.2 123.646C1027.43 11.7464 953.881 -97.3506 843.527 -126.92L138.041 -315.954C40.5775 -342.07 -63.6767 -288.152 -91.5498 -191.16C-119.946 -92.2144 -61.7805 10.2473 37.2454 36.7812L306.002 108.794L55.7571 263.014C-106.71 363.089 -70.6249 608.894 113.559 658.246C170.006 673.371 230.427 665.068 280.715 635.209L900.796 267.959C954.822 237.428 993.036 184.656 1005.25 123.451L1005.2 123.646Z' fill='rgb(254, 74, 30)' fill-opacity='1'/></svg>");
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		background-color: rgb(255, 50, 1);
		color: white;
		padding-inline: 1.5rem;

		@include for-tablet-portrait-up {
			.hero-heading,
			.hero-para {
				width: 640px;
				margin: 0 auto;
			}

			.hero-heading {
				padding-top: 4rem;
			}

			.hero-para {
				padding-top: 1.5rem;
			}
		}
	}

	.svg-content {
		text-align: center;

		h1 {
			font-size: 48px;
			margin-top: 4rem;
		}

		p {
			margin-top: 1.5rem;
		}
	}

	.details {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		text-align: left;
		align-items: stretch;
		margin-block: 4rem;

		@include for-tablet-portrait-up {
			flex-direction: row;
			max-width: 1050px;
			margin-left: auto;
			margin-right: auto;
		}

		@include for-desktop-up {
			margin-inline: auto;
		}
	}
</style>
