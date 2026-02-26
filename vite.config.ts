import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import type { UserConfig } from 'vite';
import ViteImagemin from 'vite-plugin-imagemin';

/** @type {import('vite').UserConfig} */
const config: UserConfig = {
	plugins: [
		tailwindcss(),
		sveltekit(),
		ViteImagemin({
			gifsicle: { optimizationLevel: 3 },
			optipng: { optimizationLevel: 5 },
			pngquant: { quality: [0.6, 0.8] },
			webp: { quality: 75 }
		})
	],
	resolve: {
		alias: {
			$routes: path.resolve('./src/routes')
		}
	}
};

export default config;
