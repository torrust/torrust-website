import jsConfigs from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';
import svelteParser from 'svelte-eslint-parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

export default [
	jsConfigs.configs.recommended,

	{
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				extraFileExtensions: ['.svelte']
			},
			globals: {
				browser: true,
				es2017: true,
				node: true,
				console: 'readonly'
			}
		},
		ignores: [
			'node_modules/',
			'build/',
			'.svelte-kit/',
			'.svelte-kit/output/',
			'.env',
			'package-lock.json'
		],
		rules: {
			'@typescript-eslint/require-await': 'off',
			'prettier/prettier': 'error',
			'no-sparse-arrays': 'off',
			'no-undef': 'off',
			'no-useless-escape': 'off',
			'no-empty': 'off',
			'no-constant-binary-expression': 'off',
			'no-unused-vars': 'off',
			'no-constant-condition': 'off',
			'no-cond-assign': 'off',
			'no-control-regex': 'off',
			'no-case-declarations': 'off',
			'no-self-assign': 'off',
			'no-async-promise-executor': 'off',
			'no-fallthrough': 'off',
			'no-prototype-builtins': 'off',
			'no-redeclare': 'off',
			'no-extra-boolean-cast': 'off',
			'no-misleading-character-class': 'off',
			'no-unused-disable': 'off',
			'no-unused-disable-directive': 'off'
		},
		plugins: {
			prettier: eslintPluginPrettier,
			'@typescript-eslint': typescriptEslintPlugin
		}
	},

	{
		files: ['*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: typescriptParser
			}
		}
	},

	{
		files: ['.svelte-kit/**'],
		rules: {
			'no-unused-vars': 'off',
			'no-control-regex': 'off',
			'no-fallthrough': 'off',
			'no-unused-labels': 'off',
			'no-warning-comments': 'off',
			'no-unused-disable-directive': 'off'
		}
	},

	eslintConfigPrettier
];
