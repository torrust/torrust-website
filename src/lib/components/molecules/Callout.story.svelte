<script lang="ts">
	import Callout from './Callout.svelte'; // Adjust the path according to your file structure
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Use `import type` for type imports

	export let Hst: HstType; // Provided by Histoire
</script>

<svelte:component this={Hst.Story} title="Atoms/Callout" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Info Callout">
		<Callout type="info">
			<p>
				This is an informational message. It provides additional details without indicating a
				problem.
			</p>
		</Callout>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Warning Callout">
		<Callout type="warning">
			<p>
				This is a warning message. It indicates a potential issue that the user should be aware of.
			</p>
		</Callout>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Error Callout">
		<Callout type="error">
			<p>
				This is an error message. It signifies that something has gone wrong that requires
				attention.
			</p>
		</Callout>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Success Callout">
		<Callout type="success">
			<p>This is a success message. It confirms that an action has been completed successfully.</p>
		</Callout>
	</svelte:component>
</svelte:component>
