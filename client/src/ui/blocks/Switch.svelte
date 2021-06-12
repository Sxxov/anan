<script lang='ts'>
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';

	export let isChecked = false;
	export let isCheckedW = writable(isChecked);

	$: isCheckedW.set(isChecked);
	$: isChecked = $isCheckedW;

	export let backgroundColour: CSS = '--colour-background-secondary';
	export let checkedColour: CSS = '--colour-accent-secondary';
	export let knobColour: CSS = '--colour-text-primary';
	export let height: CSS = 32;
	export let width: CSS = 56;
	export let knobSize: CSS = 32;
</script>
  
<label 
	class='switch'
	style='
		--colour-background: {CSSUtility.parse(backgroundColour)};
		--colour-knob: {CSSUtility.parse(knobColour)};
		--colour-checked: {CSSUtility.parse(checkedColour)};
		--height: {CSSUtility.parse(height)};
		--width: {CSSUtility.parse(width)};
		--knob-size: {CSSUtility.parse(knobSize)};
	'
>
	<input 
		type='checkbox' 
		bind:checked={isChecked}
	/>
	<span 
		class='slider'
	/>
</label>

<style>
	.switch {
		position: relative;
		display: inline-block;
		width: var(--width);
		height: var(--height);
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;

		top: 0;
		left: 0;
		height: 100%;
		width: 100%;

		background: var(--colour-background);
		transition: background-color 0.3s var(--ease-slow-slow);
		border-radius: 9999px;
	}

	.slider:before {
		position: absolute;
		content: '';

		height: var(--knob-size);
		width: var(--knob-size);
		top: calc((var(--height) - var(--knob-size)) / 2);
		left: calc((var(--height) - var(--knob-size)) / 2);

		background: var(--colour-knob);

		border-radius: 50%;

		transform: scale(0.5);
		transition: transform 0.3s var(--ease-fast-slow),
					left 0.3s var(--ease-slow-slow);
	}

	input:checked + .slider {
		background: var(--colour-checked);
	}

	input:checked + .slider:before {
		left: calc((var(--width) - (var(--knob-size) + ((var(--height) - var(--knob-size)) / 4))));
    	transform: scale(1);
	}
</style>