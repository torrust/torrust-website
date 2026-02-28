<script lang="ts">
	let { data } = $props();
	let currentPost = $derived(data.currentPost);
	let allPosts = $derived(data.allPosts);
	import BlogPreview from '$lib/components/molecules/BlogPreview.svelte';
	import Post from '$lib/components/organisms/Post.svelte';
	import Image from '$lib/components/atoms/Image.svelte';
	import Callout from '$lib/components/molecules/Callout.svelte';
	import CodeBlock from '$lib/components/molecules/CodeBlock.svelte';
	import Toc from '$lib/components/atoms/Toc.svelte';
	import PrevNextPost from '$lib/components/singletons/PrevNextPost.svelte';
	import PagesWrapper from '$lib/components/atoms/PagesWrapper.svelte';
</script>

<Post
	title={currentPost.title}
	slug={currentPost.slug}
	coverImage={currentPost.coverImage}
	date={currentPost.date}
	tags={currentPost.tags}
	excerpt={currentPost.excerpt}
	contributor={currentPost.contributor}
	contributorSlug={currentPost.contributorSlug}
>
	<PagesWrapper>
		<div class="wrapper">
			<Toc class="toc" />
			<div id="toc-contents" class="content-preview">
				<p>
					All blog posts are located inside the <code>src/routes/(blog-article)</code> folder. Each
					folder inside it represents a blog post, and each folder has a <code>+page.md</code> file, which
					is the file that contains the post's content.
				</p>

				<p>
					This way, the URL for each blog post is generated with the folder's name. For example, the
					folder <code>src/routes/(blog-article)/how-blog-posts-work</code> will generate the URL
					<code>https://mysite.com/how-blog-posts-work</code>.
				</p>

				<p>
					All posts are Markdown files, which means you can use the <a
						href="https://www.markdownguide.org/basic-syntax">Markdown syntax</a
					>
					in them, and it will work out of the box. However, since this project uses
					<a href="https://mdsvex.pngwn.io/">MDsveX</a> to parse Markdown, you can also use Svelte components
					inside them! This means that the components used in other pages can also be used in blog posts.
				</p>

				<Callout type="info">This is a Svelte component inside a Markdown file!</Callout>

				<h2>Processing</h2>

				<p>
					Besides the blog post page itself, the blog posts can be displayed in other places, such
					as the <code>/blog</code> page, which lists all blog posts, and the
					<code>&lt;RecentPosts&gt;</code> component, used in the home page.
				</p>

				<p>
					To be able to do that, posts are processed in the <code
						>src/lib/data/blog-posts/index.ts</code
					>
					file. That file imports the blog post files and processes them, so we're able to use some of
					the post's metadata to list them. For example, we get the post's title, cover image, and calculate
					the reading time based on its content, so that information is displayed in the blog post cards
					in the <code>/blog</code> page.
				</p>

				<p>
					There is also some basic logic to get related posts based on a post's tags. The logic
					should be straightforward enough to modify it to your needs.
				</p>

				<h2>Creating a new post</h2>

				<p>
					To create a new post, create a new folder inside the <code>src/routes/(blog-article)</code
					>
					folder, and inside it, create a <code>+page.md</code> file. The folder name will be used as
					the post's URL slug, so make sure it's a valid URL slug.
				</p>

				<p>
					Inside the <code>+page.md</code> file, you must start with the front matter, which is a
					YAML-like syntax that is used to define metadata for the post. The front matter must be
					the first thing in the file, and must be separated from the rest of the content by three
					dashes (<code>---</code>). An example of a front matter is:
				</p>

				<CodeBlock
					lang="markdown"
					code={`---
slug: my-new-blog-post
title: My New Blog Post
date: 2023-04-22T20:45:25.350Z
excerpt: A short description of the post
coverImage: /images/posts/cover-image.jpg
tags:
    - Example
---`}
				/>

				<h2>Managing blog posts</h2>

				<p>
					I highly recommend the <a href="https://frontmatter.codes/"
						>Front Matter VS Code extension</a
					> to manage blog posts. It gives you a nice CMS-like UI to manage the front matter of all blog
					posts, as well as a preview of their content. It is, of course, optional, and you can manage
					everything directly in the Markdown files if you prefer.
				</p>

				<Image
					src="/images/posts/frontmatter-preview-dashboard.png"
					alt="Screenshot of the Front Matter VS Code extension, showing the dashboard with all posts"
				/>

				<Image
					src="/images/posts/frontmatter-preview-edit.png"
					alt="Screenshot of the Front Matter VS Code extension, showing the post editing UI"
				/>

				<h2>RSS</h2>

				<p>
					This template automatically generates a RSS feed of your blog posts. It is generated in
					the <code>src/routes/rss.xml/+server.ts</code>
					file, and it is available at the <code>/rss.xml</code> URL.
				</p>
			</div>
		</div>
	</PagesWrapper>
	<PrevNextPost currentPage={currentPost.slug} {allPosts} />
	<div class="related-posts-container">
		<h2>Related Posts:</h2>
		<div class="grid">
			{#each data.allPosts.slice(0, 3) as post}
				<a href="/blog/{post.slug}">
					<BlogPreview post_data={post} />
				</a>
			{/each}
		</div>
	</div>
</Post>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss' as bp;

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		position: relative;
		max-width: 1150px;
	}

	.content-preview {
		flex: 1;
		word-break: keep-all;
		padding-top: 2rem;
	}

	h2 {
		font-size: 1.8rem;
		font-weight: bold;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem;
	}

	p {
		font-size: 1rem;
		padding-top: 1rem;
		color: rgba(245, 245, 245, 0.8);
		word-break: keep-all;
	}

	a {
		word-break: keep-all;
		color: var(--color-link);
	}

	.content-preview > p,
	.content-preview > h2 {
		margin-bottom: 1rem;
	}

	h2:not(:first-of-type) {
		padding-top: 1.5rem;
	}

	.related-posts-container {
		display: flex;
		flex-direction: column;
		color: rgba(245, 245, 245, 0.96);
		margin: 0 auto;
		text-align: center;
		padding-top: 2rem;

		@include bp.for-desktop-up {
			max-width: 1176px;
		}
	}

	.grid {
		padding-top: 3rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 24px;
		max-width: 1200px;
		margin: 0 auto;
		padding-inline: 2.5rem;

		@include bp.for-phone-only {
			grid-template-columns: 1fr;
		}

		@include bp.for-tablet-landscape-up {
			grid-template-columns: 1fr 1fr;
		}

		@include bp.for-desktop-up {
			grid-template-columns: 1fr 1fr 1fr;
			padding-inline: 0;
		}
	}

	@include bp.for-desktop-up {
		.wrapper {
			flex-direction: row;
			gap: 4rem;
		}

		.wrapper :global(.toc) {
			position: sticky;
			top: 4rem;
			height: min-content;
		}

		.content-preview {
			overflow-y: auto;
			padding-top: 0rem;
		}
	}
</style>
