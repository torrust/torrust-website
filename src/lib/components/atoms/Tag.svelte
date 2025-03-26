<script lang="ts">
	interface Props {
		tag: string;
		children?: import('svelte').Snippet;
	}

	let { tag, children }: Props = $props();
</script>

<div class="tag">
	<a href={`/tags/${tag}`}>
		{#if children}{@render children()}{:else}{tag}{/if}
	</a>
</div>

<style lang="scss">
	.tag {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		padding-right: 15px;
		border-radius: 10px;
		font-weight: 500;
		font-size: 0.85rem;
		width: fit-content;
		white-space: nowrap;
		color: rgba(245, 245, 245, 0.64);
	}

	a {
		color: rgba(245, 245, 245, 0.64);
		text-transform: uppercase;
		font-size: 12px;
		&:hover {
			color: rgba(254, 13, 0, 1);
		}
	}
</style>
