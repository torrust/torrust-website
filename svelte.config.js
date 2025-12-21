import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';

/** @type {import('mdsvex').MdsvexOptions}*/
const mdsvexOptions = {
	extensions: ['.md'],
	rehypePlugins: [
		rehypeExternalLinks,
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{
				behavior: 'prepend',
				properties: { className: ['heading-link'], title: 'Permalink', ariaHidden: 'true' },
				content: {
					type: 'element',
					tagName: 'span',
					properties: {},
					children: [{ type: 'text', value: '#' }]
				}
			}
		],
		[
			rehypePrettyCode,
			{
				theme: 'github-dark',
				onVisitLine(node) {
					if (node.children.length === 0) {
						node.children = [{ type: 'text', value: '↹↹↹' }];
					}
				}
			}
		]
	]
};
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: sequence([vitePreprocess(), mdsvex(mdsvexOptions), preprocessMeltUI()]),
	onwarn: (warning, handler) => {
		// Suppress intentional Toc.svelte warning about selector being captured at initialization
		// This is required for @melt-ui/svelte's createTableOfContents to work correctly
		if (warning.code === 'state_referenced_locally' && warning.filename?.includes('Toc.svelte')) {
			return;
		}
		handler(warning);
	},
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// The base path for your GitHub Pages deployment (for example, if it's in a subpath like https://github.com/username/repo-name/)
			paths: {
				base: process.env.NODE_ENV === 'production' ? '/torrust-website' : ''
			}
		})
	},
	extensions: ['.svelte', '.svx', '.md']
};
export default config;
