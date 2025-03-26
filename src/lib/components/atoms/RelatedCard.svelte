<script lang="ts">
	import { HttpRegex } from '$lib/utils/regex';

	interface Props {
		additionalClass?: string | undefined;
		href?: string | undefined;
		target?: '_self' | '_blank';
		rel?: any;
		content?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		additionalClass = undefined,
		href = undefined,
		target = '_self',
		rel = undefined,
		content,
		footer,
		...rest
	}: Props = $props();

	const isExternalLink = !!href && HttpRegex.test(href);

	target = isExternalLink ? '_blank' : '_self';
	rel = isExternalLink ? 'noopener noreferrer' : undefined;

	let tag = $derived(href ? 'a' : 'article');
	let linkProps = $derived({
		href,
		target,
		rel
	});
</script>

<svelte:element
	this={tag}
	class="card {additionalClass}"
	{...linkProps}
	data-sveltekit-preload-data
	{...rest}
>
	<div class="body">
		<div class="content">
			{@render content?.()}
		</div>
		{#if footer}
			<div class="footer">
				{@render footer?.()}
			</div>
		{/if}
	</div>
</svelte:element>

<style lang="scss">
	.card {
		background: rgba(0, 0, 0, 0.5);
		box-shadow: var(--card-shadow);
		color: var(--color--text);
		border-radius: 10px;
		transition: all 0.4s ease;
		position: relative;
		overflow: hidden;
		width: 100%;
		color: rgba(245, 245, 245, 0.96);
		border: 1px solid rgba(245, 245, 245, 0.08);

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		text-decoration: none;

		&[href],
		&[onclick] {
			cursor: pointer;
			&:hover {
				border: 1px solid rgba(254, 13, 0, 1);
			}
		}
	}

	.body {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 10px;
		padding: 20px 20px;
		flex: 1 0 50%;
		color: rgba(245, 245, 245, 0.96);

		.content {
			display: flex;
			flex-direction: column;
			flex: 1;
			color: rgba(245, 245, 245, 0.96);
		}
	}
</style>
