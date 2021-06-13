<script lang='ts'>
	import { writable } from 'svelte/store';
	import {
		onMount,
		createEventDispatcher,
		onDestroy,
	} from 'svelte';
	import { Shadow } from '../../core/shadow';
	import {
		CSSUtility,
	} from '../../resources/utilities';
	import type {
		CSS,
	} from '../../resources/utilities';

	type RollupImportedImageItem = { default: string };

	export let src: string | Promise<string> | Promise<RollupImportedImageItem>;
	export let alt = 'Image of things being depicted';

	export let height = '100%';
	export let width = '100%';

	export let heightW = writable(height);
	export let widthW = writable(width);

	export let roundness: CSS = 0;

	export let placeholderColour = '--colour-accent-secondary';
	let realSrc = '';

	(async () => {
		if (typeof src === 'string') {
			realSrc = src;

			return;
		}

		if (!(src as Promise<string>).then) {
			console.warn(`"src" prop is neither a string or a Promise: "${src}"`);

			return;
		}

		const result: string | RollupImportedImageItem = await Promise.resolve((src as any));

		if ((result as RollupImportedImageItem).default != null) {
			realSrc = (result as RollupImportedImageItem).default;

			return;
		}

		realSrc = result as string;
	})();

	let imgDomContent: HTMLImageElement;
	let componentDomContent: HTMLDivElement;
	let isActive = false;
	const depth = 0;
	const dispatch = createEventDispatcher();

	onMount(() => {
		Shadow.apply(depth, componentDomContent);
	
		if (imgDomContent.complete) {
			onLoad();

			return;
		}

		imgDomContent.addEventListener('load', onLoad);
	});

	onDestroy(() => {
		imgDomContent.removeEventListener('load', onLoad);
	});

	function onLoad(): void {
		isActive = true;
		dispatch('load');
	}
</script>

<component
	style='
		--width: {CSSUtility.parse($widthW)};
		--height: {CSSUtility.parse($heightW)};
		--border-radius: {CSSUtility.parse(roundness)};
	'
	bind:this={componentDomContent}
>
	<container
		class='background {!isActive ? '' : 'inactive'}'
		style='
			--colour-placeholder: {CSSUtility.parse(placeholderColour)};
		'
	/>
	<img
		src={realSrc}
		{alt}
		class={isActive ? '' : 'inactive'}
		draggable='false'
		bind:this={imgDomContent}
	>
</component>

<style>
	component {
		position: relative;

		height: var(--height);
		width: var(--width);
	}

	container.background {
		position: absolute;
		top: 0;
		left: 0;

		height: var(--height);
		width: var(--width);

		background: var(--colour-placeholder);

		opacity: 1;
		visibility: visible;

		border-radius: var(--border-radius);

		transition: 0.3s var(--ease-slow-slow);

		animation: flash 0.3s var(--ease-slow-slow) infinite alternate;
	}

	img {
		position: absolute;
		top: 0;
		left: 0;

		height: var(--height);
		width: var(--width);

		opacity: 1;

		object-fit: cover;

		border-radius: var(--border-radius);

		transition: 0.3s var(--ease-slow-slow);
	}

	component::after {
		content: '';

		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;

		box-shadow: var(--shadow);
	}

	container.background.inactive {
		opacity: 0;
		visibility: hidden;
	}

	img.inactive {
		opacity: 0;
	}

	@keyframes flash {
		0% {
			opacity: 0.5;
		}
		100% {
			opacity: 1;
		}
	}
</style>



