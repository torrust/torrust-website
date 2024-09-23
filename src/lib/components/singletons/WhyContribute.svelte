<script lang="ts">
	import CardContainer from '$lib/components/molecules/CardContainer.svelte';

	import { contribute } from '$lib/constants/constants';
</script>

<div class="container">
	<div class="contribute-container">
		<h2>Why Contribute to Our Project?</h2>
		<p>
			Our project is designed to push the boundaries of decentralized 
			technology, providing a robust, open-source BitTorrent tracker and 
			index. By contributing, you’re helping build tools that empower 
			communities, enable file-sharing freedom, and promote digital 
			collaboration. Your input helps shape the future of the platform, 
			ensuring it remains free, transparent, and accessible to all. 
			Together, we can create a platform that upholds the values of 
			privacy, security, and decentralized infrastructure.
		</p>
	</div>
	<div class="card-container">
		<CardContainer titleArr={contribute} />
	</div>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.container {
		display: flex;
		flex-direction: column;
		text-align: center;
		color: rgba(245, 245, 245, 0.8);
		background: rgba(26, 26, 26, 1);
		padding-top: 4rem;
		padding-inline: 1.5rem;

		p {
			margin-top: 1.5rem;
		}

		.card-container {
			margin-top: 3rem;
		}
	}

	@include for-tablet-portrait-up {
		.contribute-container {
			width: 640px;
			margin: 0 auto;
		}
	}
</style>
