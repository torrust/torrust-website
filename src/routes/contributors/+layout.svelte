<script lang="ts">
	import Footer from '$lib/components/organisms/Footer.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
</script>

<Header />
<div class="contributors">
	<h1>Contributors</h1>
	<slot />
</div>
<Footer />

<style lang="scss">
	.contributors {
		background: rgba(26, 26, 26, 1);
	}

	h1 {
		padding-block: 1rem;
		text-align: center;
		color: rgba(245, 245, 245, 0.96);
	}
</style>
