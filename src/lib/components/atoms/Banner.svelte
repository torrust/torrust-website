<script lang="ts">
	import Torrust from '$lib/icons/torrust.svelte';

	export let title: string;
</script>

<div class="svg-container">
	<div class="svg-content">
		<Torrust />
		<h1>{title}</h1>
	</div>
</div>

<style lang="scss">
	.svg-container {
		height: 480px;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width='900' height='10' viewBox='0 0 768 480' fill='rgb(254, 74, 30)'><path d='M1005.2 123.646C1027.43 11.7464 953.881 -97.3506 843.527 -126.92L138.041 -315.954C40.5775 -342.07 -63.6767 -288.152 -91.5498 -191.16C-119.946 -92.2144 -61.7805 10.2473 37.2454 36.7812L306.002 108.794L55.7571 263.014C-106.71 363.089 -70.6249 608.894 113.559 658.246C170.006 673.371 230.427 665.068 280.715 635.209L900.796 267.959C954.822 237.428 993.036 184.656 1005.25 123.451L1005.2 123.646Z' fill='rgb(245, 245, 245)' fill-opacity='.12'/></svg>");
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		background-color: rgb(255, 50, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(245, 245, 245, 0.96);
	}

	.svg-content {
		display: flex;
		text-align: center;
	}
</style>
