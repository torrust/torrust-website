<script lang="ts">
	import ContributorCard from './ContributorCard.svelte'; // Adjust the path as necessary
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import types for Histoire

	export let Hst: HstType; // Histoire context

	// Sample data for the contributor
	const contributors = [
		{
			name: 'John Doe',
			position: 'Frontend Developer',
			img: 'https://via.placeholder.com/150',
			contributeDate: 'January 2022',
			paras: [{ para: 'John is a passionate developer who loves building web applications.' }],
			links: [
				{
					email: 'mailto:johndoe@example.com',
					github: 'https://github.com/johndoe',
					linkedIn: 'https://linkedin.com/in/johndoe'
				}
			]
		},
		{
			name: 'Jane Smith',
			position: 'Backend Developer',
			img: 'https://via.placeholder.com/150',
			contributeDate: 'March 2023',
			paras: [{ para: 'Jane specializes in building RESTful APIs and cloud services.' }],
			links: [
				{
					email: 'mailto:janesmith@example.com',
					github: 'https://github.com/janesmith',
					linkedIn: 'https://linkedin.com/in/janesmith'
				}
			]
		},
		{
			name: 'Alice Johnson',
			position: 'UI/UX Designer',
			img: '',
			contributeDate: 'February 2021',
			paras: [{ para: 'Alice has a keen eye for design and user experience.' }],
			links: [
				{
					email: 'mailto:alicejohnson@example.com',
					github: '',
					linkedIn: 'https://linkedin.com/in/alicejohnson'
				}
			]
		}
	];
</script>

<svelte:component
	this={Hst.Story}
	title="Atoms/ContributorCard"
	layout={{ type: 'grid', width: 600 }}
>
	{#each contributors as contributor}
		<svelte:component this={Hst.Variant} title={contributor.name}>
			<ContributorCard
				name={contributor.name}
				position={contributor.position}
				img={contributor.img}
				contributeDate={contributor.contributeDate}
				paras={contributor.paras}
				links={contributor.links}
			/>
		</svelte:component>
	{/each}
</svelte:component>
