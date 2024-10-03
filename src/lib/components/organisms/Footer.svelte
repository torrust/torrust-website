<script lang="ts">
	import Nautilus from '$lib/icons/nautilus.svelte';
</script>

<footer>
	<div class="footer-wrapper">
		<div>
			<Nautilus />
		</div>
		<div>
			<p>CC-BY-SA 4.0</p>
			<p>Nautilus Cyberneering S.L.U. 2024</p>
		</div>
	</div>
</footer>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	footer {
		background-color: rgba(26, 26, 26, 1);
		color: rgba(245, 245, 245, 0.96);
		display: flex;
		justify-content: center;
		border-bottom: 16px solid rgba(255, 49, 0, 1);
		padding: 2rem 1.5rem;

		.footer-wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			padding: 1rem;
			text-align: center;

			@include for-tablet-portrait-up {
				flex-direction: row;
				align-items: center;
				gap: 24px;
				text-align: left;
				max-width: 2500px;
			}

			@include for-desktop-up {
				padding: 0rem;
			}

			div {
				font-size: 16px;
			}
		}

		footer div:nth-of-type(2) p:first-of-type {
			margin-top: 1.5rem;
		}

		@include for-tablet-portrait-up {
			footer div:nth-of-type(2) p:first-of-type {
				margin-top: 0rem;
			}
		}

		@include for-desktop-up {
			padding-inline: 9rem;
		}
	}
</style>
