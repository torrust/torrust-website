import { filteredPosts } from '$lib/data/blog-posts';

export async function load({ url }: { url: { pathname: string } }) {
	const { pathname } = url;
	const slug = pathname.replace('/blog-post/', '');
	const post = filteredPosts.find((post) => post.slug === slug);

	return {
		post,
		allPosts: filteredPosts
	};
}
