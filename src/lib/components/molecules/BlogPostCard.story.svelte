<script lang="ts">
	import '$lib/scss/global.scss';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	import BlogPostCard from './BlogPostCard.svelte';

	export let Hst: HstType;
</script>

<Hst.Story title="Molecules/Blog Post Card" layout={{ type: 'grid', width: 400 }}>
	<div style="padding: 12px;">
		<Hst.Variant title="Default">
			<BlogPostCard
				slug="blog-post"
				title="Blog Post"
				coverImage="https://placedog.net/500"
				excerpt="This is a blog post"
				tags={['Tag 1', 'Tag 2']}
				readingTime="5 min read"
				date=""
			/>
		</Hst.Variant>

		<Hst.Variant title="No Image">
			<BlogPostCard
				slug="blog-post"
				title="Blog Post"
				excerpt="This is a blog post"
				tags={['Tag 1', 'Tag 2']}
				readingTime="5 min read"
				date=""
			/>
		</Hst.Variant>
	</div>
</Hst.Story>
