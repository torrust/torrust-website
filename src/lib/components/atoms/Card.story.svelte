<script lang="ts">
	import '$lib/scss/global.scss'; // Import global styles
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Histoire type
	import Card from './Card.svelte'; // Import the Card component
	import type { NoUndefinedField } from '$lib/utils/types'; // Type utility

	export let Hst: HstType; // Export Histoire instance

	// Define properties for the Card with default values
	let props: NoUndefinedField<{
		title: {
			icon: string; // HTML string for the icon
			title: string; // Title of the card
			para: string; // Paragraph text
		};
	}> = {
		title: {
			icon: '<svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>', // Example icon (a circle)
			title: 'Card Title',
			para: 'This is a description of the card content.'
		}
	};
</script>

<svelte:component this={Hst.Story} title="Atoms/Card" layout={{ type: 'grid', width: 400 }}>
	<svelte:fragment slot="controls">
		<svelte:component this={Hst.Text} bind:value={props.title.icon} title="Icon (HTML)" />
		<svelte:component this={Hst.Text} bind:value={props.title.title} title="Card Title" />
		<svelte:component this={Hst.Text} bind:value={props.title.para} title="Paragraph" />
	</svelte:fragment>

	<div style="padding: 12px;">
		<svelte:component this={Hst.Variant} title="Default Card">
			<Card title={props.title} />
		</svelte:component>
	</div>
</svelte:component>
