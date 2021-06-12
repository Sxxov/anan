<script lang='ts'>
	import {
		onDestroy,
		onMount,
	} from 'svelte';
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';
	import {
		fadeIn,
		fadeOut,
	} from '../../core/transitioner';
	import { Gradient } from './gradient/gradient';

	export let height: CSS = '100vh';
	export let heightW = writable(height);
	export let width: CSS = '100%';
	export let widthW = writable(width);
	// export let gradientColours: [string, string, string, string] = [
	// 	CSSUtility.getVariable('--colour-background-secondary'),
	// 	CSSUtility.getVariable('--colour-accent-primary'),
	// 	CSSUtility.getVariable('--colour-background-primary'),
	// 	CSSUtility.getVariable('--colour-background-secondary'),
	// ];
	// export let gradientColours: [string, string, string, string] = [
	// 	'#7af092',
	// 	'#16f7bb',
	// 	'#db7f8e',
	// 	'#9882ac',
	// ];
	export let gradientColours: [string, string, string, string] = [
		CSSUtility.getVariable('--colour-background-primary'),
		'#88D498',
		CSSUtility.getVariable('--colour-background-secondary'),
		'#197278',
	];

	const gradient = new Gradient();

	let componentDomContent: HTMLDivElement;
	let canvasDomContent: HTMLCanvasElement;

	onMount(() => {
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('touchmove', onMouseMove);

		gradient.el = canvasDomContent;
		gradient.connect();

		gradient.updateFrequency(-0.00005);
		// gradient.amp = 1000;
	});

	onDestroy(() => {
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('touchmove', onMouseMove);
	
		gradient.disconnect();
	});

	let lastMousePositionX = 0;
	let lastMousePositionY = 0;
	let lastMouseMoveTime = 0;

	function onMouseMove(event: MouseEvent | TouchEvent) {
		const currentMousePositionX = (
			(event as TouchEvent)
				.touches?.[0]
				.screenX
			?? (event as MouseEvent)
				.screenX
		)
		* devicePixelRatio;
		const currentMousePositionY = (
			(event as TouchEvent)
				.touches?.[0]
				.screenY
			?? (event as MouseEvent)
				.screenY
		)
		* devicePixelRatio;

		const currentMouseMoveTime = performance.now();
		const mouseVelocity = (
			Math.abs(currentMousePositionX - lastMousePositionX)
			+ Math.abs(currentMousePositionY - lastMousePositionY)
		)
		/ Math.abs(
			currentMouseMoveTime
			- lastMouseMoveTime,
		);

		lastMousePositionX = currentMousePositionX;
		lastMousePositionY = currentMousePositionY;
		lastMouseMoveTime = currentMouseMoveTime;

		gradient.additionalVelocity = Math.min(gradient.additionalVelocity + mouseVelocity / 5, 50);
	}
</script>

<component
	bind:this={componentDomContent}
	in:fadeIn={{ duration: 1000 }}
	out:fadeOut={{ duration: 100 }}
	style='
		--height: {CSSUtility.parse($heightW)};
		--width: {CSSUtility.parse($widthW)};
		--gradient-color-1: {gradientColours[0]};
		--gradient-color-2: {gradientColours[1]};
		--gradient-color-3: {gradientColours[2]};
		--gradient-color-4: {gradientColours[3]};
	'
>
	<canvas 
		bind:this={canvasDomContent}
	/>
</component>

<style>
	component {
		height: var(--height);
		width: var(--width);

		overflow: hidden;
	}
</style>
