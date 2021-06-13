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

	function onDeviceOrientation(event: DeviceOrientationEvent) {
		orientation = event.gamma ?? 0;
	}

	function exitFullScreen() {
		document.exitFullscreen().catch(() => {});
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
		on:reject={() => (exitFullScreen(), dialog.dismiss())}
	/>
</Dialog>

<style>

</style>