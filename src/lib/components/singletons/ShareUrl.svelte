<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let currentUrl: string = '';

	onMount(() => {
		currentUrl = $page.url.origin + $page.url.pathname;
	});

	function copyUrlToClipboard() {
		navigator.clipboard.writeText(currentUrl).catch((error) => {
			console.error('Error copying to clipboard:', error);
		});
	}
</script>

<div>
	<button on:click={copyUrlToClipboard}>Copy article link</button>
</div>

<style lang="scss">
	button {
		gap: 0.2rem;
		border-radius: 10px;
		text-align: left;
		border: none;
		background-color: rgba(36, 36, 36, 1);
		color: rgba(245, 245, 245, 0.8);
		white-space: nowrap;
		padding: 0;
		margin: 0.5rem 0;
		font-size: 16px;
	}

	button:hover {
		cursor: pointer;
		text-decoration: underline;
		color: rgba(255, 49, 0, 1);
	}
</style>
