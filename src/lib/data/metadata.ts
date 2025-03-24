import fs from 'fs';
import path from 'path';
import type { BlogMetadata } from '$lib/utils/types';

let cachedMetadata: BlogMetadata[] = [];

export function getMetadata(): BlogMetadata[] {
	if (cachedMetadata.length === 0) {
		const metadataPath = path.resolve('static/blogMetadata.json');

		if (!fs.existsSync(metadataPath)) {
			throw new Error("Metadata file not found. Run 'tsx scripts/generateMetadata.ts'.");
		}

		cachedMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
	}

	return cachedMetadata;
}
