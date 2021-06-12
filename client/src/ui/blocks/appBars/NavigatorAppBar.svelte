<script lang='ts'>
	import { writable } from 'svelte/store';
	import ScrollableAppBar from './ScrollableAppBar.svelte';
	import Navigator from '../Navigator.svelte';

	// @export
	export let expandedHeightW = writable(0);
	export let scrolledHeightW = writable(0);
	export let baseHeightW = writable(0);
	export let isSpaced = true;
	export let isSpacedW = writable(isSpaced);

	export let backgroundColour = '--colour-background-primary';
	export let hoverColour = '--colour-background-secondary';
	export let textColour = '--colour-text-primary';
	export let rippleColour = '--colour-text-secondary';

	export let routes: Record<string, string>;
</script>

<ScrollableAppBar
	bind:expandedHeightW
	bind:scrolledHeightW
	bind:baseHeightW
	bind:isSpacedW
	bind:isSpaced
	{...$$restProps}
	{backgroundColour}
>
	<container>
		<Navigator
			{routes}
			{backgroundColour}
			{hoverColour}
			{textColour}
			{rippleColour}
			hamburgerProps={{
				buttonSize: 'calc(2rem + 32px)',
				menuTopOffsetW: scrolledHeightW,
			}}
		/>
	</container>
</ScrollableAppBar>

<style>
	container {
		/* width: calc(2rem + 32px); */
		/* --scroll-minimum-padding is defined on parent */
		height: 100%;
		padding: calc((var(--scroll-minimum-padding) / 2) + 0.5rem) 0;
		box-sizing: border-box;
	}
</style>