<script lang='ts'>
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type lottie from 'lottie-web';
	import Button from '../Button.svelte';
	import Lottie from '../Lottie.svelte';
	import type { CSS } from '../../../resources/utilities';

	export let isActive = false;
	export let isActiveW = writable(isActive);

	export let src = '';
	export let animationData: Record<any, any> = {};
	export let hoverColour: CSS = '#0000';
	export let backgroundColour: CSS = '#0000';
	export let height: CSS = '100%';
	export let width: CSS = '100%';
	export let overrideColour: CSS = '';
	export let padding: CSS = '16px 16px';

	let animation: ReturnType<typeof lottie.loadAnimation>;

	$: isActiveW.set(-animation?.playDirection > 0);
	$: animation?.setDirection($isActiveW ? 1 : -1), animation?.play();

	const dispatch = createEventDispatcher();
</script>

<component>
	<Button
		{...$$restProps}
		{height}
		{width}
		{backgroundColour}
		{hoverColour}
		isText={false}
		{padding}
		roundness='--roundness'
		on:click={() => {
			isActiveW.update((value) => !value);

			dispatch('click');
		}}
	>
		<Lottie
			{src}
			{animationData}
			{overrideColour}
			options={{
				autoplay: false,
				loop: false,
			}}
			bind:animation
		/>
	</Button>
</component>