<script lang='ts'>
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import Dialog from '../Dialog.svelte';
	import Button from '../Button.svelte';
	import strings from '../../../resources/strings';
	import AppBarScene from '../scenes/AppBarFragment.svelte';

	export let title = 'Ok.dialog';
	export let sceneColumns = 'auto';
	export let sceneRows = 'auto';
	export let sceneGap = '0';
	export let depth = 3;
	export let isDismissingOnBlur = true;
	export let isActiveW = writable(true);

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
			icon='adjust'
			width='100%'
			backgroundColour='--colour-ok-primary'
			hoverColour='--colour-ok-secondary'
			rippleColour='--colour-text-secondary'
			on:click={() => {
				dialog.dismiss();
				dispatch('ok');
			}}
		>
			{strings.common.info.OK}
		</Button>
	</container>
</Dialog>

<style>
	container.buttons {
		background: var(--colour-background-primary);
		border-radius: var(--roundness);
	}
</style>