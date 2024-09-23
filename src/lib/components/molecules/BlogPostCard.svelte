<script lang="ts">
	import Cards from '$lib/components/atoms/Cards.svelte';
	import { formatDate } from '$lib/utils/date';

	export let title: string;
	export let coverImage: string | undefined = undefined;
	export let slug: string;
	export let date: string;
	export let contributor: string;

	export let showImage = true;

	const formattedDate = formatDate(date);
</script>

<Cards
	href={`/${slug}`}
	target="_self"
	additionalClass="blog-post-card {!showImage || !coverImage ? 'no-image' : ''}"
>
	<div class="content" slot="content">
		<h3 class="title">
			{title}
		</h3>
		{#if date}
			<p class="date">{contributor ? contributor + ' - ' : ''}{formattedDate}</p>
		{/if}
	</div>
</Cards>

<style lang="scss">
	.title {
		font-size: 1.5rem;
	}

	.date {
		padding-top: 0.5rem;
		font-size: 14px;
	}
</style>
