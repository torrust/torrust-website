<script lang="ts">
	import '$lib/scss/global.scss';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	import Banner from './Banner.svelte';
	import type { NoUndefinedField } from '$lib/utils/types';

	export let Hst: HstType;

	let props: NoUndefinedField<{
		title?: string;
	}> = {
		title: 'Welcome to Our Service'
	};
</script>

<svelte:component this={Hst.Story} title="Atoms/Banner" layout={{ type: 'grid', width: 400 }}>
	<svelte:fragment slot="controls">
		<svelte:component this={Hst.Text} bind:value={props.title} title="Banner Title" />
	</svelte:fragment>

	<div style="padding: 12px;">
		<svelte:component this={Hst.Variant} title="Default Banner">
			<Banner {...props} />
		</svelte:component>
	</div>
</svelte:component>
