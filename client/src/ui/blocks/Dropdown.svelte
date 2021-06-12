<script lang='ts' context='module'>
	/* eslint-disable import/order, import/no-duplicates */
	import { Item } from '../../core/blocks/item';
	import { RandomUtility } from '../../resources/utilities';

	export class DropdownItem extends Item {
		label = false;
		id = RandomUtility.string();
		text!: string;
		icon = 'done';
		backgroundColour: CSS = '--colour-text-primary';
		hoverColour: CSS = '--colour-text-secondary';
		rippleColour: CSS = '--colour-background-secondary';
		textColour: CSS = '--colour-background-primary';
	}
</script>

<script lang='ts'>
	import {
		onMount,
	} from 'svelte';
	import { writable } from 'svelte/store';
	import {
		dropIn,
		dropOut,
	} from '../../core/transitioner';
	import Button from './Button.svelte';

	import Input from './Input.svelte';
	import type { CSS } from '../../resources/utilities';
	import { CSSUtility } from '../../resources/utilities';

	export let isActiveW = writable(false);
	export let items: DropdownItem[] = [];
	export let itemsW = writable(items);
	export let height: CSS = 56;
	export let width: CSS = 'auto';
	export let itemsHeight: CSS = 192;
	export let itemsHeightW = writable(itemsHeight);
	export let label = '...';
	export let selectedItem: DropdownItem | undefined = undefined;
	export let selectedItemW = writable(selectedItem);
	export let selectedId: string | undefined = undefined;
	export let selectedIdW = writable(selectedId);
	export let value = '';
	export let isPending = false;
	export let isPendingW = writable(isPending);

	const LOADING_ITEM = DropdownItem.from({
		label: true,
		icon: 'border_clear',
		text: 'Loading, give me a bit...',
		id: '...',
	});
	const NO_ITEMS_ITEM = DropdownItem.from({
		label: true,
		icon: 'clear',
		text: 'No items found',
		id: '404',
	});

	let currentItems = $itemsW;
	let filteredItems = $itemsW;
	let input: any;
	const isButtonFocusedW = writable(false);

	$: if ($selectedIdW != null
		&& $selectedItemW == null) {
		$selectedItemW = $itemsW.find((item) => item.id === $selectedIdW);
	}

	$: if ($selectedItemW != null) {
		onSelect($selectedItemW);
	}

	$: buttonProps = {
		icon: $isActiveW
			? 'keyboard_arrow_up'
			: 'keyboard_arrow_down',
		isFocusedW: isButtonFocusedW,
	};

	// when a value is gotten in `itemsW`, set `isPendingW` to false
	const unsubscribeFromItemsW = itemsW.subscribe((itemsWValue) => {
		if (itemsWValue == null
			|| itemsWValue.length === 0) {
			return;
		}

		isPendingW.set(false);

		unsubscribeFromItemsW();
	});

	onMount(() => {
		input.onFocus = (() => {
			value = '';
	
			$isActiveW = true;
		});

		input.onBlur = (() => {
			scheduleBlur();

			// for when user clicks outside of dropdown
			window.addEventListener('click', function runScheduledBlurOnce() {
				runScheduledBlur();

				window.removeEventListener('click', runScheduledBlurOnce);
			});
		});
	});

	// filter items according to item text
	$: filteredItems = $itemsW.filter((item) => item.text.indexOf(value) !== -1);

	$: if (filteredItems.length === 0) {
		filteredItems = [
			$isPendingW
				? LOADING_ITEM
				: NO_ITEMS_ITEM,
		];
	}

	// if `filteredItems` differ from `currentItems`
	$: if (
		filteredItems.length !== currentItems.length
		|| filteredItems.some(
			(filteredItem, i) => currentItems[i] !== filteredItem,
		)
	) {
		currentItems = filteredItems;
	}

	function onSelect(item: DropdownItem | undefined) {
		if (item == null) {
			return;
		}

		$isActiveW = false;
		value = item.text;
		$selectedItemW = item;
		$selectedIdW = item.id;
	}
	
	function onSubmit() {
		// if inactive, activate by taking focus
		if (!$isActiveW) {
			input.focus();

			return;
		}

		// run blur if onBlur scheduled one/haven't timed out
		runScheduledBlur();
	}

	let isBlurScheduled = false;

	function scheduleBlur() {
		isBlurScheduled = true;
	}

	function runScheduledBlur() {
		if (!isBlurScheduled) {
			return;
		}

		$isActiveW = false;
		isBlurScheduled = false;

		if (value === ''
			&& $selectedItemW != null) {
			onSelect($selectedItemW);
		}
	}
</script>

<component>
	<Input
		isActiveW={isActiveW}
		{buttonProps}
		{label}
		on:submit={onSubmit}
		bind:this={input}
		bind:value
		{width}
		{height}
		isMovingLabel={false}
	/>
	<container
		class='items all'
		style='
			--height: {CSSUtility.parse($itemsHeightW)};
		'
	>
		<container
			class='items content'
			style='
				--pointer-events: {$isActiveW ? 'unset' : 'none'};
			'
		>
			{#if $isActiveW}
				{#each currentItems as item, i}
					<container
						class='item'
						in:dropIn={{delay: i * 50}}
						out:dropOut={{
							delay: i * 50, 
							// easing: easings.expoOut, 
							duration: 100
						}}
					>
						<Button
							width='100%'
							textAlign='left'
							icon={item.icon}
							backgroundColour={item.backgroundColour}
							hoverColour={item.hoverColour}
							rippleColour={item.rippleColour}
							textColour={item.textColour}
							on:click={() => onSelect(item)}
							isDisabled={item.label}
						>
							{item.text}
						</Button>
					</container>
				{/each}
			{/if}
		</container>
	</container>
</component>

<style>
	container.items.all {
		height: 0;
		width: 100%;

		transform: matrix(1, 0, 0, 1, 0, 0);
	}

	container.items.content {
		width: 100%;
		position: absolute;
		height: var(--height);
		overflow: auto;

		display: flex;
		flex-direction: column;

		pointer-events: var(--pointer-events);
	}

	container.items.content > * {
		margin-top: 8px;
	}

	.item {
		width: 100%;
	}
</style>