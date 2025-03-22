import { getMetadata } from '$lib/data/metadata';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const slug = url.pathname.split('/').filter(Boolean).pop();
	if (!slug) throw new Error('Slug could not be determined.');

	const metadata = await getMetadata();
	const currentPost = metadata.find((post) => post.slug === slug);

	if (!currentPost) throw new Error(`Post not found: ${slug}`);

	return { currentPost, allPosts: metadata };
};
