<script lang="ts">
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import the Histoire types
	import RelatedCard from './RelatedCard.svelte'; // Import the RelatedCard component

	export let Hst: HstType; // This will be provided by Histoire

	// Sample data for the RelatedCard component
	const title = 'Learn Svelte';
	const details = 'Discover the power of Svelte, a modern JavaScript framework.';
	const version = 'https://svelte.dev/release';
	const liveDemo = 'https://svelte.dev/repl';
	const learnMore = 'https://svelte.dev/docs';
	const additionalClass = 'custom-class'; // Optional additional class
</script>

<svelte:component
	this={Hst.Story}
	title="Molecules/RelatedCard"
	layout={{ type: 'grid', width: 600 }}
>
	<svelte:component this={Hst.Variant} title="Default Variant">
		<RelatedCard {additionalClass} href={liveDemo} on:click={() => console.log('Card clicked!')}>
			<div slot="content">
				<h3>{title}</h3>
				<p>{details}</p>
			</div>
			<div slot="footer">
				<a href={version} target="_blank" class="version">Version</a>
				<a href={liveDemo} class="live-demo">Live Demo</a>
				<a href={learnMore} class="learn-btn">Learn More</a>
			</div>
		</RelatedCard>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Custom Class Variant">
		<RelatedCard additionalClass="my-custom-class" href={liveDemo}>
			<div slot="content">
				<h3>Custom Styled Card</h3>
				<p>This card has a custom style applied.</p>
			</div>
			<div slot="footer">
				<a href={version} target="_blank" class="version">Version</a>
				<a href={liveDemo} class="live-demo">Live Demo</a>
				<a href={learnMore} class="learn-btn">Learn More</a>
			</div>
		</RelatedCard>
	</svelte:component>
</svelte:component>
