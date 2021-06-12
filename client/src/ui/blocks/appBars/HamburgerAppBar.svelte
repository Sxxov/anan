<script lang='ts'>
	import { writable } from 'svelte/store';
	import Hamburger2 from '../Hamburger2.svelte';
	import ScrollableAppBar from './ScrollableAppBar.svelte';

	// @export
	export let expandedHeightW = writable(0);
	export let baseHeightW = writable(0);
	export let isSpaced = true;
	export let isSpacedW = writable(isSpaced);

	export let toppings: Record<string, () => void> = {};
	export let toppingsW = writable(toppings);
</script>

<ScrollableAppBar
	bind:expandedHeightW
	bind:baseHeightW
	bind:isSpacedW
	bind:isSpaced
	{...$$restProps}
>
	<container>
		{#key $toppingsW}
			{#if $toppingsW != null && typeof $toppingsW === 'object'}
				<Hamburger2
					toppings={$toppingsW}
					buttonSize='calc(2rem + 32px)'
				/>
			{/if}
		{/key}
	</container>
</ScrollableAppBar>

<style>
	container {
		/* width: calc(2rem + 32px); */
		/* --scroll-minimum-padding is defined on parent */
		height: 100%;
		/* padding: 0.5rem 0; */
		box-sizing: border-box;
	}
</style>