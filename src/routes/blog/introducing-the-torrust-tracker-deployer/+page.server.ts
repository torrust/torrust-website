import { metadata } from './metadata';
import { getMetadata } from '$lib/data/metadata';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();
	const allPosts = await getMetadata();

	return {
		...parentData,
		currentPost: metadata,
		allPosts
	};
};
