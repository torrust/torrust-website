<script lang="ts">
	import ContentSection from './ContentSection.svelte'; // Adjust the import path as necessary
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import Histoire types

	export let Hst: HstType;

	// Example data for the content section
	const exampleTitle = 'Welcome to Our Blog';
	const exampleDescription =
		'Here you will find various articles and insights on different topics. Enjoy reading!';
</script>

<svelte:component
	this={Hst.Story}
	title="Molecules/ContentSection"
	layout={{ type: 'grid', width: 600 }}
>
	<svelte:component this={Hst.Variant} title="Default Content Section">
		<ContentSection
			id="default-section"
			title={exampleTitle}
			description={exampleDescription}
			align="top"
		>
			<p>This is the main content area where articles or other information can be placed.</p>
		</ContentSection>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Left Aligned Section">
		<ContentSection
			id="left-section"
			title={exampleTitle}
			description={exampleDescription}
			align="left"
		>
			<p>This is a left-aligned section content area.</p>
		</ContentSection>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Right Aligned Section">
		<ContentSection
			id="right-section"
			title={exampleTitle}
			description={exampleDescription}
			align="right"
		>
			<p>This is a right-aligned section content area.</p>
		</ContentSection>
	</svelte:component>
</svelte:component>
