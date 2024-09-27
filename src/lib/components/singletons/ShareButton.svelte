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
	<button on:click={toggleDropdown} class="dropdown-button {showDropdown ? 'active' : ''}">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="hover-icon {showDropdown ? 'active' : ''}"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			{...$$props}
		>
			<path
				d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"
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
	.hover-icon path {
		fill: rgba(245, 245, 245, 0.48); /* Default color */
		transition: fill 0.3s ease;
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
		font-size: 14px;
		transition:
			color 0.3s ease,
			border 0.3s ease;
		position: relative;
	}

	/* Active state for button and SVG icon */
	.dropdown-button.active,
	.hover-icon.active path {
		color: rgba(245, 245, 245, 0.8); /* Red color for the text */
		fill: rgba(245, 245, 245, 0.8); /* Red color for the SVG */
		border-color: rgba(245, 245, 245, 0.8); /* Red border */
	}

	.dropdown-container {
		position: relative; /* Ensure the dropdown is positioned relative to the container */
		display: inline-block;
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 0.5rem); /* Position the dropdown below the button */
		right: 0;
		width: 350px;
		background-color: rgba(36, 36, 36, 1);
		border: 1px solid rgba(245, 245, 245, 0.08);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		border-radius: 1.5rem;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		z-index: 100; /* Ensure the dropdown stays above other elements */
		opacity: 1;
		visibility: visible;
		transition:
			opacity 0.3s ease,
			visibility 0.3s ease;
	}

	.dropdown-menu a {
		margin: 0.5rem 0;
		color: rgba(245, 245, 245, 0.8);
		font-size: 16px;
	}

	.dropdown-menu a:hover {
		color: rgba(255, 49, 0, 1);
	}

	/* When the dropdown is hidden */
	.dropdown-menu.hidden {
		opacity: 0;
		visibility: hidden;
	}
</style>
