<script lang="ts">
	import Accordion from './Accordion.svelte'; // Adjust the path according to your file structure
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Use `import type` for type imports

	export let Hst: HstType; // Provided by Histoire
</script>

<svelte:component this={Hst.Story} title="Atoms/Accordion" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Basic Accordion">
		<Accordion>
			<ul>
				<li>Item 1</li>
				<li>Item 2</li>
				<li>Item 3</li>
			</ul>
		</Accordion>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Accordion with Custom Content">
		<Accordion>
			<ul>
				<li>Custom Content 1</li>
				<li>Custom Content 2</li>
				<li>Custom Content 3</li>
			</ul>
		</Accordion>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Accordion with Nested Accordion">
		<Accordion>
			<ul>
				<li>Parent Item 1</li>
				<li>
					Parent Item 2
					<Accordion>
						<ul>
							<li>Nested Item 1</li>
							<li>Nested Item 2</li>
						</ul>
					</Accordion>
				</li>
				<li>Parent Item 3</li>
			</ul>
		</Accordion>
	</svelte:component>
</svelte:component>
