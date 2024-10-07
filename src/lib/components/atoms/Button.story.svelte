<script lang="ts">
	import '$lib/scss/global.scss'; // Global styles
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Histoire type
	import Button from './Button.svelte'; // Import the Button component
	import Icon from '$lib/icons/chat.svelte'; // Example icon for demonstration
	import type { NoUndefinedField } from '$lib/utils/types'; // Type utility

	export let Hst: HstType; // Export Histoire instance

	// Define properties for the Button with default values
	let props: NoUndefinedField<{
		color?: 'primary' | 'secondary';
		style?: 'solid' | 'understated' | 'clear';
		size?: 'small' | 'medium' | 'large';
		href?: string;
		additionalClass?: string;
		target?: '_self' | '_blank';
		rel?: string;
	}> = {
		color: 'primary',
		style: 'solid',
		size: 'medium',
		href: 'string',
		target: '_self',
		rel: 'string',
		additionalClass: ''
	};

	let text = 'Click Me'; // Default button text
</script>

<svelte:component this={Hst.Story} title="Atoms/Button" layout={{ type: 'grid', width: 400 }}>
	<svelte:fragment slot="controls">
		<svelte:component this={Hst.Text} bind:value={text} title="Button Text" />
		<svelte:component
			this={Hst.Select}
			bind:value={props.color}
			title="Color"
			options={['primary', 'secondary']}
		/>
		<svelte:component
			this={Hst.Select}
			bind:value={props.style}
			title="Style"
			options={['solid', 'understated', 'clear']}
		/>
		<svelte:component
			this={Hst.Select}
			bind:value={props.size}
			title="Size"
			options={['small', 'medium', 'large']}
		/>
		<svelte:component this={Hst.Text} bind:value={props.href} title="Href (optional)" />
		<svelte:component
			this={Hst.Select}
			bind:value={props.target}
			title="Target"
			options={['_self', '_blank']}
		/>
		<svelte:component this={Hst.Text} bind:value={props.rel} title="Rel (optional)" />
		<svelte:component this={Hst.Text} bind:value={props.additionalClass} title="Additional Class" />
	</svelte:fragment>

	<div style="padding: 12px;">
		<svelte:component this={Hst.Variant} title="Button Without Icon">
			<Button {...props}>
				{text}
			</Button>
		</svelte:component>
		<svelte:component this={Hst.Variant} title="Button With Icon">
			<Button {...props}>
				<Icon slot="icon" />
				{text}
			</Button>
		</svelte:component>
	</div>
</svelte:component>
