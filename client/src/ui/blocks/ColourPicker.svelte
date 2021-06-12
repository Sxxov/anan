<script lang='ts'>
	import {
		onMount,
		tick,
	} from 'svelte';
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';

	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import {
		dropIn,
		dropOut,
	} from '../../core/transitioner';
	import { UnexpectedValueError } from '../../resources/errors';

	export let isActiveW = writable(false);
	export let buttonProps = {};
	export let height: CSS = 256;
	export let width: CSS = 'min(max(50vw, 128px), 256px)';
	export let value = '';
	export let startingHexColour: string | undefined = undefined;
	export let hueDegree = 0;
	export let saturation = 1;
	export let lightness = 0.5;
	export let baseColour = '#ff0000';
	export let hexColourW = writable('#ff0000');
	export let hoverHexColourW = writable('#ff1111');
	export let lastHexColourW = writable($hexColourW);
	export let lastHoverHexColourW = writable($hoverHexColourW);

	// todo: have all this be not be stupid

	if (startingHexColour != null) {
		const [
			h,
			s,
			l,
		] = rgbToHSL(...hexToRGB(startingHexColour));

		hueDegree = h;
		saturation = s;
		lightness = l;

		$hexColourW = startingHexColour;
	}

	enum Targets {
		SATURATION_LIGHTNESS,
		HUE,
	}

	const targetDomContents: HTMLDivElement[] = [];
	const targetBoundingClientRects: DOMRect[] = [];
	const targetIndicatorDomContents: HTMLDivElement[] = [];
	const targetIndicatorPositions: {
		x: number;
		y: number;
	}[] = [];
	let currentTargetIndex = -1;
	const isButtonAnimatedW = writable(true);
	const forcedUpdateIndexW = writable(0);
	let contentContainerDomContent: HTMLDivElement;

	$: {
		$forcedUpdateIndexW;

		baseColour = rgbToHex(...hslToRGB(hueDegree, 1, 0.5));
		$hexColourW = rgbToHex(...hslToRGB(hueDegree, saturation, lightness));
		$hoverHexColourW = rgbToHex(...hslToRGB(
			hueDegree,
			saturation,
			lightness + 0.1 > 1
				? lightness - 0.1
				: lightness + 0.1,
		));
		value = $hexColourW;
	}

	// if the user enters a hex string into input
	$: if (value !== $hexColourW) {
		$forcedUpdateIndexW;

		let rgb: ReturnType<typeof hexToRGB>;

		try {
			rgb = hexToRGB(value);
		} catch (err) {
			//
		}

		if (rgb! != null) {
			$hexColourW = value;

			const [hslHue] = rgbToHSL(...rgb);
			const [
				hsvHue,
				hsvSaturation,
				hsvValue,
			] = rgbToHSV(...rgb);

			setIndicatorPositionsWithoutUpdate(hsvHue, hsvSaturation, hsvValue);

			baseColour = rgbToHex(...hslToRGB(hslHue, 1, 0.5));
			$hexColourW = rgbToHex(...rgb);
		}
	}
	
	// if the user clicks inside the hue selector
	$: if (currentTargetIndex === Targets.HUE) {
		$forcedUpdateIndexW;

		hueDegree = (
			targetIndicatorPositions[Targets.HUE]?.x
			/ targetBoundingClientRects[Targets.HUE].width
		) * 360 || 0;
	}

	// if the user clicks inside the saturation lightness selector
	$: if (currentTargetIndex === Targets.SATURATION_LIGHTNESS) {
		$forcedUpdateIndexW;

		const hsvValue = 1 - (
			targetIndicatorPositions[Targets.SATURATION_LIGHTNESS]?.y
			/ targetBoundingClientRects[Targets.SATURATION_LIGHTNESS].height
		);
		const hsvSaturation = targetIndicatorPositions[Targets.SATURATION_LIGHTNESS]?.x
			/ targetBoundingClientRects[Targets.SATURATION_LIGHTNESS].width;
	
		lightness = (hsvValue / 2) * (2 - hsvSaturation);
		saturation = ((hsvValue * hsvSaturation) / (1 - Math.abs(2 * lightness - 1))) || 0;
	}

	// when the user opens the selectors
	$: if ($isActiveW) {
		onPickerMount();
	}

	// when the user closes the selectors
	$: if (!$isActiveW) {
		onPickerDestroy();
	}

	onMount(() => {
		if ($isActiveW) {
			onPickerMount();
		}
	});

	async function revert() {
		setIndicatorPositionsWithoutUpdate(
			...rgbToHSV(
				...(
					hexToRGB(
						$lastHexColourW
						|| $hexColourW,
					)
				),
			),
		);

		$hexColourW = $lastHexColourW;
		$hoverHexColourW = $lastHoverHexColourW;

		await forceUpdate();
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key !== 'Escape') {
			return;
		}

		$isActiveW = false;
	}

	async function onPickerMount() {
		$lastHexColourW = $hexColourW;
		$lastHoverHexColourW = $hoverHexColourW;

		await tick();

		onResize();

		setIndicatorPositionsWithoutUpdate(
			...rgbToHSV(
				...hslToRGB(hueDegree, saturation, lightness),
			),
		);
	}

	async function onPickerDestroy() {
		await tick();
	
		// just in case the user edited the input but didn't put something right
		value = $hexColourW;
		++$forcedUpdateIndexW;
	}

	async function forceUpdate() {
		await tick();

		currentTargetIndex = Targets.HUE;
		++$forcedUpdateIndexW;

		await tick();

		currentTargetIndex = Targets.SATURATION_LIGHTNESS;
		++$forcedUpdateIndexW;

		await tick();

		currentTargetIndex = -1;
	}

	let isClickInside = false;

	function onInsideMouseDown() {
		isClickInside = true;
	}

	async function onWindowMouseDown() {
		await new Promise((resolve) => setTimeout(resolve, 0));

		if (!isClickInside) {
			$isActiveW = false;
		}

		isClickInside = false;
	}

	function setIndicatorPositionsWithoutUpdate(h: number, s: number, v: number) {
		currentTargetIndex = -1;
	
		targetIndicatorPositions[Targets.HUE] = {
			x: (
				(h / 360)
				* targetBoundingClientRects[Targets.HUE].width
			),
			y: -1,
		};

		targetIndicatorPositions[Targets.SATURATION_LIGHTNESS] = {
			x: (
				s * targetBoundingClientRects[Targets.SATURATION_LIGHTNESS].width
			),
			y: (
				(1 - v) * targetBoundingClientRects[Targets.SATURATION_LIGHTNESS].height
			),
		};
	}

	function updateBoundingClientRects() {
		targetDomContents.forEach((targetDomContent, i) => {
			targetBoundingClientRects[i] = targetDomContent.getBoundingClientRect();
		});
	}

	function onResize() {
		updateBoundingClientRects();
	}

	function onMouseUp(this: number) {
		currentTargetIndex = -1;

		isButtonAnimatedW.set(true);
	}

	function onMouseDown(this: number, event: MouseEvent | TouchEvent) {
		targetBoundingClientRects[this] = targetDomContents[this].getBoundingClientRect();

		currentTargetIndex = this;
	
		onMouseMove.bind(this)(event);

		isButtonAnimatedW.set(false);
	}

	function onMouseMove(this: number, event: MouseEvent | TouchEvent) {
		if (this !== currentTargetIndex) {
			return;
		}

		const boundingClientRect = targetBoundingClientRects[this];
		const {
			clientX,
			clientY,
		} = (event as TouchEvent).touches?.[0]
			?? (event as MouseEvent);

		const {
			x,
			y,
		} = getIndicatorPosition(
			clientX,
			clientY,
			boundingClientRect,
		);

		requestAnimationFrame(() => {
			targetIndicatorPositions[this] = {
				x,
				y,
			};
		});
	}

	function getIndicatorPosition(
		clientX: number,
		clientY: number,
		boundingClientRect: DOMRect,
	) {
		const {
			top,
			left,
			width,
			height,
		} = boundingClientRect;

		return {
			x: Math.min(Math.max(clientX - left, 0), width),
			y: Math.min(Math.max(clientY - top, 0), height),
		};
	}

	// function hsvToRGB(h: number, s: number, v: number): [r: number, g: number, b: number] {
	// 	const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

	// 	return [
	// 		f(5),
	// 		f(3),
	// 		f(1),
	// 	];
	// }

	function rgbToHSV(r: number, g: number, b: number): [h: number, s: number, v: number] {
		const v = Math.max(r, g, b);
		const c = v - Math.min(r, g, b);
		const h = c && (
			// eslint-disable-next-line no-nested-ternary
			(v === r)
				? (g - b) / c
				: (
					(v === g)
						? 2 + (b - r) / c
						: 4 + (r - g) / c
				)
		);

		return [
			60 * (h < 0 ? h + 6 : h),
			v && c / v,
			v,
		];
}

	function hexToRGB(hex: string): [r: number, g: number, b: number] {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

		if (!result) {
			throw new UnexpectedValueError(`${hex} is not a hex string`);
		}

		return [
			parseInt(result[1], 16) / 255,
			parseInt(result[2], 16) / 255,
			parseInt(result[3], 16) / 255,
		];
	}

	function rgbToHex(r: number, g: number, b: number): string {
		const f = (c: number) => {
			const cHex = (c * 255).toString(16);
			const indexOfDecimal = cHex.indexOf('.');

			return cHex
				.substr(0, indexOfDecimal !== -1 ? indexOfDecimal : undefined)
				.padStart(2, '0');
		};

		return `#${f(r)}${f(g)}${f(b)}`;
	}

	// stolen wholesale from https://stackoverflow.com/a/64090995
	function hslToRGB(h: number, s: number, l: number): [r: number, g: number, b: number] {
		const a = s * Math.min(l, 1 - l);
		const f = (
			n: number,
			k = (n + h / 30) % 12,
		) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

		return [
			f(0),
			f(8),
			f(4),
		];
	}

	// stolen wholesale from https://stackoverflow.com/a/54071699
	function rgbToHSL(r: number, g: number, b: number): [h: number, s: number, l: number] {
		const v = Math.max(r, g, b);
		const c = v - Math.min(r, g, b);
		const f = (1 - Math.abs(v + v - c - 1));
		const h = c && (
			// eslint-disable-next-line no-nested-ternary
			(v === r)
				? (g - b) / c
				: (
					(v === g)
						? 2 + (b - r) / c
						: 4 + (r - g) / c
				)
		);
	
		return [
			60 * (h < 0 ? h + 6 : h),
			f ? c / f : 0,
			(v + v - c) / 2,
		];
	}
