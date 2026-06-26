<script lang="ts">
	import MiniLogo from '$lib/icons/miniLogo.svelte';

	interface Props {
		title: string;
		details: string;
		version: string;
		liveDemo: string;
		learnMore: string;
	}

	let { title, details, version, liveDemo, learnMore }: Props = $props();

	const isDemoUnavailable = $derived(
		liveDemo === 'https://github.com/torrust/torrust-website/issues/228'
	);
	const demoLabel = $derived(isDemoUnavailable ? 'Unavailable' : 'Live demo');
</script>

<div class="details-card">
	<div class="details-info">
		<div>
			<MiniLogo />
			<h3>{title}</h3>
		</div>
		<a href={version} target="_blank" class="version">v 3.0.0</a>
	</div>
	<p>
		{details}
	</p>
	<div class="details-info">
		<a href={liveDemo} target="_blank" class="live-demo" class:unavailable={isDemoUnavailable}
			>{demoLabel}</a
		>
		<a href={learnMore} class="learn-btn">Learn more</a>
	</div>
</div>

<style lang="scss">
	.details-card {
		background-color: rgba(26, 26, 26, 0.48);
		padding: 1.4rem;
		border-radius: 1.5rem;

		p {
			color: rgba(245, 245, 245, 0.8);
			font-size: 16px;
			margin-block: 28px;
			line-height: 1.5;
		}
	}

	.details-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: nowrap;

		div {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 4px;
		}

		h3 {
			color: rgba(245, 245, 245, 0.96);
			position: relative;
			top: 0.2rem;
			font-size: 24px;
		}

		.version {
			border: 1px solid rgba(245, 245, 245, 0.96);
			padding: 4px 12px;
			border-radius: 1.5rem;
		}

		a {
			border: 1px solid rgba(245, 245, 245, 0.96);
			border-radius: 1.5rem;
			color: rgba(245, 245, 245, 0.96);
			padding: 12px 16px;
			white-space: nowrap;
			text-decoration: none;
			font-size: 16px;
		}

		.live-demo {
			background-color: rgba(254, 13, 0, 1);
		}

		.live-demo.unavailable {
			background-color: rgba(100, 100, 100, 0.6);
			cursor: default;
			opacity: 0.7;
			pointer-events: none;
		}

		.learn-btn {
			background-color: transparent;
			border: none;
			padding-left: 6px;
			text-decoration: underline;
			white-space: nowrap;
		}
	}
</style>
