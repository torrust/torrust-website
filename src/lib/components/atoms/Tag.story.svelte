<script lang="ts">
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import Histoire types
	import Tag from './Tag.svelte'; // Import the Tag component

	export let Hst: HstType; // Provided by Histoire

	// Define the internalTag with strict color types
	const internalTag = {
		tag: 'Internal Link',
		href: '/tags/internal',
		color: 'primary' as 'primary' | 'secondary' // Ensure type safety
	};

	const externalTag = {
		tag: 'External Link',
		href: 'https://www.example.com',
		color: 'secondary' as 'primary' | 'secondary' // Ensure type safety
	};
</script>

<svelte:component this={Hst.Story} title="Atoms/Tag" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Internal Tag">
		<Tag href={internalTag.href} tag={internalTag.tag} color={internalTag.color}>Internal Tag</Tag>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="External Tag">
		<Tag href={externalTag.href} tag={externalTag.tag} color={externalTag.color}>External Tag</Tag>
	</svelte:component>
</svelte:component>
