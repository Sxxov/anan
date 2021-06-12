<script lang='ts'>
	import { writable } from 'svelte/store';
	import AppBar from '../AppBar.svelte';
	import Scene from '../Fragment.svelte';
	import { CSSUtility } from '../../../resources/utilities';
	import type HamburgerAppBar from '../appBars/HamburgerAppBar.svelte';
	import type ScrollableAppBar from '../appBars/ScrollableAppBar.svelte';

	export let appBarComponent:
	| typeof AppBar
	| typeof HamburgerAppBar
	| typeof ScrollableAppBar
	| null = AppBar;
	export let title: string | undefined = undefined;
	export let appBarProps: Record<string, any> = {};
	export let height = 'auto';
	export let width = 'auto';
	export let isRounded = false;
	export let isScrollable = false;
	export let isScrollableW = writable(isScrollable);

	export let expandedHeightW = writable(0);

	$: sceneHeight = $isScrollableW
		? `calc(${CSSUtility.parse(height)} - ${$expandedHeightW}px)`
		: 'auto';
</script>

<component
	style='
		--height: {CSSUtility.parse(height)};
		--width: {CSSUtility.parse(width)};
	'
>
	<slot name='appBar'>
		{#if appBarComponent != null}
			<svelte:component
				this={appBarComponent}
				{title}
				{expandedHeightW}
				borderRadius={isRounded ? 'var(--roundness) var(--roundness) 0 0' : 0}
				{...appBarProps}
			/>
		{/if}
	</slot>
	<Scene
		bind:height={sceneHeight}
		width='auto'
		borderRadius={isRounded ? '0 0 var(--roundness) var(--roundness)' : 0}
		{isScrollable}
		{isScrollableW}
		{...$$restProps}
	>
		<slot />
	</Scene>
</component>

<style>
	component {
		display: flex;
		flex-direction: column;

		height: var(--height);
		width: var(--width);
	}
</style>