<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="layout-container">
	{@render children?.()}
</div>

<style lang="scss">
	.layout-container {
		background: rgba(25, 25, 25, 1);
		padding: 0;
		color: rgba(245, 245, 245, 0.96);
		padding-bottom: 64px;
	}

	.layout-container :global(.slider-wrapper) {
		width: 100vw;
		margin-left: calc(50% - 50vw);
	}
</style>
