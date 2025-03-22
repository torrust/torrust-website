import fs from 'fs';
import path from 'path';
import type { BlogMetadata } from '$lib/utils/types';

export const load = async () => {
	const metadataPath = path.resolve('static/blogMetadata.json');

	if (!fs.existsSync(metadataPath)) {
		throw new Error("Metadata file not found. Run 'npm run generate-metadata'.");
	}

	const metadata: BlogMetadata[] = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

	const allPosts = metadata.sort(
		(a: BlogMetadata, b: BlogMetadata) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return { allPosts };
};
