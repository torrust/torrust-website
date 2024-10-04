<script>
	import { page } from '$app/stores';

	import Button from '$lib/components/atoms/Button.svelte';
	import Error from '$lib/icons/error.svelte';
</script>

<main>
	<div class="error-page">
		<div class="container">
			<h1>Oh no! {$page?.status ?? 'An error'}!</h1>
			<div class="svg-wrapper">
				<Error />
			</div>
			<p>It seems like coffee was spilled all over this page, and now it can't be displayed.</p>
			<br />
			<Button href="/">Start over</Button>
		</div>
	</div>
</main>

<style lang="scss">
	.error-page {
		position: relative;
		background: rgba(245, 245, 245, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 80vh;
		text-align: center;
		max-width: 500px;
		padding-inline: 1.5rem;

		.svg-wrapper {
			width: 300px;
			margin-top: -60px;
			margin-bottom: -30px;

			:global(svg) {
				filter: drop-shadow(2px 6px 0px rgba(0, 0, 0, 0.1));
			}
		}
	}
</style>
