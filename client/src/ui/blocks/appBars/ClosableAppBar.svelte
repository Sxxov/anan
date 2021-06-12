<script lang='ts'>
	import { writable } from 'svelte/store';
	import AppBar from '../AppBar.svelte';
	import Button from '../Button.svelte';

	// @export
	export let expandedHeightW = writable(0);
	export let baseHeightW = writable(0);
	export let isSpaced = true;
	export let isSpacedW = writable(isSpaced);

	export let isActiveW = writable(false);
	export let onBlur = (): void => {
		isActiveW.set(false);
	};
</script>

<AppBar
	bind:expandedHeightW
	bind:baseHeightW
	bind:isSpacedW
	bind:isSpaced
	{...$$restProps}
>
	<Button 
		icon='clear'
		backgroundColour='transparent'
		hoverColour='#fff2'
		on:click={onBlur}
	/>
</AppBar>