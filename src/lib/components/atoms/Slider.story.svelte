<script lang="ts">
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import the Histoire types
	import Slider from './Slider.svelte'; // Import the Slider component

	export let Hst: HstType; // This will be provided by Histoire

	// Sample data for the Slider component
	const titleArr = [
		{ title: 'Learn Svelte', link: 'https://svelte.dev/docs' },
		{ title: 'Explore React', link: 'https://reactjs.org/docs/getting-started.html' },
		{ title: 'Dive into Vue', link: 'https://vuejs.org/v2/guide/' },
		{ title: 'Angular Documentation', link: 'https://angular.io/docs' },
		{ title: 'Next.js Guide', link: 'https://nextjs.org/docs/getting-started' },
		{ title: 'Back to Home', link: '' } // Example of a non-link item
	];
</script>

<svelte:component this={Hst.Story} title="Molecules/Slider" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Default Slider">
		<Slider {titleArr} />
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Slider with No Links">
		<Slider
			titleArr={[
				{ title: 'Static Item 1', link: '' },
				{ title: 'Static Item 2', link: '' },
				{ title: 'Static Item 3', link: '' }
			]}
		/>
	</svelte:component>
</svelte:component>
