<script lang='ts'>
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';

	export const Directions = {
		HORIZONTAL: 0,
		VERTICAL: 1,
	};

	export let height: CSS = 24;
	export let width: CSS = 24;

	export let heightW = writable(height);
	export let widthW = writable(width);
	export let direction = Directions.HORIZONTAL;
</script>

<component
	style='
		--height: calc({
			CSSUtility.parse(
				+(direction === Directions.HORIZONTAL)
				&& $heightW,
			)
		} - 1px);
		--width: calc({
			CSSUtility.parse(
				+(direction === Directions.VERTICAL)
				&& $widthW,
			)
		} - 1px);
'></component>

<style>
	component {
		height: var(--height);
		width: var(--width);

		user-select: none;
		pointer-events: none;
	}
</style>