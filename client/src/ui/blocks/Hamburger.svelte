<script lang='ts'>
	/** @deprecated */
	import { writable } from 'svelte/store';
	import { fade } from '../../core/transitioner';
	import LottieToggleButton from './buttons/LottieToggleButton.svelte';
	import hamburger from '../../raw/lottie/hamburger.json';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';
	import Button from './Button.svelte';

	export let isActiveW = writable(false);
	export let toppings: Record<string, () => void>;
	export let buttonSize = '2rem';
	export let backgroundColour = '--colour-background-primary';
	export let menuWidth = 420;
	export let menuTopOffset = '--padding';
	export let menuTopOffsetW = writable<CSS>(menuTopOffset);
	
	let lottieToggleButton: LottieToggleButton;
</script>

{#if toppings}
	<component
		style='
			--colour-background: {CSSUtility.parse(backgroundColour)};
			--menu-top-offset: {CSSUtility.parse($menuTopOffsetW)}
		'
	>
		<container
			class='button {$isActiveW ? 'boosted' : ''}'
			style='
				--button-size: {CSSUtility.parse(buttonSize)};
			'
		>
			<LottieToggleButton
				animationData={hamburger}
				bind:this={lottieToggleButton}
				bind:isActiveW
				overrideColour='--colour-text-primary'
			/>
		</container>

		{#if $isActiveW}
			<overlay 
				on:click={() => isActiveW.set(false)}
				transition:fade
			/>
		{/if}
		
		<container
			class='menu {$isActiveW ? '' : 'inactive'}'
			style='
				--width: {CSSUtility.parse(menuWidth)};
			'
		>
			<container
				class='content'
			>
				{#each Object.keys(toppings) as toppingKey}
					<container
						class='topping'
					>
						<Button
							on:click={() => {
								isActiveW.set(false);

								toppings[toppingKey]();
							}}
							icon='arrow_forward'
							backgroundColour='--colour-background-primary'
							textColour='--colour-text-primary'
							hoverColour='--colour-background-secondary'
							rippleColour='--colour-accent-primary'
							width='100%'
							height='100%'
							roundness='0'
						>
							{toppingKey}
						</Button>
					</container>
				{/each}
			</container>
		</container>
	</component>
{/if}

<style>
	component {
		height: 100%;

		display: grid;
		align-items: center;
		justify-items: center;
	}

	container.button {
		position: relative;

		width: var(--button-size);

		z-index: 0;

		transition: z-index 0s 0.2s;
	}

	container.button.boosted {
		z-index: 3;

		transition: unset;
	}

	container.menu {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;

		justify-items: center;
		align-items: center;

		position: fixed;
		top: var(--menu-top-offset);
		right: 0;

		height: calc(100% - var(--menu-top-offset));
		width: var(--width);
		max-width: 100%;

		background: var(--colour-background);

		/* padding: var(--padding); */
		box-sizing: border-box;

		z-index: 2;

		transform: translateX(0);
		opacity: 1;	

		transition: 
			all 0.4s var(--ease-fast-slow),
			top 0s,
			height 0s,
			opacity 0s;
	}

	container.menu.inactive {
		transform: translateX(calc(var(--width) / 4));
		pointer-events: none;
		opacity: 0;
		
		transition: 
			all 0.2s var(--ease-slow-fast),
			top 0s,
			height 0s,
			opacity 0s 0.2s var(--ease-slow-fast);
	}

	container.menu > .content {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto;

		justify-items: center;
		align-items: center;

		/* gap: 56px; */

		height: 100%;
		width: 100%;
	}

	overlay {
		top: var(--menu-top-offset);
		height: calc(100% - var(--menu-top-offset));
	}

	container.menu > .content > .topping {
		width: 100%;
		height: 100%;
	}
</style>