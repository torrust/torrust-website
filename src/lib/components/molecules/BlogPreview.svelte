<script lang="ts">
	import { formatDate } from '$lib/utils/date';

	let { post_data } = $props();

	const formattedDate = formatDate(post_data.date);
</script>

<div class="container">
	<div class="grid">
		<div class="image-container">
			<img src={post_data.coverImage} alt={post_data.title} />
		</div>
		<div class="text-container">
			<h2>{post_data.title}</h2>
			{#if post_data.contributor}
				<p>{post_data.contributor} - {formattedDate}</p>
			{:else}
				<p>{formattedDate}</p>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		height: 312px;
		margin: 0 auto;
		overflow: hidden;
		color: rgba(245, 245, 245, 0.96);
		text-decoration: none;
		cursor: pointer;
		padding: 0;
	}

	.grid {
		position: relative;
		height: 300px;
	}

	.image-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 10px;
		margin: 0;
		padding: 0;
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.text-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		text-align: left;
		color: white;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 10px;
		padding: 1rem;
		transition: background 0.3s ease;
	}

	.text-container:hover {
		color: rgba(254, 13, 0, 1);
	}

	.text-container h2 {
		margin: 0;
		font-size: 1.5rem;
		word-break: keep-all;
	}

	.text-container p {
		margin: 0.5rem 0 0;
		font-size: 0.875rem;
		color: #f5f5f5;
	}
</style>
