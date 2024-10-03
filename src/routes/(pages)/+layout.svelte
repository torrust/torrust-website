<script lang="ts">
</script>

<div class="layout-container">
	<slot />
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.layout-container {
		background: rgba(26, 26, 26, 1);
		padding: 0;
		color: rgba(245, 245, 245, 0.96);
		padding-bottom: 64px;
	}

	.layout-container :global(.slider-wrapper) {
		width: 100vw;
		margin-left: calc(50% - 50vw);
	}
</style>
