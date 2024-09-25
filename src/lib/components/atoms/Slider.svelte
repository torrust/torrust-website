<script lang="ts">
	export let titleArr: string[];
</script>

<div class="slider-container">
	{#each titleArr as title}
		<div>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p>{@html title}</p>
		</div>
	{/each}
</div>

<style lang="scss">
	.slider-container {
		display: flex;
		overflow-x: auto;
		width: 100vw;
		margin: 3rem 0 0 0;
		gap: 1rem;
		scroll-behavior: smooth;
		padding-bottom: 1rem;
		box-sizing: border-box;
		position: relative;
		left: 0;

		div {
			flex: 0 0 auto;
			width: 280px;
			height: 280px;
			display: flex;
			flex-direction: column;
			text-align: left;
			padding: 1.5rem;
			border-radius: 1.5rem;
			background-color: rgba(255, 49, 0, 0.8);
			box-sizing: border-box;
		}

		div:hover {
			cursor: pointer;
		}

		p {
			margin-top: auto;
			font-weight: 500;
			font-size: 20px;
		}
	}
</style>
