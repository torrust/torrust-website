<script lang="ts">
	import PostContainer from './PostContainer.svelte'; // Adjust the import path as necessary
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import Histoire types

	export let Hst: HstType; // Histoire context

	// Example content for the PostContainer
	const examplePosts = [
		{ title: 'First Post', content: 'This is the content of the first post.' },
		{ title: 'Second Post', content: 'This is the content of the second post.' },
		{ title: 'Third Post', content: 'This is the content of the third post.' },
		{ title: 'Fourth Post', content: 'This is the content of the fourth post.' },
		{ title: 'Fifth Post', content: 'This is the content of the fifth post.' },
		{ title: 'Sixth Post', content: 'This is the content of the sixth post.' }
	];
</script>

<svelte:component
	this={Hst.Story}
	title="Atoms/PostContainer"
	layout={{ type: 'grid', width: 600 }}
>
	<svelte:component this={Hst.Variant} title="Default Post Container">
		<PostContainer>
			{#each examplePosts as post}
				<div class="post">
					<h3>{post.title}</h3>
					<p>{post.content}</p>
				</div>
			{/each}
		</PostContainer>
	</svelte:component>
</svelte:component>
