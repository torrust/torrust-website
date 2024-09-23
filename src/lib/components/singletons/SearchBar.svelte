<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { BlogPost } from '$lib/utils/types';
	import { onMount, afterUpdate } from 'svelte';
	import { createPostsIndex, searchPostsIndex } from '$lib/utils/search';
	import Icon from '@iconify/svelte';

	export let searchTerm = '';
	export let posts: BlogPost[] = [];

	const dispatch = createEventDispatcher();
	let showInput = true;
	let searchInput: HTMLInputElement;

	interface SearchResult {
		slug: string;
		title: string;
		content: string[];
		tags: string[];
	}

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		searchTerm = input.value;
		dispatch('search', searchTerm);
	}

	let search: 'loading' | 'ready' = 'loading';
	let results: SearchResult[] = [];

	onMount(async () => {
		createPostsIndex(posts);
		search = 'ready';
	});

	$: if (search === 'ready') {
		results = searchPostsIndex(searchTerm);
	}

	function clearSearch() {
		searchTerm = '';
		showInput = false;
	}

	afterUpdate(() => {
		if (showInput && searchInput) {
			searchInput.focus();
		}
	});
</script>

<div class="search-bar-container">
	{#if showInput}
		<div class="input-wrapper">
			<div>
				<input
					type="text"
					placeholder="Type to filter articles..."
					bind:this={searchInput}
					bind:value={searchTerm}
					on:input={handleInput}
				/>
			</div>
			<div>
				<Icon
					icon="heroicons:magnifying-glass-16-solid"
					width="28"
					height="28"
					style="color: rgba(245, 245, 245, 0.08);"
				/>
			</div>
		</div>
	{/if}

	{#if search === 'ready' && searchTerm}
		<div class="dropdown">
			{#if results.length > 0}
				<ul>
					{#each results as result}
						<li>
							<a href="/{result.slug}" on:click={clearSearch}>
								<div>
									<div>
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html result.title}
									</div>
									<div>
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										<p>{@html result.content}</p>
									</div>
								</div>
								<div class="tag-container">
									{#each result.tags as tag}
										{#if tag.toLowerCase().includes(searchTerm.toLowerCase())}
											<!-- eslint-disable-next-line svelte/no-at-html-tags -->
											<p class="tag" style="color: black;">{@html tag}</p>
										{/if}
									{/each}
								</div>
							</a>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="no-result">No results found for query "{searchTerm}"</p>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	@import '$lib/scss/_mixins.scss';
	.search-bar-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		background-color: transparent;
		border: 1px solid rgba(245, 245, 245, 0.08);
		border-radius: 1.5rem;
	}

	.input-wrapper {
		display: flex;
		justify-content: space-between;
		width: 360px;
		border-radius: 5px;
		padding: 0.5rem;
		border: none;
		color: white;
		background-color: transparent;
	}

	.input-wrapper input {
		border: none;
		outline: none;
		flex-grow: 1;
		font-size: 1rem;
		background-color: transparent;
		color: rgba(245, 245, 245, 0.96);
	}

	.input-wrapper > * {
		padding-inline: 1rem;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		max-height: 300px;
		overflow-y: auto;
		background-color: hsl(220, 10%, 14%);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		border-radius: 0 0 4px 4px;
		z-index: 10;
		border-radius: 4px;
	}

	.dropdown ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.dropdown li {
		padding: 0.5rem;
		border-bottom: 1px solid hsl(220, 10%, 20%);
	}

	.dropdown li:last-child {
		border-bottom: none;
	}

	.dropdown a {
		text-decoration: none;
		color: rgba(245, 245, 245, 0.96);
		display: block;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.dropdown a:hover {
		background-color: hsl(220, 10%, 20%);
	}

	.dropdown p {
		margin: 0;
		font-size: 0.875rem;
		color: #ffffff;
	}

	.tag-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		padding: 5px 15px;
		border-radius: 10px;
		font-weight: 500;
		font-size: 0.85rem;
		width: fit-content;
		background-color: var(--color--secondary-tint);
	}

	.no-result {
		color: #ffffff;
		padding: 0.5rem;
	}
</style>
