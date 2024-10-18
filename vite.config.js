import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$routes: path.resolve('./src/routes') // Adjust this path based on your project structure
		}
	}
};

export default config;