</script>

<svelte:window
	on:mousemove={onMouseMove.bind(Targets.SATURATION_LIGHTNESS)}
	on:mousemove={onMouseMove.bind(Targets.HUE)}
	on:touchmove={onMouseMove.bind(Targets.SATURATION_LIGHTNESS)}
	on:touchmove={onMouseMove.bind(Targets.HUE)}
	on:mouseup={onMouseUp}
	on:touchend={onMouseUp}
	on:mousedown={onWindowMouseDown}
	on:touchstart|passive={onWindowMouseDown}
	on:keydown={onKeyDown}
/>

<component>
	<container
		class='button'
		on:mousedown={onInsideMouseDown}
		on:touchstart={onInsideMouseDown}
	>
		<Button
			icon='colorize'
			bind:backgroundColour={$hexColourW}
			bind:hoverColour={$hoverHexColourW}
			on:click={() => {
				isActiveW.update((isActiveWValue) => !isActiveWValue);
			}}
			isAnimatedW={isButtonAnimatedW}
			isTextInvertedAgainstBackground={true}
			{...buttonProps}
		/>
	</container>
	{#if $isActiveW}
		<container
			class='all'
			style='
				--height: {CSSUtility.parse(height)};
				--width: {CSSUtility.parse(width)};
			'
			in:dropIn
			out:dropOut={{ duration: 100 }}
		>
			<container
				class='content'
				style='
					--colour-base: {baseColour};
				'
				bind:this={contentContainerDomContent}
				on:mousedown={onInsideMouseDown}
				on:touchstart={onInsideMouseDown}
			>
				<container
					class='gradient value'
				>
					<container
						class='gradient saturation'
					>
						<container
							class='gradient lightness'
							bind:this={targetDomContents[Targets.SATURATION_LIGHTNESS]}
							on:resize={onResize}
							on:mousedown={onMouseDown.bind(Targets.SATURATION_LIGHTNESS)}
							on:touchstart|passive={onMouseDown.bind(Targets.SATURATION_LIGHTNESS)}
						>
							<container
								class='indicator value saturation lightness'
								bind:this={targetIndicatorDomContents[Targets.SATURATION_LIGHTNESS]}
								style='
									--left: {
										CSSUtility.parse(
											targetIndicatorPositions[Targets.SATURATION_LIGHTNESS]?.x,
										)
									};
									--top: {
										CSSUtility.parse(
											targetIndicatorPositions[Targets.SATURATION_LIGHTNESS]?.y,
										)
									};
								'
							/>
						</container>
					</container>
				</container>
				<container
					class='gradient hue'
					bind:this={targetDomContents[Targets.HUE]}
					on:resize={onResize}
					on:mousedown={onMouseDown.bind(Targets.HUE)}
					on:touchstart|passive={onMouseDown.bind(Targets.HUE)}
				>
					<container
						class='indicator hue'
						bind:this={targetIndicatorDomContents[Targets.HUE]}
						style='
							--left: {
								CSSUtility.parse(
									targetIndicatorPositions[Targets.HUE]?.x,
								)
							};
							--top: 0;
						'
					/>
					<container
						class='event hue'
					/>
				</container>
				<container
					class='info'
				>
					<Input 
						bind:value
						isMovingLabel={false}
						on:submit={revert}
						buttonProps={{
							icon: 'clear',
							backgroundColour: $lastHexColourW,
							hoverColour: $lastHoverHexColourW,
							isTextInvertedAgainstBackground: true,
						}}
					/>
					<Button
						icon='done'
						bind:backgroundColour={$hexColourW}
						bind:hoverColour={$hoverHexColourW}
						isAnimatedW={isButtonAnimatedW}
						isTextInvertedAgainstBackground={true}
						on:click={() => isActiveW.set(false)}
					/>
				</container>
			</container>
		</container>
	{/if}
</component>

<style>
	container.all {
		height: 0;
		width: 0;
		position: static;

		transform: matrix(1, 0, 0, 1, 0, 0);
	}

	container.content {
		width: var(--width);
		position: absolute;

		height: var(--height);

		display: grid;

		display: grid;
		grid-template-columns: 100%;
		grid-template-rows: 1fr 28px 56px;
		grid-template-areas:
			'saturation-lightness'
			'hue'
			'info';

		margin-top: 4px;
		gap: 4px;

		transform: var(--transform, 0px);

		transition: transform 0.3s var(--ease-fast-slow);
	}

	container.button {
		width: min-content;
	}

	container.gradient {
		width: 100%;
		height: 100%;

		border-radius: var(--roundness);
	}

	container.gradient.saturation {
		grid-area: saturation-lightness;

		background: linear-gradient(
			to right, 
			rgb(255, 255, 255),
			rgba(255, 255, 255, 0)
		);
	}

	container.gradient.lightness {
		background: linear-gradient(
			to top,
			rgb(0, 0, 0), 
			rgba(0, 0, 0, 0)
		);
	}

	container.gradient.hue {
		grid-area: hue;

		background: linear-gradient(
			to right,
				#ff0000 0%, 
				#ffff00 17%, 
				#00ff00 33%, 
				#00ffff 50%, 
				#0000ff 67%, 
				#ff00ff 83%,
				#ff0000 100%
			);
	}

	container.gradient.value {
		background: var(--colour-base);
	}

	container.info {
		width: 100%;

		grid-area: info;

		display: flex;
		gap: 4px;
	}

	container.indicator {
		border: 6px solid white;
		mix-blend-mode: difference;

		border-radius: var(--roundness);
		box-sizing: border-box;

		left: var(--left);
		top: var(--top);

		/* to enable top, left, ... */
		position: relative;
	}

	container.indicator.value.saturation.lightness {
		width: 18px;
		height: 18px;

		/* to centre anchor point */
		transform: translate(-50%, -50%);
	}

	container.indicator.hue {
		width: 14px;
		height: 100%;

		/* to centre anchor point only on x */
		transform: translate(-50%, 0);
	}
</style>