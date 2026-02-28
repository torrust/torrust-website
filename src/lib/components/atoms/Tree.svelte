<script lang="ts">
	import Tree from './Tree.svelte';
	import { type TableOfContentsItem, type TableOfContentsElements, melt } from '@melt-ui/svelte';

	interface Props {
		tree?: TableOfContentsItem[];
		activeHeadingIdxs: number[];
		item: TableOfContentsElements['item'];
		level?: number;
	}

	let { tree = [], activeHeadingIdxs, item, level = 1 }: Props = $props();
</script>

<ul class="mt-0 list-none {level !== 1 ? 'nested' : ''}">
	{#if tree && tree.length}
		{#each tree as heading, i (i)}
			<li class="mt-0 pt-1.5 list-none">
				<!-- Tailwind: Removes bullets -->
				<a
					href="#{heading.id}"
					use:melt={$item(heading.id)}
					class="inline-flex items-start justify-start gap-1 text-sm text-gray-400 no-underline transition-colors
		 hover:text-gray-100 data-[active]:[color:var(--color-link)] break-keep leading-snug"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html heading.node.innerHTML}
				</a>
				{#if heading.children && heading.children.length}
					<Tree tree={heading.children} level={level + 1} {activeHeadingIdxs} {item} />
				{/if}
			</li>
		{/each}
	{/if}
</ul>

<style>
	ul {
		list-style: none !important;
		padding-left: 0 !important;
		margin: 0 !important;
	}

	ul.nested {
		padding-left: 0.75rem !important;
	}

	li {
		list-style-type: none !important;
	}
</style>
