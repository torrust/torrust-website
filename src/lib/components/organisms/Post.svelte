<script lang="ts">
	interface Props {
		title: string;
		slug: string;
		contributor: string;
		contributorSlug: string;
		date: string;
		excerpt: string;
		coverImage: string;
		tags: string[];
		children?: import('svelte').Snippet;
	}

	let {
		title,
		slug,
		contributor,
		contributorSlug,
		date,
		excerpt,
		coverImage,
		tags,
		children
	}: Props = $props();

	import { formatDate } from '$lib/utils/date';
	import Image from '$lib/components/atoms/Image.svelte';
	import ShareButton from '$lib/components/singletons/ShareButton.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="container">
	<main>
		<article id="article-content">
			<div class="header">
				{#if tags.length}
					<div class="tags">
						{#each tags as tag}
							<Tag {tag}>
								{tag}
							</Tag>
						{/each}
					</div>
				{/if}
				<h1>{title}</h1>
				<p>{excerpt}</p>
				<div class="note">
					<div>
						{#if contributor}
							<a class="author" href={'/contributor/' + contributorSlug}>{contributor}</a>
							-
						{/if}
						{formatDate(date)}
					</div>
					<ShareButton {slug} {title} />
				</div>
			</div>
			{#if coverImage}
				<div class="cover-image">
					{#key coverImage}
						<Image src={coverImage + '?v=' + slug} alt={title} />
					{/key}
				</div>
			{/if}
			<div class="layout">
				{@render children?.()}
			</div>
		</article>
	</main>
</div>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	.container {
		background: rgba(26, 26, 26, 1);
		color: rgba(245, 245, 245, 0.96);
		margin: 0 auto;
		max-width: 1250px;
		padding: 2rem 2rem 0 2rem;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		text-align: left;
		gap: 10px;
		width: min(var(--main-column-width), 100%);
		margin: 0 auto;

		h1 {
			font-size: 40px;
		}

		p {
			color: rgba(245, 245, 245, 0.8);
			font-size: 20px;
		}

		.note {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			font-size: 90%;
			color: rgba(245, 245, 245, 0.96);
		}

		.author {
			color: rgba(245, 245, 245, 0.96);
		}

		.author:hover {
			color: rgba(255, 49, 0, 0.96);
		}
	}

	.cover-image {
		width: min(var(--main-column-width), 100%);
		max-height: 400px;
		box-shadow: var(--image-shadow);
		border-radius: 6px;
		margin-top: 2rem;
	}

	:global(.cover-image img) {
		max-height: 400px;
		object-fit: cover;
	}

	.tags {
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
</style>
