<script lang='ts'>
	import type {
		LottiePlayer,
		AnimationConfigWithData,
		AnimationConfigWithPath,
	} from 'lottie-web';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';

	// @export
	export let animationCurrentFrameW = writable(0);
	export let animation: ReturnType<LottiePlayer['loadAnimation']> | undefined = undefined;

	export let src = '';
	export let animationData: Record<any, any> | undefined = undefined;
	export let height: CSS = '100%';
	export let width: CSS = '100%';
	export let options: Partial<AnimationConfigWithData | AnimationConfigWithPath> = {};
	export let overrideColour: CSS = '';

	let containerDomContent: HTMLDivElement;
	let isAnimationCurrentFrameBeingUpdatedInternally = false;
	let isAnimationCurrentFrameBeingUpdatedExternally = false;

	onMount(async () => {
		const lottiePromise = import('lottie-web');
		const json = await Promise.resolve(animationData)
			?? (
				!src
					? {}
					: await (
						await fetch(src)
					).json()
			);

		const lottie: LottiePlayer = await lottiePromise as any;

		if (animation == null) {
			animation = lottie.loadAnimation({
				container: containerDomContent,
				animationData: json,
				autoplay: true,
				loop: true,
				...options,
			});
		}

		animation.addEventListener('enterFrame', () => {
			if (isAnimationCurrentFrameBeingUpdatedExternally) {
				isAnimationCurrentFrameBeingUpdatedExternally = false;
	
				return;
			}

			isAnimationCurrentFrameBeingUpdatedInternally = true;

			animationCurrentFrameW.set(animation?.currentRawFrame ?? -1);
		});
	});

	$: isAnimationCurrentFrameBeingUpdatedInternally
		? isAnimationCurrentFrameBeingUpdatedInternally = false
		: (
			animation?.goToAndStop($animationCurrentFrameW),
			(isAnimationCurrentFrameBeingUpdatedExternally = true)
		);
</script>

<component
	style='
		--height: {CSSUtility.parse(height)};
		--width: {CSSUtility.parse(width)};
	'
>
	<container
		bind:this={containerDomContent}
		class:unloaded={animation == null}
		class:override={overrideColour}
		style='
			--colour-override: {CSSUtility.parse(overrideColour)}
		'
	/>
</component>

<style>
	component {
		height: var(--height);
		width: var(--width);

		overflow: hidden;
	}

	container {
		opacity: 1;

		transition: opacity 0.3s var(--ease-slow-slow);
	}

	container.override :global(*) {
		fill: var(--colour-override);
		stroke: var(--colour-override);
	}

	container.unloaded {
		opacity: 0;
	}

	/* :global(.lottie-player) {
		top: 50%;
    	transform: translateY(-50%);
	} */
</style>