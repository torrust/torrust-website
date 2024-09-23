<script lang="ts">
	import { HttpRegex } from '$lib/utils/regex';
	import ExternalLinkIcon from '$lib/icons/external-link.svelte';

	export let color: 'primary' | 'secondary' = 'primary';

	export let href: string | undefined = undefined;
	export let tag: string;
	const isExternalLink = !!href && HttpRegex.test(href);
	export let target: '_self' | '_blank' = isExternalLink ? '_blank' : '_self';
	export let rel = isExternalLink ? 'noopener noreferrer' : undefined;

	$: tagElement = href ? 'a' : 'div';
	$: linkProps = {
		href,
		target,
		rel
	};
</script>

<svelte:element this={tagElement} class="tag {color}" {...linkProps}>
	{#if isExternalLink}
		<div class="icon">
			{tag}
			<ExternalLinkIcon />
		</div>
	{:else}
		<a data-sveltekit-reload href="/tags/{tag}">
			<slot />
		</a>
	{/if}
</svelte:element>

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
	}

	.icon {
		display: flex;
		gap: 15px;
		width: 100%;
		height: 20px;
	}

	a {
		text-decoration-thickness: 1px;
		color: white;
		&:hover {
			color: rgba(255, 49, 0, 1);
		}
	}
</style>
