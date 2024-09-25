<script lang="ts">
	import { siteBaseUrl } from '$lib/data/meta';
	import ShareUrl from '$lib/components/singletons/ShareUrl.svelte';

	export let slug: string;
	export let title: string;

	let showDropdown: boolean = false;

	const encodedSubject = encodeURIComponent('I wanted you to see this blog post');
	const encodedBody = encodeURIComponent(
		`${title} is a really interesting blog post from Torrust. Check it out here: ${siteBaseUrl}/${slug}`
	);
	const encodedSlug = encodeURIComponent(slug);

	const unescapedHref = (href: string) => {
		return href;
	};

	const socialLinks = [
		{
			text: 'Share via email',
			href: `mailto:?subject=${encodedSubject}&body=${encodedBody}`
		},
		{
			text: 'Share on Facebook',
			href: `https://www.facebook.com/sharer.php?u=${siteBaseUrl}/${encodedSlug}`
		},
		{
			text: 'Share on LinkedIn',
			href: `http://www.linkedin.com/shareArticle?mini=true&url=${siteBaseUrl}/${encodedSlug}`
		},
		{
			text: 'Share on X',
			href: `https://twitter.com/share?url=${siteBaseUrl}/${encodedSlug}&text=${title}`
		}
	];

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}
</script>

<div class="dropdown-container">
	<button on:click={toggleDropdown} class="dropdown-button" class:active={showDropdown}>
		<svg
			class="share-icon"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M2.66666 8V13.3333C2.66666 13.687 2.80714 14.0261 3.05719 14.2761C3.30724 14.5262 3.64638 14.6667 4 14.6667H12C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333V8"
				stroke="#F5F5F5"
				stroke-opacity="0.08"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M10.6667 3.99998L8 1.33331L5.33334 3.99998"
				stroke="#F5F5F5"
				stroke-opacity="0.08"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8 1.33331V9.99998"
				stroke="#F5F5F5"
				stroke-opacity="0.08"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		Share
	</button>
	{#if showDropdown}
		<div class="dropdown-menu">
			<ShareUrl />
			{#each socialLinks as { text, href }}
				<a href={unescapedHref(href)} target="_blank" rel="noopener noreferrer">
					{text}
				</a>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.dropdown-container {
		position: relative;
		display: inline-block;
	}

	.dropdown-button {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 0.5rem 1rem;
		background-color: transparent;
		color: rgba(245, 245, 245, 0.48);
		border: 1px solid rgba(245, 245, 245, 0.48);
		cursor: pointer;
		border-radius: 1.5rem;
		font-size: 1rem;
	}

	.dropdown-button.active {
		border: 1px solid rgba(245, 245, 245, 0.8);
		color: rgba(245, 245, 245, 0.8);
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		width: 350px;
		background-color: rgba(36, 36, 36, 1);
		border: 1px solid rgba(245, 245, 245, 0.08);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		border-radius: 1.5rem;
		display: flex;
		flex-direction: column;
		padding: 1rem;
	}

	.dropdown-menu a {
		margin: 0.5rem 0;
		color: rgba(245, 245, 245, 0.8);
		font-size: 16px;
	}

	.dropdown-menu a:hover {
		color: rgba(255, 49, 0, 1);
	}
</style>
