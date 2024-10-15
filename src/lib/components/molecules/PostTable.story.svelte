<script lang="ts">
	import PostTable from './PostTable.svelte'; // Adjust the import path as necessary
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import Histoire types

	export let Hst: HstType; // Histoire context

	// Example table headers and data
	const headers = ['Title', 'Author', 'Date', 'Status'];
	const examplePosts = [
		{ title: 'Post One', author: 'Alice', date: '2024-10-01', status: 'Published' },
		{ title: 'Post Two', author: 'Bob', date: '2024-10-02', status: 'Draft' },
		{ title: 'Post Three', author: 'Charlie', date: '2024-10-03', status: 'Published' },
		{ title: 'Post Four', author: 'Diana', date: '2024-10-04', status: 'Pending' }
	];
</script>

<svelte:component this={Hst.Story} title="Atoms/PostTable" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Default Post Table">
		<PostTable>
			<table>
				<thead>
					<tr>
						{#each headers as header}
							<th>{header}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each examplePosts as post}
						<tr>
							<td>{post.title}</td>
							<td>{post.author}</td>
							<td>{post.date}</td>
							<td>{post.status}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</PostTable>
	</svelte:component>
</svelte:component>
