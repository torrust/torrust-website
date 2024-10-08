<script lang="ts">
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import the Histoire types
	import Table from './Table.svelte'; // Import the Table component

	export let Hst: HstType; // This will be provided by Histoire

	// Sample table headings
	const tableHeading = [
		{ fieldName: 'name', displayName: 'Project Name' },
		{ fieldName: 'repo', displayName: 'Repository' },
		{ fieldName: 'site', displayName: 'Website' },
		{ fieldName: 'demo', displayName: 'Demo' },
		{ fieldName: 'useCase', displayName: 'Use Case' }
	];

	// Sample table data
	const tableData = [
		{
			name: 'Project A',
			repo: 'https://github.com/example/project-a',
			site: 'https://example.com/a',
			demo: 'https://example.com/demo/a',
			useCase: 'Example use case description A'
		},
		{
			name: 'Project B',
			repo: 'https://github.com/example/project-b',
			site: '',
			demo: 'https://example.com/demo/b',
			useCase: 'Example use case description B'
		},
		{
			name: 'Project C',
			repo: 'https://github.com/example/project-c',
			site: 'https://example.com/c',
			demo: '',
			useCase: 'Example use case description C'
		}
	];
</script>

<svelte:component this={Hst.Story} title="Molecules/Table" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Default Table">
		<Table {tableHeading} {tableData} />
	</svelte:component>
</svelte:component>
