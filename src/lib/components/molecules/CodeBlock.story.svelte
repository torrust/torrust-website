<script lang="ts">
	import CodeBlock from './CodeBlock.svelte'; // Adjust the import path as necessary
	import type { Hst as HstType } from '@histoire/plugin-svelte'; // Import types for Histoire

	export let Hst: HstType; // Histoire context
</script>

<svelte:component this={Hst.Story} title="Atoms/CodeBlock" layout={{ type: 'grid', width: 600 }}>
	<svelte:component this={Hst.Variant} title="Default Code Block">
		<CodeBlock lang="javascript" filename="example.js">
			{`
				// Sample JavaScript code
				function helloWorld() {
					console.log("Hello, World!");
				}
			`}
		</CodeBlock>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Python Code Block">
		<CodeBlock lang="python" filename="example.py">
			{`
				# Sample Python code
				def hello_world():
					print("Hello, World!")
			`}
		</CodeBlock>
	</svelte:component>

	<svelte:component this={Hst.Variant} title="Full Bleed Code Block">
		<CodeBlock lang="html" filename="index.html" fullBleed={true}>
			{`
				<!-- Sample HTML code -->
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>Hello World</title>
				</head>
				<body>
					<h1>Hello, World!</h1>
				</body>
				</html>
			`}
		</CodeBlock>
	</svelte:component>
</svelte:component>
