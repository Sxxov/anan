<script lang='ts'>
	import { writable } from 'svelte/store';
	import strings from '../../resources/strings';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';
	import {
		dropIn as dropInRaw,
		dropOut as dropOutRaw,
		noop,
	} from '../../core/transitioner';
	import { Ctx } from '../../core/ctx';

	export let columns: CSS = 'auto';
	export let rows: CSS = 'auto';
	export let gap: CSS = 0;
	export let justify: CSS = 'start';
	export let align: CSS = 'center';
	export let width: CSS = 'auto';
	export let height: CSS = 'auto';
	export let isPadded = true;
	export let padding: CSS = '--padding';
	export let backgroundColour: CSS = '--colour-background-primary';
	export let isInAnimated = false;
	export let isOutAnimated = false;
	export let borderRadius: CSS = 0;
	export let isScrollable = false;
	export let isScrollableW = writable(isScrollable);

	const dropIn = isInAnimated ? dropInRaw : noop;
	const dropOut = isOutAnimated ? dropOutRaw : noop;
	const {
		isSceneOutAnimationRunning,
		isSceneInAnimationRunning,
	} = Ctx.s;

	let componentDomContent: HTMLDivElement;
	let isLocalInAnimationRunning = false;

	$: if ((isInAnimated || isOutAnimated)
		&& componentDomContent) {
		if ($isSceneOutAnimationRunning
			&& isLocalInAnimationRunning) {
			componentDomContent.style.display = 'none';
		} else {
			componentDomContent.style.display = '';
		}
	}
</script>

<component
	in:dropIn
	out:dropOut
	on:introstart={() => {
		isSceneInAnimationRunning.set(isLocalInAnimationRunning = true);
	}}
	on:introend={() => {
		// eslint-disable-next-line no-unused-vars
		isSceneInAnimationRunning.set(isLocalInAnimationRunning = false);
	}}
	on:outrostart={() => {
		isSceneOutAnimationRunning.set(true);

		// ScrollUtility.disable();
	}}
	on:outroend={() => {
		isSceneOutAnimationRunning.set(false);

		// ScrollUtility.enable();
	}}
	style='
		--width: {CSSUtility.parse(width)};
		--height: {CSSUtility.parse(height)};
		--align: {CSSUtility.parse(align)};
		--justify: {CSSUtility.parse(justify)};
	'
	bind:this={componentDomContent}
>
	<container
		class='content'
		style='
			--columns: {columns};
			--rows: {rows};
			--gap: {gap};
			--is-or-not-padding: {isPadded ? CSSUtility.parse(padding) : '0px'};
			--colour-background: {CSSUtility.parse(backgroundColour)};
			--border-radius: {CSSUtility.parse(borderRadius)};
			--overflow-y: {$isScrollableW ? 'auto' : 'unset'};
		'
	>
		<slot>
			<container class='placeholder'>
				<string>
					{strings.ui.scenes.common.warn.EMPTY_SCENE}
				</string>
			</container>
		</slot>
	</container>
</component>

<style>
	component {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto;

		height: var(--height);
		width: var(--width);

		flex-grow: 1;
		flex-shrink: 0;
	}

	container.content {
		display: grid;
		grid-template-columns: var(--columns);
		grid-template-rows: var(--rows);
		gap: var(--gap);

		justify-items: var(--justify);
		align-items: var(--align);

		width: 100%;
		height: auto;

		background: var(--colour-background);
		border-radius: var(--border-radius);

		padding: var(--is-or-not-padding);
		box-sizing: border-box;

		overflow-x: visible;
		overflow-y: var(--overflow-y);

		transition: var(--transition-background-colour);
	}
	
	container.placeholder {
		width: 100%;

		padding: var(--padding);
		box-sizing: border-box;
	}

	container.placeholder > string {
		text-align: center;
	}
</style>