<script lang="ts">
	import GitRepo from '$lib/components/atoms/GitRepo.svelte';

	export let tableHeading;
	export let tableData;
</script>

<div class="table-container">
	<table>
		<tr>
			{#each tableHeading as heading}
				<th>{heading.displayName}</th> <!-- Use the display name -->
			{/each}
		</tr>
		{#each tableData as row}
			<tr>
				{#each tableHeading as heading}
					{#if ['site', 'demo', 'useCase'].includes(heading.fieldName)}
						<td
							>{#if row[heading.fieldName] !== ''}
								<a href={row[heading.fieldName]}>visit</a>
							{/if}
						</td>
					{:else if heading.fieldName === 'repo'}
						<td>
							{#if row[heading.fieldName] !== ''}
								<a href={row[heading.fieldName]}><GitRepo /></a>
							{/if}
						</td>
					{:else}
						<td>{row[heading.fieldName]}</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</table>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.table-container {
		overflow-x: auto; // Allows horizontal scrolling
		margin-top: 3rem;
		padding-inline: 1.5rem;
	}

	table {
		border-collapse: collapse;
		width: 100%;
	}

	th,
	td {
		border-bottom: 1px solid black;
		padding: 8px;
		text-align: left;
		white-space: normal; // Change from nowrap to normal for better wrapping
		overflow: hidden; // Hide overflowing content
		text-overflow: ellipsis; // Add ellipsis for overflowing text
	}

	// Media queries for responsiveness
	@include for-phone-only {
		th,
		td {
			padding: 4px; // Reduce padding for smaller screens
			font-size: 12px; // Reduce font size for smaller screens
		}
	}

	@include for-tablet-portrait-up {
		th,
		td {
			padding: 8px; // Normal padding for tablets and up
			font-size: 14px; // Normal font size for tablets and up
		}
	}
</style>
