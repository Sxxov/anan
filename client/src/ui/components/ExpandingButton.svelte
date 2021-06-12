<script lang='ts'>
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import {
		BezierUtility,
		CSSUtility, WindowUtility,
	} from '../../resources/utilities';
	import Button from '../blocks/Button.svelte';

	const dispatch = createEventDispatcher();

	export let backgroundColour = 'radial-gradient(circle, #0000 0%, var(--colour-ok-primary) 100%)';
	export let arrowColour = 'radial-gradient(circle, #0000 0%, var(--colour-text-primary) 100%)';
	export let buttonColour = '--colour-ok-primary';
	export let hoverColour = '--colour-ok-secondary';
	export let isBlinkerEnabled = true;
	export let isArrowEnabled = true;
	export let threshold = WindowUtility.viewport.min / 3;
	export let isThresholdCrossedW = writable(false);
	export let size = 56;

	let component: HTMLDivElement;
	let outer: HTMLDivElement;
	let arrow: HTMLDivElement | undefined;
	let isHolding = false;
	let animation: Animation | null = null;
	let isBlinkerActive = isBlinkerEnabled;
	let arrowRotationDeg = 0;
	const bezierUtility = new BezierUtility(0.33, 0, 0, 1);

	const scaleW = writable(1);

	$: $scaleW === 1
		&& isBlinkerEnabled
		? isBlinkerActive = true
		: isBlinkerActive = false;
	$: $isThresholdCrossedW && dispatch('threshold');
	$: scaleEnd = $isThresholdCrossedW ? 10 : 1;
	$: opacityEnd = $isThresholdCrossedW ? 0 : 1;

	function onMouseDown() {
		isHolding = true;

		animation?.cancel();
		animation = null;
	}

	function onMouseUp() {
		if (!isHolding) {
			return;
		}

		isHolding = false;

		if ($isThresholdCrossedW) {
			dispatch('trigger');
		}

		const options = {
			duration: 500,
			easing: CSSUtility.getVariable('--ease-fast-slow'),
		};

		animation = outer.animate([
			{
				transform: `scale(${scaleEnd})`,
				opacity: opacityEnd,
			},
		], options);
		arrow?.animate([
			{
				transform: `rotate(0) scale(${scaleEnd})`,
				opacity: opacityEnd,
			},
		], options);

		animation.addEventListener('finish', () => {
			$scaleW = 1;

			animation = null;
		});

		$isThresholdCrossedW = false;
	}

	function onMouseMove<T = 'mouse' | 'touch'>(event: T extends 'mouse' ? MouseEvent : TouchEvent) {
		if (!isHolding) {
			return;
		}
	
		const userX = (
			(event as TouchEvent).touches?.[0]?.pageX
			?? (event as MouseEvent).clientX
		);
		const userY = (
			(event as TouchEvent).touches?.[0]?.pageY
			?? (event as MouseEvent).clientY
		);
		const {
			left,
			top,
			height,
			width,
		} = component.getBoundingClientRect();
		const buttonX = left + width / 2;
		const buttonY = top + height / 2;
		const distance = Math.hypot(buttonX - userX, buttonY - userY);
		const distanceNormalized = distance
			/ Math.hypot(
				WindowUtility.viewport.height,
				WindowUtility.viewport.width,
			);
		const distanceBezierized = bezierUtility.at(distanceNormalized);

		if (isArrowEnabled) {
			arrowRotationDeg = -(
				Math.atan(
					(userX - buttonX)
					/ (userY - buttonY),
				)
				* (180 / Math.PI)
				+ Number(
					userY > buttonY
					&& 180,
				)
			);
		}

		if (distance > threshold) {
			$isThresholdCrossedW = true;
		} else {
			$isThresholdCrossedW = false;
		}
	
		$scaleW = distanceBezierized
			* (WindowUtility.viewport.max / 100)
			* 3
			+ 1;
	}
</script>

<svelte:window
	on:mousemove={onMouseMove}
	on:touchmove={onMouseMove}
	on:mouseup={onMouseUp}
/>

<component
	bind:this={component}
	on:touchstart={onMouseDown}
	on:mousedown={onMouseDown}
	on:touchend={onMouseUp}
	style='
		--colour-background: {CSSUtility.parse(backgroundColour)};
		--colour-arrow: {CSSUtility.parse(arrowColour)};
		--size: {CSSUtility.parse(size)};
	'
>
	<container
		bind:this={outer}
		class='outer touch'
		style='
			--outer-transform: scale({$scaleW});
			--outer-filter: blur({Math.min($scaleW, 5)}px);
		'
	/>
	{#if isArrowEnabled}
		<container
			bind:this={arrow}
			class='outer arrow wrapper'
			style='
				--arrow-transform: rotate({arrowRotationDeg}deg) scale({$scaleW});
				--arrow-filter: blur({Math.min($scaleW, 5)}px);
			'
		>
			<container
				class='outer arrow content'
			/>
		</container>
	{/if}
	<container
		class='outer blinker'
		class:paused={!isBlinkerActive}
	/>
	<Button 
		icon='clear'
		backgroundColour={buttonColour}
		hoverColour={hoverColour}
		height={size}
		width={size}
		padding={(size - 16) / 2}
		roundness='100%'
		on:click={() => dispatch('click')}
		{...$$restProps}
	/>
</component>

<style>
	component {
		transform: matrix(1, 0, 0, 1, 0, 0);
	}

	.outer {
		border-radius: 100%;

		height: var(--size);
		width: var(--size);

		position: absolute;
		top: 0;
		left: 0;
		background: var(--colour-background);

		/* transition: var(--ease-fast-slow); */
	}

	.outer.arrow.wrapper {
		transform: var(--arrow-transform);
		filter: var(--arrow-filter);

		/* transition: all 0.5s var(--ease-fast-slow); */
	}

	.outer.arrow.content {
		clip-path: polygon(100% 0, 0 0, 50% 50%);
		background: var(--colour-arrow);
		opacity: 1;
	}

	.outer.touch {
		transform: var(--outer-transform);
		filter: var(--outer-filter);
		opacity: 0.5;
	}

	.outer.blinker {
		opacity: 0.2;
		animation: flash 1s var(--ease-slow-slow) infinite alternate-reverse both;
	}

	.outer.blinker.paused {
		animation: nothing 1s var(--ease-slow-slow) infinite alternate-reverse both;
	}

	@keyframes flash {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(3);
			opacity: 0;
		}
	}

	@keyframes nothing {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 0;
		}
	}

</style>