<script lang="ts">
	import { onMount } from 'svelte';

	interface Section {
		name: string;
		id: string;
		subsections?: Section[];
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
			{ threshold: 0.9 }
		);

		sections.forEach((section) => {
			const sectionElement = document.getElementById(section.id);
			if (sectionElement) {
				observer.observe(sectionElement);
			}
			if (section.subsections) {
				section.subsections.forEach((subsection) => {
					const subsectionElement = document.getElementById(subsection.id);
					if (subsectionElement) {
						observer.observe(subsectionElement);
					}
				});
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
				{#if section.subsections && section.subsections.length > 0}
					<ul class="sublist">
						{#each section.subsections as subsection}
							<li class={subsection.id === activeSection ? 'active' : ''}>
								<a href={'#' + subsection.id}>{subsection.name}</a>
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.sticky-nav {
		background: rgba(26, 26, 26, 1);
		width: 300px;
		padding-inline: 0;
		position: sticky;
		top: 40px;
		z-index: 900;
	}

	.sticky-nav ul {
		list-style: none;
		padding: 0;
		margin: 0;

		li {
			margin-top: 16px;

			a {
				color: rgba(245, 245, 245, 0.96);
				font-size: 0.875rem;
				text-decoration: none;
				word-break: keep-all;

				&:hover {
					color: rgba(255, 49, 0, 0.96);
				}
			}

			&.active a {
				font-weight: bold;
				color: rgba(255, 49, 0, 0.96);
			}

			/* Sublist styling */
			ul.sublist {
				margin-left: 20px;
				list-style-type: none;
				margin-top: 16px;

				li {
					margin-top: 8px;

					ul.sublist {
						margin-left: 20px;
						list-style-type: circle;
					}
				}
			}
		}
	}
</style>
