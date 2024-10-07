<script lang="ts">
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import the Histoire types
	import Image from './Image.svelte'; // Import the Image component

	export let Hst: HstType; // This will be provided by Histoire

	// Sample data for the Image component
	const src = 'https://via.placeholder.com/800'; // Replace with an actual image URL
	const alt = 'Placeholder Image';
	const fullBleed = true; // Set to true or false based on your requirement
	const widths = ['320', '480', '800']; // Sample widths for responsive images
</script>

<svelte:component this={Hst.Story} title="Atoms/Image" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Default Variant">
		<Image {src} {alt} {fullBleed} {widths} />
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Without Full Bleed">
		<Image {src} {alt} fullBleed={false} {widths} />
	</svelte:component>
</svelte:component>
