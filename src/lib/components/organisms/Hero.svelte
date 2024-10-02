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
		background-image: url('data:image/svg+xml,%3Csvg%20width%3D%221368%22%20height%3D%22680%22%20viewBox%3D%220%200%201368%20680%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1388.04%202.06213C1378.81%20-138.439%201256.27%20-245%201115.27%20-245H213.872C89.3427%20-245%20-17.7176%20-147.423%20-19.9636%20-22.8936C-22.2096%20104.131%2079.8594%20207.698%20206.385%20207.698H549.777L300.718%20471.48C139.005%20642.677%20260.539%20924.178%20495.872%20924.178C567.994%20924.178%20637.371%20894.98%20687.782%20843.321L1309.68%20207.448C1364.33%20153.793%201393.03%2078.6764%201388.04%201.81261V2.06213Z%22%20fill%3D%22%23F5F5F5%22%20fill-opacity%3D%220.12%22/%3E%3C/svg%3E');
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		background-color: rgba(255, 49, 0, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(245, 245, 245, 0.96);

		@include for-tablet-portrait-up {
			.hero-heading,
			.hero-para {
				width: 580px;
				margin: 0 auto;
			}

			.hero-heading {
				padding-top: 2rem;
			}

			.hero-para {
				padding-top: 24px;
			}
		}
	}

	.svg-content {
		text-align: center;

		h1 {
			font-size: 48px;
			margin-top: 2rem;
			line-height: 48px;
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
		margin-block: 2rem;

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
