<script lang="ts">
	import { Hst as HstType } from '@histoire/plugin-svelte'; // Import the Histoire types
	import HeroCard from './HeroCard.svelte'; // Import the HeroCard component

	export let Hst: HstType; // This will be provided by Histoire

	// Sample data for the HeroCard
	const title = 'My Awesome Project';
	const details =
		'This project is designed to help you achieve great things. It offers a variety of features and benefits.';
	const version = 'https://github.com/your-repo/releases/tag/v3.0.0'; // Replace with your actual version link
	const liveDemo = 'https://your-live-demo-link.com'; // Replace with your actual live demo link
	const learnMore = 'https://your-learn-more-link.com'; // Replace with your actual learn more link
</script>

<svelte:component this={Hst.Story} title="Molecules/HeroCard" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Default Variant">
		<HeroCard {title} {details} {version} {liveDemo} {learnMore} />
	</svelte:component>
</svelte:component>
