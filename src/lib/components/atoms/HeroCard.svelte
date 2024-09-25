<script lang="ts">
	import MiniLogo from '$lib/icons/miniLogo.svelte';

	export let title: string;
	export let details: string;
	export let version: string;
	export let liveDemo: string;
	export let learnMore: string;
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
		<a href={liveDemo} class="live-demo" target="_blank">Live demo</a>
		<a href={learnMore} class="learn-btn">Learn more</a>
	</div>
</div>

<style lang="scss">
	.details-card {
		background-color: rgba(26, 26, 26, 0.48);
		padding: 1.5rem;
		border-radius: 1.5rem;

		p {
			color: rgba(245, 245, 245, 0.8);
			font-size: 16px;
			min-height: 100px;
			margin-top: 28px;
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
			background-color: rgba(255, 49, 0, 1);
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
