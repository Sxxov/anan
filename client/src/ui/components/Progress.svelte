<script lang='ts'>
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';

	export let percent: CSS = -1;
	export let percentW = writable(percent);
	export let height: CSS = 24;
	export let heightW = writable(height);
	export let width: CSS = '100%';
	export let widthW = writable(width);
	export let transitionDuration: CSS = '0.5s';

	let componentDomContent: HTMLDivElement;

	$: indefinite = $percentW < 0;
</script>

<component
	bind:this={componentDomContent}
	class:indefinite
	style='
		--height: {CSSUtility.parse($heightW)};
		--width: {CSSUtility.parse($widthW)};
		--percent: {$percentW}%;
		--transition-duration: {CSSUtility.parse(transitionDuration)};
	'
>
	<container
		class='bar'
	/>
</component>

<style>
	component {
		background: var(--colour-background-secondary);

		width: var(--width);

		border-radius: var(--roundness);
		overflow: hidden;
	}

	container.bar {
		background: var(--colour-accent-primary);

		height: var(--height);
		width: var(--percent);

		border-radius: var(--roundness);
		border: 0 solid var(--colour-background-secondary);

		transition: 
			width var(--transition-duration) var(--ease-slow-slow),
			border var(--transition-duration) var(--ease-slow-slow);
	}

	.indefinite > container.bar {
		width: 100%;

		border: 10px solid var(--colour-background-secondary);
		box-sizing: border-box;
	}
</style>