<script lang="ts">
	import TagCard from './TagCard.svelte'; // Import the TagCard component
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import Histoire types

	export let Hst: HstType; // Provided by Histoire

	const internalCard = {
		title: 'Internal Card',
		content: 'This card links to another part of the site.',
		footer: 'More info',
		href: '/internal',
		image: 'https://via.placeholder.com/300', // Example image URL
		color: 'primary' // Define a color if needed
	};

	const externalCard = {
		title: 'External Card',
		content: 'This card links to an external website.',
		footer: 'Visit Now',
		href: 'https://www.example.com',
		image: 'https://via.placeholder.com/300', // Example image URL
		color: 'secondary' // Define a color if needed
	};
</script>

<svelte:component this={Hst.Story} title="Atoms/TagCard" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Internal Tag Card">
		<TagCard href={internalCard.href} additionalClass={internalCard.color}>
			<img
				slot="image"
				src={internalCard.image}
				alt="Illustration related to internal navigation"
			/>
			<div slot="content">
				<h3>{internalCard.title}</h3>
				<p>{internalCard.content}</p>
			</div>
			<div slot="footer">{internalCard.footer}</div>
		</TagCard>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="External Tag Card">
		<TagCard href={externalCard.href} additionalClass={externalCard.color}>
			<img slot="image" src={externalCard.image} alt="Graphic representing external link" />
			<div slot="content">
				<h3>{externalCard.title}</h3>
				<p>{externalCard.content}</p>
			</div>
			<div slot="footer">{externalCard.footer}</div>
		</TagCard>
	</svelte:component>
</svelte:component>
