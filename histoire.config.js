import { defaultColors, defineConfig } from 'histoire';
import { HstSvelte } from '@histoire/plugin-svelte';

export default defineConfig({
	plugins: [HstSvelte()],
	theme: {
		title: 'Histoire',
		logo: {
			square: './static/favicons/favicon.ico',
			light: './static/favicons/favicon.ico',
			dark: './static/favicons/favicon.ico'
		},
		favicon: './static/favicons/favicon.ico',
		colors: {
			primary: defaultColors.purple
		}
	}
});
