<script lang='ts'>
	import {
		onMount,
		onDestroy,
	} from 'svelte';
	import { writable } from 'svelte/store';
	import Logo from './Logo.svelte';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';
	import Spacer from './Spacer.svelte';
	import {
		dropIn as dropInRaw,
		dropOut as dropOutRaw,
		noop,
	} from '../../core/transitioner';

	// @export
	export let expandedHeightW = writable(0);
	export let computedPaddingW = writable(0);
	export let baseHeightW = writable(0);

	export let title: string | undefined = undefined;
	export let appBarPadding: CSS = '--padding';
	export let appBarPaddingW = writable(appBarPadding);
	export let contentPadding = '0';
	export let contentPaddingW = writable(contentPadding);
	export let isInAnimated = false;
	export let isOutAnimated = false;
	export let backgroundColour: CSS = 'transparent';
	export let isSpaced = true;
	export let isSpacedW = writable(isSpaced);
	export let titleCase:
	| 'upper'
	| 'lower'
	| undefined = undefined;
	export let borderRadius: CSS = 0;

	const dropIn = isInAnimated ? dropInRaw : noop;
	const dropOut = isOutAnimated ? dropOutRaw : noop;

	let appBarContainerDomContent: HTMLDivElement;
	let appBarContainerDomContentComputedStyle: CSSStyleDeclaration;

	onMount(() => {
		setTimeout(onResize, 0);

		window.addEventListener(
			'resize',
			onResize,
		);
	});

	onDestroy(() => {
		window.removeEventListener(
			'resize',
			onResize,
		);
	});

	function onResize() {
		appBarContainerDomContentComputedStyle = getComputedStyle(appBarContainerDomContent);

		computedPaddingW.set(
			Number.parseFloat(
				appBarContainerDomContentComputedStyle.paddingLeft,
			),
		);
		baseHeightW.set(
			appBarContainerDomContent.clientHeight
			- Number.parseFloat(
				appBarContainerDomContentComputedStyle.paddingTop,
			) * 2,
		);
		expandedHeightW.set(
			$baseHeightW
			+ $computedPaddingW * 2,
		);
	}
</script>

<component>
	<container
		class='app-bar'
		bind:this={appBarContainerDomContent}
		style='
			--app-bar-padding: {CSSUtility.parse($appBarPaddingW)};
			--content-padding: {CSSUtility.parse($contentPaddingW)};
			--colour-background: {CSSUtility.parse(backgroundColour)};
			--border-radius: {CSSUtility.parse(borderRadius)};
		'
		in:dropIn
		out:dropOut
	>		
		<container
			class='slot'
		>
			<slot name='background' />
		</container>

		<container
			class='content left'
		>
			{#if title == null}
				<container class='logo'>
					<Logo
						colour='--colour-text-primary'
					/>
				</container>
			{:else}
				<heading>
					{
						(
							titleCase === 'upper'
							&& title.toUpperCase()
						)
						|| (
							titleCase === 'lower'
							&& title.toLowerCase()
						)
						|| title
					}
				</heading>
			{/if}
		</container>

		<container 
			class='content right'
		>
			<slot />
		</container>
	</container>

	{#if $isSpacedW}
		<container
			in:dropIn
			out:dropOut
		>
			<Spacer
				heightW={expandedHeightW}
			/>
		</container>
	{/if}
</component>

<style>
	container.slot {
		display: flex;
		justify-content: center;
		align-items: center;

		height: 100%;
		width: 100%;

		position: absolute;
		overflow: hidden;
	}

	container.app-bar {
		padding: var(--app-bar-padding);

		position: fixed;
		top: 0;
		/* width: calc(100% - var(--padding) * 2); */
		width: 100%;
		box-sizing: border-box;
		z-index: 1;

		height: auto;

		display: grid;
		grid-template-columns: repeat(2, auto);
		grid-template-rows: auto;

		align-items: center;

		background: var(--colour-background);
		border-radius: var(--border-radius);

		transition: var(--transition-background-colour);
	}

	container.content.left {
		justify-self: flex-start;
	}
	container.content.right {
		justify-self: flex-end;
	}

	container.content {
		padding: var(--content-padding);
	}

	container.logo {
		padding: 0.5rem 0;
	}

	heading {
		font-size: 1.5rem;
		line-height: 3rem;
		/* white-space: nowrap; */
	}
</style>