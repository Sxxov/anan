<script lang='ts'>
	import { writable } from 'svelte/store';
	import AppBar from '../AppBar.svelte';
	import { CSSUtility } from '../../../resources/utilities';

	// @export
	export let expandedHeightW = writable(0);
	export let scrolledHeightW = writable(0);
	export let baseHeightW = writable(0);
	export let computedPaddingW = writable(0);
	export let isSpaced = true;
	export let isSpacedW = writable(isSpaced);

	export let mininumPadding = 8;

	let componentDomContent: HTMLDivElement;
	const appBarPaddingW = writable('');
	const scrollYW = writable(0);

	window.addEventListener(
		'scroll',
		() => {
			scrollYW.set(
				(() => {
					if ($computedPaddingW === null) {
						return window.scrollY;
					}

					if ($computedPaddingW * 2 - window.scrollY < 0) {
						return $computedPaddingW * 2;
					}

					return window.scrollY;
				})(),
			);
		},
		{
			passive: true,
		},
	);

	$: scrolledHeightW.set($expandedHeightW - $scrollYW);
	$: appBarPaddingW.set(`calc(var(--padding) - (${$scrollYW}px / 2)) var(--padding)`);
</script>

<component
	bind:this={componentDomContent}
>
	<AppBar
		contentPadding='{CSSUtility.parse(mininumPadding)} 0'
		{expandedHeightW}
		{baseHeightW}
		{appBarPaddingW}
		{computedPaddingW}
		{isSpacedW}
		{isSpaced}
		{...$$restProps}
	>
		<slot />
	</AppBar>
</component>