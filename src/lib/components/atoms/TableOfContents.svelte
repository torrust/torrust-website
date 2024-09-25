<!-- TableOfContents.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	interface Section {
		name: string;
		id: string;
	}

	export let sections: Section[] = [];
	export let activeSection = '';

	const handleScroll = () => {
		const scrollPosition = window.scrollY + 0; // Adjust based on offset

		sections.forEach((section) => {
			const sectionElement = document.getElementById(section.id);
			if (sectionElement) {
				const offsetTop = sectionElement.offsetTop;
				const offsetHeight = sectionElement.offsetHeight;

				if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
					activeSection = section.id;
				}
			}
		});
	};

	onMount(() => {
		if (sections.length > 0) {
			activeSection = sections[0].id;
		}

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<nav class="sticky-nav">
	<ul>
		{#each sections as section}
			<li class={section.id === activeSection ? 'active' : ''}>
				<a href={'#' + section.id}>{section.name}</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.sticky-nav {
		background: rgba(26, 26, 26, 1);
		width: 350px; /* Set width for the nav */
		padding-inline: 0; /* Padding around nav */
		position: sticky; /* Keep it sticky within the viewport */
		top: 40px; /* Adjust this to control when it becomes sticky */
		z-index: 900; /* Ensure it stays on top */
	}

	.sticky-nav ul {
		list-style: none; /* Remove default list styling */
		padding: 0; /* Remove padding */
		margin: 0; /* Remove margin */
	}

	.active {
		font-weight: bold; /* Highlight the active section */
	}
</style>
