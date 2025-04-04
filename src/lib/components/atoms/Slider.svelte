<script lang="ts">
	import Icon from '@iconify/svelte';

	interface TitleObj {
		title: string;
		link: string;
	}

	interface Props {
		titleArr?: TitleObj[];
	}

	let { titleArr = [] }: Props = $props();
	let sliderContainer: HTMLElement;
	let prevButton: HTMLElement;
	let nextButton: HTMLElement;

	function handlePrevClick() {
		if (sliderContainer) {
			sliderContainer.scrollLeft -= sliderContainer.offsetWidth;
		}
	}

	function handleNextClick() {
		if (sliderContainer) {
			sliderContainer.scrollLeft += sliderContainer.offsetWidth;
		}
	}
</script>

<section class="slider">
	<div class="button-group">
		<button
			class="pre-btn"
			aria-label="Previous slide"
			bind:this={prevButton}
			onclick={handlePrevClick}
		>
			<Icon icon="fa6-solid:angle-left" />
		</button>

		<button
			class="nxt-btn"
			aria-label="Next slide"
			bind:this={nextButton}
			onclick={handleNextClick}
		>
			<Icon icon="fa6-solid:angle-right" />
		</button>
	</div>

	<div class="slider-container" bind:this={sliderContainer}>
		{#each titleArr as item (item)}
			{#if item.link}
				<a href={item.link} target="_blank" rel="noopener noreferrer">
					<div class="slider-item has-link">
						<p>{item.title}</p>
					</div>
				</a>
			{:else}
				<div class="slider-item">
					<p>{item.title}</p>
				</div>
			{/if}
		{/each}
	</div>
</section>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	.slider {
		position: relative;
		overflow: hidden;
		padding-block: 20px;
	}

	.slider-container {
		padding: 0 10vw;
		display: flex;
		overflow-x: auto;
		scroll-behavior: smooth;
		gap: 1rem;
		width: 100vw;
		margin: 3rem 0rem 0 0rem;
		padding-inline: 0rem;
		padding-bottom: 1rem;
		box-sizing: border-box;
		position: relative;
		left: 0;

		padding-left: 2rem;
		transition:
			margin 0.3s ease-out,
			padding 0.3s ease-out;

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
			text-decoration: none;
			word-break: keep-all;
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

	.slider-container {
		// Firefox specific styling
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 49, 0, 0.8) transparent;

		@include bp.for-tablet-portrait-up {
			&::-webkit-scrollbar {
				display: none !important;
			}
			scrollbar-width: none !important;
		}

		&::-webkit-scrollbar {
			width: 2px !important;
			min-width: 2px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background: rgba(255, 49, 0, 0.8);
			border-radius: 10px;
			width: 2px;
			min-width: 2px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: rgba(255, 49, 0, 0.8);
		}
	}

	.button-group {
		display: none;
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
		pointer-events: none;

		@include bp.for-tablet-portrait-up {
			display: flex;
			justify-content: center;
			gap: 1rem;
		}

		.slider:hover & {
			opacity: 1;
			pointer-events: auto;
		}
	}

	.pre-btn,
	.nxt-btn {
		border: none;
		width: 10vw;
		height: 100%;
		position: absolute;
		top: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 0% 100%);
		cursor: pointer;
		z-index: 8;
		font-size: 2em;
	}

	.pre-btn {
		left: 0;
	}

	.nxt-btn {
		right: 0;
	}
</style>
