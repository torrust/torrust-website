<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import TagCard from '$lib/components/atoms/TagCard.svelte';

	interface Props {
		title: string;
		coverImage: string;
		slug: string;
		date: string;
		excerpt: string;
	}

	let { title, coverImage, slug, date, excerpt }: Props = $props();

	const formattedDate = formatDate(date);
</script>

<TagCard href="/blog/{slug}" target="_self">
	{#snippet image()}
		<div class="image-container">
			{#if coverImage}
				<img src={coverImage} alt="Cover for this blog post" />
			{/if}
		</div>
	{/snippet}
	{#snippet content()}
		<div class="content">
			<p class="title">
				{title}
			</p>
			{#if date}
				<div class="date">Published {formattedDate}</div>
			{/if}
			{#if excerpt}
				<p class="text">
					{excerpt}
				</p>
			{/if}
		</div>
	{/snippet}
</TagCard>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	.content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 20px;
		align-items: flex-start;
		word-break: keep-all;
	}

	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		font-size: 1.2rem;
		font-family: var(--font--title);
		font-weight: 700;
	}

	.date {
		padding-top: 0.25rem;
		font-size: 0.8rem;
		color: rgba(var(--color--text-rgb), 0.8);
	}

	.text {
		margin-top: 5px;
		font-size: 0.9rem;
		text-align: justify;
	}

	.image-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 10px 10px 0 0;

		@include bp.for-tablet-portrait-up {
			border-radius: 10px 0 0 10px;
		}
	}
</style>
