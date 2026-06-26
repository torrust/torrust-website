<script lang="ts">
	import '$lib/scss/global.scss';
	import '../app.css';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import { onNavigate } from '$app/navigation';

	let contentDiv: HTMLElement | null = null;

	const supportsViewTransition = typeof window !== 'undefined' && 'startViewTransition' in document;

	onNavigate((navigation) => {
		return new Promise((resolve) => {
			if (supportsViewTransition) {
				const transition = document.startViewTransition(async () => {
					if (contentDiv) {
						contentDiv.scrollTop = 0;
					}
					resolve();
					await navigation.complete;
				});
			} else {
				if (contentDiv) {
					contentDiv.scrollTop = 0;
				}
				resolve();
			}
		});
	});

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div id="app-container">
	<div class="demo-shutdown-banner">
		<p>
			All public demo services are currently shut down.
			<a
				href="https://github.com/torrust/torrust-website/issues/228"
				target="_blank"
				rel="noopener noreferrer">Learn more</a
			>.
		</p>
	</div>
	<Header />
	<div bind:this={contentDiv} class="content">
		{@render children?.()}
		<Footer />
	</div>
</div>

<style lang="scss">
	.demo-shutdown-banner {
		background-color: rgba(25, 25, 25, 0.98);
		color: rgba(245, 245, 245, 0.96);
		text-align: center;
		padding: 0.6rem 1.5rem;
		font-size: 0.9rem;
		font-weight: 500;
		line-height: 1.4;
		border-bottom: 2px solid rgba(254, 13, 0, 1);
		position: relative;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 4px;
			background-color: rgba(254, 13, 0, 1);
		}

		a {
			color: rgba(254, 13, 0, 1);
			text-decoration: underline;
			font-weight: 600;

			&:hover {
				color: rgba(254, 13, 0, 0.7);
			}
		}
	}

	.content {
		background: rgba(25, 25, 25, 1);
		overflow-y: scroll;
	}

	#app-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	#app-container .content {
		flex: 1 1 auto;
		min-height: 0;
	}
</style>
