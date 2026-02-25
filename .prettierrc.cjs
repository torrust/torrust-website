module.exports = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: [require('prettier-plugin-svelte')],
	overrides: [
		{ files: '*.svelte', options: { parser: 'svelte' } },
		{ files: '*.md', options: { useTabs: false, tabWidth: 2 } }
	]
};
