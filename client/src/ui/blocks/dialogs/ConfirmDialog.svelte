<script lang='ts'>
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import Dialog from '../Dialog.svelte';
	import Button from '../Button.svelte';
	import strings from '../../../resources/strings';
	import AppBarScene from '../scenes/AppBarFragment.svelte';
	import type { CSS } from '../../../resources/utilities';

	export let title = 'Confirm.dialog';
	export let sceneColumns = 'auto';
	export let sceneRows = 'auto';
	export let sceneGap = '0';
	export let depth = 3;
	export let isDismissingOnBlur = true;
	export let isActiveW = writable(true);
	export let confirmButtonBackgroundColour: CSS = '--colour-ok-secondary';
	export let confirmButtonHoverColour: CSS = '--colour-ok-primary';

	const dispatch = createEventDispatcher();
	let dialog: Dialog;
</script>

<Dialog
	{depth}
	{isDismissingOnBlur}
	{isActiveW}
	bind:this={dialog}
>
	<AppBarScene
		{title}
		columns={sceneColumns}
		rows={sceneRows}
		gap={sceneGap}
		isRounded={true}
		appBarProps={{
			backgroundColour: '--colour-background-secondary',
		}}
	>
		<slot></slot>
	</AppBarScene>
	<container class='buttons'>
		<Button 
			icon='close'
			width='100%'
			backgroundColour='--colour-background-primary'
			hoverColour='--colour-background-secondary'
			rippleColour='--colour-text-secondary'
			on:click={() => {
				dialog.dismiss();
				dispatch('cancel');
			}}
		>
			{strings.common.info.CANCEL}
		</Button>
		<Button 
			icon='adjust'
			width='100%'
			backgroundColour={confirmButtonBackgroundColour}
			hoverColour={confirmButtonHoverColour}
			rippleColour='--colour-text-secondary'
			on:click={() => {
				dialog.dismiss();
				dispatch('confirm');
			}}
		>
			{strings.common.info.CONFIRM}
		</Button>
	</container>
</Dialog>

<style>
	container.buttons {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		background: var(--colour-background-primary);
		border-radius: var(--roundness);
	}
</style>