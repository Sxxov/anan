<script lang='ts'>
	import {
		// onMount,
		createEventDispatcher,
	} from 'svelte';
	import { writable } from 'svelte/store';
	import Button from '../Button.svelte';
	import { CSSUtility } from '../../../resources/utilities';

	export let hoverColour = '#0000';
	export let backgroundColour = '#0000';
	export let height = '100%';
	export let width = '100%';

	export let svgSrc = '';
	export let svgSrcW = writable(svgSrc);
	export let svg = '';
	export let svgW = writable(svg);
	export let svgColour = backgroundColour;

	const dispatch = createEventDispatcher();

	let svgPlaceholderDomContent: HTMLDivElement;

	$: $svgSrcW, (async () => {
		$svgW = await (await fetch(svgSrc)).text();
	});

	$: svgPlaceholderDomContent && (
		svgPlaceholderDomContent.outerHTML = $svgW ?? ''
	);

	// onMount(async () => {
	// 	if ($$slots.default) {
	// 		return;
	// 	}

	// 	const svgText = (
	// 		svg
	// 		|| (
	// 			svgSrc
	// 			&& await (await fetch(svgSrc)).text()
	// 		)
	// 		|| ''
	// 	);

	// 	svgPlaceholderDomContent.outerHTML = svgText;
	// });
</script>

<component
	style='
		--height: {CSSUtility.parse(height)};
		--width: {CSSUtility.parse(width)};
	'
>
	<Button
		{...$$restProps}
		{height}
		{width}
		{backgroundColour}
		{hoverColour}
		isText={false}
		padding='16px 16px'
		roundness='50px'
		on:click={() => dispatch('click')}
	>
		<container
			style='
				--svg-colour: {svgColour};
			'
		>
			<slot>
				<placeholder
					bind:this={svgPlaceholderDomContent}
				/>
			</slot>
		</container>
	</Button>
</component>

<style>
	container {
		height: var(--height);
		width: var(--width);

		fill: var(--svg-colour);

		overflow: hidden;
	}
</style>