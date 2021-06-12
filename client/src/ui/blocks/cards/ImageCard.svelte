<script lang='ts'>
	import { createEventDispatcher } from 'svelte';
	import Card from '../Card.svelte';
	import Image from '../Image.svelte';
	import Scene from '../Scene.svelte';

	export let src = '';
	export let alt = '';
	export let height = 'auto';
	export let width = '100%';
	export let placeholderColour = '';
	export let backgroundColour = '';

	const dispatch = createEventDispatcher();
</script>

<Card
	isPadded={false}
	{...$$restProps}
>
	<Image
		{src}
		{alt}
		{placeholderColour}
		on:load={() => dispatch('load')}
	/>
	<Scene
		isPadded={true}
		{height}
		{width}
		{backgroundColour}
	>
		<slot></slot>
	</Scene>
</Card>