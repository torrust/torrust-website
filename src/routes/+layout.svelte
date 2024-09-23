<script lang="ts">
	import '$lib/scss/global.scss';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
</script>

<Header />
<div>
	<slot />
</div>
<Footer />

<style lang="scss">
	div {
		background: rgba(26, 26, 26, 1);
	}
</style>
