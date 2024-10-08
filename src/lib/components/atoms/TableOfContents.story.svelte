<script lang="ts">
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import Histoire types
	import TableOfContents from './TableOfContents.svelte'; // Import the TableOfContents component

	export let Hst: HstType; // Provided by Histoire

	// Sample sections with subsections
	const sections = [
		{
			name: 'Introduction',
			id: 'introduction',
			subsections: [
				{ name: 'What is Svelte?', id: 'what-is-svelte' },
				{ name: 'Getting Started', id: 'getting-started' }
			]
		},
		{
			name: 'Components',
			id: 'components',
			subsections: [
				{ name: 'Creating Components', id: 'creating-components' },
				{ name: 'Component Props', id: 'component-props' }
			]
		},
		{
			name: 'Stores',
			id: 'stores',
			subsections: []
		},
		{
			name: 'Routing',
			id: 'routing',
			subsections: [
				{ name: 'Using SvelteKit', id: 'using-sveltekit' },
				{ name: 'Creating Routes', id: 'creating-routes' }
			]
		},
		{
			name: 'Deployment',
			id: 'deployment',
			subsections: []
		}
	];
</script>

<svelte:component
	this={Hst.Story}
	title="Molecules/TableOfContents"
	layout={{ type: 'grid', width: 600 }}
>
	<svelte:component this={Hst.Variant} title="Default Table of Contents">
		<TableOfContents {sections} />
	</svelte:component>
</svelte:component>
