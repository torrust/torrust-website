<script lang="ts">
	interface Props {
		heading?: string;
		children?: import('svelte').Snippet;
	}

	let { heading, children }: Props = $props();
</script>

<div class="para">
	{#if heading}
		<h1>{heading}</h1>
	{/if}
	<div class="layout">
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	@use '$lib/scss/breakpoints' as bp;

	.para {
		display: flex;
		flex-direction: column;
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		padding-inline: 2.5rem;
		font-size: 2rem;
		padding-top: 6rem;
	}

	.layout {
		display: flex;
		flex-direction: column;
		padding-top: 4rem;
	}

	@include bp.for-desktop-up {
		.layout {
			height: 100%;
			flex-direction: row;
			gap: 4rem;
		}
	}
</style>
