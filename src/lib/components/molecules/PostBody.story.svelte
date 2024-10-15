<script lang="ts">
	import PostBody from './PostBody.svelte'; // Adjust the path as necessary
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import Histoire types for the story context

	export let Hst: HstType; // Histoire context

	// Example content for the PostBody
	const exampleContent = `
        <h1>Understanding Svelte Components</h1>
        <p>Svelte is a modern JavaScript framework that allows you to build web applications with ease.</p>
        <h2>Why Use Svelte?</h2>
        <ul>
            <li>Reactivity built into the language.</li>
            <li>Minimal boilerplate code.</li>
            <li>Highly performant with no virtual DOM.</li>
        </ul>
        <p>With Svelte, you can create interactive applications while keeping your codebase clean and manageable.</p>
        <h3>Conclusion</h3>
        <p>Embracing Svelte can significantly improve your development workflow.</p>
    `;
</script>

<svelte:component this={Hst.Story} title="Atoms/PostBody" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Default Post Body">
		<PostBody>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html exampleContent}
		</PostBody>
	</svelte:component>
</svelte:component>
