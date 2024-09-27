<script lang="ts">
	import { onMount } from 'svelte';

	interface Section {
		name: string;
		id: string;
	}

	export let sections: Section[] = [];
	export let activeSection = '';

	onMount(() => {
		if (sections.length > 0) {
			activeSection = sections[0].id;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ threshold: 0.5 }
		);

		sections.forEach((section) => {
			const sectionElement = document.getElementById(section.id);
			if (sectionElement) {
				observer.observe(sectionElement);
			}
		});

		return () => {
			observer.disconnect();
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
		width: 350px;
		padding-inline: 0;
		position: sticky;
		top: 40px;
		z-index: 900;
	}

	.sticky-nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.active {
		font-weight: bold;
	}

	a {
		color: rgba(245, 245, 245, 0.96);
		font-size: 0.875rem;

		&:hover {
			color: rgba(255, 49, 0, 0.96);
		}
	}
</style>
