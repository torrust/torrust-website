<script lang="ts">
	import Tree from './Tree.svelte';
	import { createTableOfContents } from '@melt-ui/svelte';
	import { pushState } from '$app/navigation';

	interface Props {
		class: string;
		selector?: string;
	}

	let { class: classes, selector = '#toc-contents' }: Props = $props();

	// Note: selector is intentionally captured at initialization for createTableOfContents.
	// This library call doesn't support dynamic selector updates, so reactivity isn't needed.
	const {
		elements: { item },
		states: { activeHeadingIdxs, headingsTree }
	} = createTableOfContents({
		selector: (() => selector)(),
		exclude: ['h3'],
		activeType: 'highest',
		pushStateFn: pushState,
		headingFilterFn: (heading) => !heading.hasAttribute('data-toc-ignore'),

		scrollFn: (id) => {
			const element = document.getElementById(id);

			if (!element) return;
			const prevScrollMargin = element.style.scrollMarginTop;
			element.style.scrollMarginTop = '16px';

			// trigger reflow
			getComputedStyle(element);
			element?.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
			element.style.scrollMarginTop = prevScrollMargin;
		}
	});
</script>

<div class="lg:overflow-y-auto rounded-lg text-white {classes}">
	<nav>
		{#key $headingsTree}
			<Tree tree={$headingsTree} activeHeadingIdxs={$activeHeadingIdxs} {item} />
		{/key}
	</nav>
</div>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	@include bp.for-desktop-up {
		nav {
			position: sticky;
			top: 0;
			z-index: 100;
			background-color: inherit;
			max-width: 220px;
		}
	}
</style>
