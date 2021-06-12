<script lang='ts'>
	import { createEventDispatcher } from 'svelte';
	import ImageCard from './ImageCard.svelte';

	export let title = '1';
	export let backgroundColour = '--colour-background-secondary';
	export let hoverColour = '--colour-background-secondary';

	const dispatch = createEventDispatcher();
</script>

<ImageCard
	{...$$restProps}
	{backgroundColour}
	{hoverColour}
	on:load={() => dispatch('load')}
>
	<heading>{title}</heading>
	<slot />
</ImageCard>