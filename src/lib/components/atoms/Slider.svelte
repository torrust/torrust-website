<script lang="ts">
	interface TitleObj {
		title: string;
		link: string;
	}

	export let titleArr: TitleObj[] = [];
</script>

<div class="slider-container">
	{#each titleArr as item}
		{#if item.link}
			<a href={item.link} target="_blank" rel="noopener noreferrer">
				<div class={item.link ? 'has-link' : ''}>
					<p>{item.title}</p>
				</div>
			</a>
		{:else}
			<div class={item.link ? 'has-link' : ''}>
				<p>{item.title}</p>
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.slider-container {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		width: 100vw;
		margin: 3rem 0rem 0 0rem;
		padding-inline: 1.5rem;
		padding-bottom: 1rem;
		scroll-behavior: smooth;
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
			border: 2px solid transparent;
		}

		a {
			color: rgba(245, 245, 245, 0.96);
		}

		div.has-link:hover {
			border: 2px solid rgba(245, 245, 245, 0.92);
			cursor: pointer;
		}

		p {
			margin-top: auto;
			font-weight: 500;
			font-size: 20px;
		}
	}
</style>
