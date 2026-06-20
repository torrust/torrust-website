import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

const BLOG_DIR = 'src/routes/blog';
const OUTPUT_FILE = 'static/blogMetadata.json';

type BlogMetadata = {
	title: string;
	date: string;
	coverImage: string;
	excerpt: string;
	slug: string;
	contributor: string;
	contributorSlug: string;
	tags: string[];
};

async function generateMetadata() {
	const files = await glob(`${BLOG_DIR}/**/metadata.ts`);
	const metadataArray: (BlogMetadata & { slug: string })[] = [];

	for (const file of files) {
		const slug = path.basename(path.dirname(file));

		const module = await import(path.resolve(file));
		const metadata: BlogMetadata = module.metadata;

		metadataArray.push({ ...metadata, slug });
	}

	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metadataArray.sort(comparator), null, 2));
	console.log(`✅ Metadata generated: ${OUTPUT_FILE}`);
}

function comparator(a: BlogMetadata, b: BlogMetadata) {
	// Sort by date descending (newest first), then by slug ascending for ties
	const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
	if (dateDiff !== 0) return dateDiff;
	return a.slug.localeCompare(b.slug);
}

generateMetadata();
