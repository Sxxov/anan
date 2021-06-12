<script lang='ts'>
	import { writable } from 'svelte/store';
	import {
		push,
		location,
	} from 'svelte-spa-router';
	import {
		ResponsiveUtility,
		CSSUtility,
	} from '../../resources/utilities';
	import Button from './Button.svelte';
	import Hamburger from './Hamburger.svelte';
	import DarkModeToggleButton from './buttons/DarkModeToggleButton.svelte';

	// @export
	export let isActiveW = writable(false);

	export let routes: Record<string, string> = {};
	export let backgroundColour = '--colour-background-primary';
	export let hoverColour = '--colour-background-secondary';
	export let textColour = '--colour-text-primary';
	export let rippleColour = '--colour-text-secondary';
	export let barToppingWidth = 120;
	export let barToppingHeight = '100%';
	export let hamburgerProps = {};

	const { currentBreakpointW } = ResponsiveUtility;
	const routeKeys = Object.keys(routes);
	const toppings: Record<string, () => void> = (() => {
		const result: typeof toppings = {};

		routeKeys.forEach((route) => {
			result[routes[route]] = () => href(route);
		});

		return result;
	})();

	$: isSalad = !($currentBreakpointW < ResponsiveUtility.Breakpoints.TABLET);

	function href(destination: string) {
		push(destination);

		isActiveW.set(false);

		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
	}
</script>

<component
	class='{!isSalad ? 'hamburger' : 'salad'}'
	style='
		--colour-background: {CSSUtility.parse(backgroundColour)};
	'
>
	<DarkModeToggleButton />
	{#if !isSalad}
		<Hamburger
			{toppings}
			{...hamburgerProps}
		/>
	{:else}
		<container
			class='bar'
			style='
				--width: calc({CSSUtility.parse(barToppingWidth)} * {routeKeys.length});
				--height: {CSSUtility.parse(barToppingHeight)};
			'
		>
			<container
				class='content'
			>
				{#each routeKeys as routeKey}
					<Button
						on:click={() => href(routeKey)}
						icon=''
						backgroundColour='{
							routeKey === `${$location}/`.match(/.+?(?=\/)/)?.[0]
								? CSSUtility.parse(hoverColour)
								: '#0000'
						}'
						textColour={CSSUtility.parse(textColour)}
						hoverColour={CSSUtility.parse(hoverColour)}
						rippleColour={CSSUtility.parse(rippleColour)}
						width='100%'
						
					>
						{routes[routeKey]}
					</Button>
				{/each}
			</container>
		</container>
	{/if}
</component>

<style>
	component {
		height: 100%;

		display: grid;
		grid-auto-flow: column;
		align-items: center;
		justify-items: center;
	}

	container.bar {
		height: var(--height);
		width: var(--width);
	}

	container.bar > .content {
		height: 100%;
		width: 100%;

		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto;
		grid-auto-flow: column;

		justify-items: center;
		align-items: center;

		/* gap: 14px; */
	}

	component.salad {
		height: 100%;
	}
</style>