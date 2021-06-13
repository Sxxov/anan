<script lang='ts'>
	import {
		onDestroy,
		onMount,
	} from 'svelte';
	import { Ctx } from '../../core/ctx';

	import Dialog from '../blocks/Dialog.svelte';
	import CallFragment from '../fragments/CallFragment.svelte';
	
	let dialog: Dialog;
	let orientation: number;

	function onAnswer({ detail: eventSource }: { detail: string }) {
		if (!Ctx.pingItem) {
			return;
		}
	
		Ctx.pingItem.isInDistress = true;

		if (eventSource === 'trigger') {
			Ctx.pingItem.compass = orientation;
		}

		Ctx.pingItem = Ctx.pingItem;
	}

	function onReject() {
		document.exitFullscreen().catch(() => {});

		Ctx.pingItem.isInDistress = false;
		Ctx.pingItem.compass = null;
		Ctx.pingItem = Ctx.pingItem;

		dialog.dismiss();
	}

	function onDeviceOrientation(event: DeviceOrientationEvent) {
		orientation = event.alpha ?? 0;
	}
</script>

<svelte:window on:deviceorientation={onDeviceOrientation} />

<Dialog
	roundness={0}
	maxHeight='unset'
	bind:this={dialog}
	{...$$restProps}
>
	<CallFragment
		on:answer={onAnswer}
		on:reject={onReject}
	/>
</Dialog>

<style>

</style>