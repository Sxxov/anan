<script lang='ts'>
	import { writable } from 'svelte/store';
	import { Shadow } from '../../core/shadow';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';
	import {
		fade,
		dropIn,
		dropOut,
	} from '../../core/transitioner';

	export let depth = 3;
	export let isDismissingOnBlur = false;
	export let isActive = true;
	export let isActiveW = writable(isActive);
	export let roundness: CSS = '--roundness';
	export let maxHeight: CSS = 'calc(100vh - var(--padding))';
	export function dismiss(): void {
		isActiveW.set(false);

		console.log($isActiveW);
	}
	export let onBlur = (): void => {
		if (isDismissingOnBlur) {
			isActiveW.set(false);
		}
	};

	let contentDomContent: HTMLDivElement;
	let allDomContent: HTMLDivElement;
	let overlayDomContent: HTMLDivElement;

	$: contentDomContent && Shadow.apply(depth, contentDomContent);
	$: allDomContent?.addEventListener('dismiss', onBlur);
</script>

{#if $isActiveW}
	<component
		in:dropIn
		out:dropOut={{
			duration: 100,
		}}
		class:inactive={!$isActiveW}
		bind:this={allDomContent}
	>
		
			<overlay
				transition:fade
				on:click={onBlur}
				bind:this={overlayDomContent}
			/>
			<container
				bind:this={contentDomContent}
				class='content'
				class:inactive={!$isActiveW}
				style='
					--border-radius: {CSSUtility.parse(roundness)};
					--max-height: {CSSUtility.parse(maxHeight)};
				'
			>
				<slot></slot>
			</container>
	</component>
{/if}

<style>
	component {
		display: grid;
		align-items: center;
		justify-items: center;

		visibility: visible;

		position: fixed;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 2;

		pointer-events: visible;
	}

	component.inactive {
		pointer-events: none;
	}

	container.content {
		height: min-content;
		width: min-content;

		display: grid;
		grid-template-rows: 1fr min-content;

		/* transform: translateY(0px);
		opacity: 1;
		transition: 
			all 0.3s var(--ease-fast-slow),
			min-height 0s,
			opacity 0s; */

		transform: matrix(1, 0, 0, 1, 0, 0);

		min-width: 240px;
		min-width: min(100%, 480px);
		min-height: 240px;
		max-height: var(--max-height);

		/* overflow: hidden; */

		z-index: 2;

		border-radius: var(--border-radius);

		box-shadow: var(--shadow);
	}

	container.content.inactive {
		/* transform: translateY(-20px);
		opacity: 0;

		transition: 
			all 0.2s var(--ease-slow-fast),
			opacity 0.1s 0.1s var(--ease-slow-fast); */

		box-shadow: var(--shadow-inactive);
	}
</style>