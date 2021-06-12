<script lang='ts' context='module'>
	// eslint-disable-next-line import/order, import/no-duplicates
	import { BezierUtility } from '../../resources/utilities';
	
	const PI2 = Math.PI * 2;

	export class GlowParticle {
		private velocityX = Math.min(Math.random() / 5000, 0.001);
		private velocityY = Math.min(Math.random() / 5000, 0.001);
		private sinValue = Math.random();
		private bezierUtility = new BezierUtility(0.65, 0, 0.35, 1);
		private x = 0;
		private y = 0;

		constructor(
			startX: number,
			startY: number,
			private radius: number,
			private rgb: [r: number, g: number, b: number],
			private stageWidth: number,
			private stageHeight: number,
		) {
			this.x = startX / stageWidth;
			this.y = startY / stageHeight;
		}

		public animate(
			ctx: CanvasRenderingContext2D,
			additionalVelocity = 0,
		): void {
			this.sinValue += 0.01;

			this.radius += Math.sin(this.sinValue);

			let multipliedVelocityX = this.velocityX * (additionalVelocity + 1);
			let multipliedVelocityY = this.velocityY * (additionalVelocity + 1);

			if (this.x + multipliedVelocityX > 1
				|| this.x + multipliedVelocityX < 0) {
				this.velocityX *= -1;
				multipliedVelocityX *= -1;
			}

			if (this.y + multipliedVelocityY > 1
				|| this.y + multipliedVelocityY < 0) {
				this.velocityY *= -1;
				multipliedVelocityY *= -1;
			}

			this.x += multipliedVelocityX;
			this.y += multipliedVelocityY;

			const computedX = this.bezierUtility.at(this.x) * this.stageWidth;
			const computedY = this.bezierUtility.at(this.y) * this.stageHeight;

			ctx.beginPath();

			const g = ctx.createRadialGradient(
				computedX,
				computedY,
				this.radius * 0.01,
				computedX,
				computedY,
				this.radius,
			);

			g.addColorStop(0, `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 1)`);
			g.addColorStop(1, `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 0)`);

			ctx.fillStyle = g;
			ctx.arc(
				computedX,
				computedY,
				this.radius,
				0,
				PI2,
				false,
			);
			ctx.fill();
		}
	}
</script>

<script lang='ts'>
	import {
		onDestroy,
		onMount,
	} from 'svelte';
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';

	// todo: separate this out into it's own file to test for noobness
	const IS_SLOW_DEVICE_KEY = 'isNoob';
	const isSlowDevice = localStorage.getItem(IS_SLOW_DEVICE_KEY);

	export let colours: [r: number, g: number, b: number][] = [
		// [229, 80, 57],
		// [235, 47, 6],
		// [130, 204, 221],
		// [30, 55, 153],
		// // [10, 61, 98],
		// [183, 21, 64],
		// [12, 36, 97],
		// [199, 115, 147],
		// [217, 184, 196],
		// [219, 121, 130],
		// [222, 164, 176],
		// [250, 220, 235],

		// [122, 240, 146],
		// [56, 224, 216],
		// [22, 247, 187],
		// [110, 255, 194],
		// [9, 230, 31],

		// [255, 249, 236],
		// [49, 8, 31],
		// [107, 15, 26],
		// [219, 127, 142],
		// [152, 130, 172],

		[
			162,
			0,
			33,
		],
		[
			27,
			6,
			94,
		],
		[
			65,
			234,
			212,
		],
		[
			219,
			127,
			142,
		],
		// [26, 94, 99],
		[
			177,
			15,
			46,
		],
		[
			40,
			0,
			0,
		],
		[
			209,
			64,
			129,
		],
	];
	export let totalParticles = 40;
	export let maxRadius = 900;
	export let minRadius = 400;
	export let height = '100%';
	export let heightW = writable(height);
	export let width = '100%';
	export let widthW = writable(width);

	let canvasDomContent: HTMLCanvasElement;
	let componentDomContent: HTMLDivElement;
	let ctx: CanvasRenderingContext2D;
	let stageWidth: number;
	let stageHeight: number;
	let additionalVelocity = 1;
	let isAnimationStopped = false;
	let globalCompositeOperation = 'saturation';
	const particles: GlowParticle[] = [];

	onMount(() => {
		ctx = canvasDomContent.getContext('2d')!;

		window.addEventListener('resize', onResize);
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('touchmove', onMouseMove);


		setTimeout(async () => {
			await onResize();

			createParticles();

			requestAnimationFrame(animate);
		}, 0);
	});

	onDestroy(() => {
		window.removeEventListener('resize', onResize);
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('touchmove', onMouseMove);

		isAnimationStopped = true;
	});

	$: ctx && (ctx.globalCompositeOperation = globalCompositeOperation);
	$: (isSlowDevice || framePerformance > 300)
		&& (
			(globalCompositeOperation = 'source-over'),
			localStorage.setItem(IS_SLOW_DEVICE_KEY, String(true))
		);

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

		additionalVelocity = Math.min(additionalVelocity + mouseVelocity, 600);
	}

	async function onResize(): Promise<void> {
		if (componentDomContent == null) {
			// try again next tick
			await new Promise((resolve) => setTimeout(resolve, 0));

			return onResize();
		}

		const {
			height,
			width,
		} = getComputedStyle(componentDomContent);

		// if dom not loaded
		if (height.includes('%') || width.includes('%')) {
			// try again next tick
			await new Promise((resolve) => setTimeout(resolve, 0));

			return onResize();
		}

		stageHeight = Number.parseFloat(height);
		stageWidth = Number.parseFloat(width);
	
		canvasDomContent.width = stageWidth;
		canvasDomContent.height = stageHeight;
	
		ctx.scale(devicePixelRatio, devicePixelRatio);

		ctx.globalCompositeOperation = globalCompositeOperation;
	}

	let lastFrameIndex = 0;
	let lastFrameTime = -1;
	let framePerformance = 0;

	function animate() {
		if (isAnimationStopped) {
			return;
		}

		ctx.clearRect(0, 0, stageWidth, stageHeight);

		for (let i = 0, l = particles.length; i < l; ++i) {
			const item = particles[i];

			item.animate(ctx, additionalVelocity);

			if (additionalVelocity > 0) {
				additionalVelocity *= 0.996;
			}
		}

		// test for noob
		if (lastFrameIndex < 5
			&& isSlowDevice == null) {
			const currentFrameTime = performance.now();

			framePerformance += lastFrameTime < 0 ? 0 : currentFrameTime - lastFrameTime;
			lastFrameTime = currentFrameTime;
			++lastFrameIndex;
		}

		requestAnimationFrame(animate);
	}

	function createParticles() {
		for (let i = 0; i < totalParticles; ++i) {
			const item = new GlowParticle(
				Math.random() * stageWidth,
				Math.random() * stageHeight,
				(Math.random() * (maxRadius - minRadius)) + minRadius,
				colours[i % colours.length],
				stageWidth,
				stageHeight,
			);

			particles[i] = item;
		}
	}
</script>

<component
	bind:this={componentDomContent}
	style='
		--height: {CSSUtility.parse($heightW)};
		--width: {CSSUtility.parse($widthW)};
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
	}

	canvas {
		position: absolute;
	}
</style>