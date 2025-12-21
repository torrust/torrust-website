<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import { HttpRegex } from '$lib/utils/regex';

	interface Props {
		color?: 'primary' | 'secondary';
		style?: 'solid' | 'understated' | 'clear';
		size?: 'small' | 'medium' | 'large';
		href?: string | undefined;
		additionalClass?: string | undefined;
		target?: '_self' | '_blank';
		rel?: any;
		icon?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		color = 'primary',
		style = 'solid',
		size = 'medium',
		href = undefined,
		additionalClass = undefined,
		target,
		rel,
		icon,
		children,
		...rest
	}: Props = $props();

	const isExternalLink = $derived(!!href && HttpRegex.test(href));

	const finalTarget = $derived(target ?? (isExternalLink ? '_blank' : '_self'));
	const finalRel = $derived(rel ?? (isExternalLink ? 'noopener noreferrer' : undefined));

	let tag = $derived(href ? 'a' : 'button');
	let linkProps = $derived({
		href,
		target: finalTarget,
		rel: finalRel
	});
</script>

<svelte:element
	this={tag}
	{...linkProps}
	class={['button', `style--${style}`, `size--${size}`, `color--${color}`, additionalClass].join(
		' '
	)}
	data-sveltekit-preload-data
	onclick={bubble('click')}
	role="button"
	tabindex="0"
	{...rest}
>
	{#if icon}
		<div class="icon">
			{@render icon?.()}
		</div>
	{/if}
	{@render children?.()}
</svelte:element>

<style lang="scss">
	.button {
		--main-color: red;
		--light-color: blue;
		--contrast-color: green;

		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.2s ease-in-out;

		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;

		border: none;
		border-radius: 20px;
		font-weight: 700;

		.icon {
			width: 24px;
			height: 24px;
		}

		&.color {
			&--primary {
				--main-color: 255, 49, 0;
				--light-color: rgba(255, 100, 100, 0.5);
				--contrast-color: var(--color--primary-contrast);
			}
			&--secondary {
				--main-color: var(--color--secondary-rgb);
				--light-color: var(--color--secondary-tint-rgb);
				--contrast-color: var(--color--secondary-contrast);
			}
		}

		&.style {
			&--solid {
				background-color: rgb(var(--main-color));
				color: var(--contrast-color);

				&:hover {
					box-shadow: 0px 0px 1px 7px rgba(var(--main-color), 0.3);
				}
			}
			&--understated {
				background-color: rgb(var(--light-color));
				color: rgb(var(--main-color));

				&:hover {
					box-shadow: 0px 0px 1px 7px rgba(var(--main-color), 0.3);
				}
			}
			&--clear {
				background-color: transparent;
				color: rgb(var(--main-color));

				&:hover {
					background-color: rgb(var(--light-color));
				}
			}
		}

		&.size {
			&--small {
				padding: 5px 10px;
				font-size: 0.75rem;

				.icon {
					width: 20px;
					height: 20px;
				}
			}
			&--medium {
				padding: 10px 20px;
				font-size: 1rem;
			}
			&--large {
				padding: 15px 30px;
				font-size: 1.15rem;

				.icon {
					width: 28px;
					height: 28px;
				}
			}
		}
	}
</style>
