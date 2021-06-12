<script lang='ts'>
	import * as router from 'svelte-spa-router';
	import SvgButton from './buttons/SvgButton.svelte';
	import { CSSUtility } from '../../resources/utilities';

	export let colour = '--colour-accent-primary';
</script>

<component>
	<SvgButton
		on:click={() => {
			if (window.location.href.includes('#')) {
				router.push('/');
			}

			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth',
			});
		}}
		svg='
		<svg height=20px width=24px xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 749" fill={CSSUtility.parse(colour)}>
			<g id="Layer_2" data-name="Layer 2">
				<rect x="750" width="250" height="250"/>
			</g>
			<g id="Layer_3" data-name="Layer 3">
				<rect x="500" y="250" width="250" height="250"/>
			</g>
			<g id="Layer_4" data-name="Layer 4">
				<rect y="499" width="250" height="250"/>
			</g>
			<g id="Layer_5" data-name="Layer 5">
				<rect x="250" width="250" height="500"/>
			</g>
		</svg>
		'
		{...$$restProps}
	>
	</SvgButton>
</component>

<style>
	component {
		height: auto;
		width: auto;
	}
</style>