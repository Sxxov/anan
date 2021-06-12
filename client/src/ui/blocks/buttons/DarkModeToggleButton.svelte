<script lang='ts'>
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import SvgButton from './SvgButton.svelte';
	import { CSSUtility } from '../../../resources/utilities';

	const IS_DARK_LOCALSTORAGE_KEY = 'isDark';
	let rawIsDark = localStorage.getItem(IS_DARK_LOCALSTORAGE_KEY);

	if (rawIsDark == null) {
		rawIsDark = String(window.matchMedia?.('(prefers-color-scheme: dark)').matches);
	}

	export let isDark = rawIsDark === 'true';
	export const isDarkW = writable(isDark);

	export let hoverColour = '#0000';
	export let backgroundColour = '#0000';
	export let height = '100%';
	export let width = '100%';
	export let overrideColour = '--colour-text-primary';

	const dispatch = createEventDispatcher();
	
	$: document.documentElement.className = document.documentElement.className
		.replace(
			/(theme:)(.*?)(?= |$)/,
			$isDarkW
				? '$1dark'
				: '$1light',
		);
	$: localStorage.setItem(IS_DARK_LOCALSTORAGE_KEY, String($isDarkW));
</script>

<component>
	<SvgButton
		{...$$restProps}
		{height}
		{width}
		{backgroundColour}
		{hoverColour}
		svgColour={CSSUtility.parse(overrideColour)}
		isText={false}
		padding='16px 16px'
		roundness='--roundness'
		on:click={() => {
			isDarkW.update((value) => !value);

			dispatch('click');
		}}
	>
		{#if $isDarkW}
			<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'>
				<path d='M0 0h24v24H0z' fill='none'/>
				<path d='M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z'/>
			</svg>
		{:else}
			<svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'><path d='M0 0h24v24H0z' fill='none'/><path d='M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z'/></svg>
		{/if}
	</SvgButton>
</component>

<style>
	svg {
		fill: var(--svg-colour);
	}
</style>