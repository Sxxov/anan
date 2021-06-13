<script lang='ts'>
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import {
		CSSUtility,
	} from '../../../resources/utilities';
	import type { CSS } from '../../../resources/utilities';
	import Button from '../Button.svelte';

	export let isTwoTone = true;
	export let isTwoToneW = writable(isTwoTone);
	export let icon = 'done';
	export let iconW = writable(icon);
	export let iconSize: CSS = '1rem';
	export let twoToneFilter: CSS = '--filter-text-secondary';
	export let fillColour: CSS = '--colour-text-secondary';
	export let hoverFillColour = '--colour-accent-primary';
	export let hoverTwoToneFilter = '--filter-accent-primary';
	export let backgroundHoverColour = '--colour-accent-secondary';
	export let isHoveredW = writable(false);
	export let isIconOnly = false;
	export let isIconOnlyW = writable(isIconOnly);
	export let iconWidth: CSS = 'calc(var(--icon-size) * 2.5)';
	export let iconWidthW = writable(iconWidth);

	const dispatch = createEventDispatcher();

	let currentFillColour: CSS;
	let currentTwoToneFilter: CSS;

	$: $isHoveredW
		? (() => {
			currentFillColour = hoverFillColour;
			currentTwoToneFilter = hoverTwoToneFilter;
		})()
		: (() => {
			currentFillColour = fillColour;
			currentTwoToneFilter = twoToneFilter;
		})();
</script>

<Button
	on:click={() => dispatch('click')}
	on:mouseover={() => (($isHoveredW = true), dispatch('mouseover'))}
	on:mouseout={() => (($isHoveredW = false),  dispatch('mouseout'))}
	hoverColour={backgroundHoverColour}
	{...$$restProps}
	isText={false}
>
	<container
		style='
			--icon-width: {$$slots.default && !$isIconOnlyW ? $iconWidthW : 'auto'};
		'
	>
		{#if $isTwoToneW} 
			<icon
				style='
					--filter-twotone: {CSSUtility.parse(currentTwoToneFilter)};
					--icon-size: {CSSUtility.parse(iconSize)};
				'
			>
				{$iconW}
			</icon>
		{:else}
			<iconf
				style='
					--colour-fill: {CSSUtility.parse(currentFillColour)};
					--icon-size: {CSSUtility.parse(iconSize)};
				'
			>
				{$iconW}
			</iconf>
		{/if}
		<slot></slot>
	</container>
</Button>

<style>
	icon {
		filter: var(--filter-twotone);
		font-size: var(--icon-size);

		/* transition: filter 0.3s var(--ease-fast-slow); */
	}

	iconf {
		color: var(--colour-fill);
		font-size: var(--icon-size);

		transition: color 0.3s var(--ease-fast-slow);
	}

	container {
		display: grid;
		grid-template-columns: var(--icon-width) auto;
		grid-template-rows: auto;
		justify-items: flex-start;
	}
</style>