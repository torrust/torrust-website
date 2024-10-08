<script lang="ts">
	import '$lib/scss/global.scss'; // Import global styles
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import Histoire type
	import Cards from './Cards.svelte'; // Import the Cards component

	export let Hst: HstType; // Export Histoire instance

	// Define the props for the card component
	let props = {
		additionalClass: '',
		href: '',
		content: 'This is a card content.'
	};
</script>

<svelte:component this={Hst.Story} title="Atoms/Cards" layout={{ type: 'grid', width: 400 }}>
	<svelte:fragment slot="controls">
		<svelte:component this={Hst.Text} bind:value={props.additionalClass} title="Additional Class" />
		<svelte:component this={Hst.Text} bind:value={props.href} title="Link (Href)" />
		<svelte:component this={Hst.Text} bind:value={props.content} title="Card Content" />
	</svelte:fragment>

	<div style="padding: 12px;">
		<svelte:component this={Hst.Variant} title="Default Card">
			<Cards {...props}>
				<div slot="content">{props.content}</div>
			</Cards>
		</svelte:component>
	</div>
</svelte:component>
