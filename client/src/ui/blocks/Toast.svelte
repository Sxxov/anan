<script lang='ts'>
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';
	import Hint from './Hint.svelte';
	import {
		dropIn,
		dropOut,
	} from '../../core/transitioner';
	import Button from './Button.svelte';
	import type { ToastItem } from '../../core/items/toast.item';
	import { LevelColours } from '../../core/enums/level.enum';

	export let toasts: ToastItem[] = [];
	export let toastsW = writable(toasts);

	const scheduledUIDs: string[] = [];

	if ($toastsW == null) {
		$toastsW = [];
	}

	$: (
		$toastsW.forEach((toast) => scheduleDismiss(toast.uid!, toast.duration!))
	);

	function dismiss(uid: string) {
		$toastsW
			.splice(
				$toastsW
					.findIndex((toast) => toast.uid === uid),
				1,
			);
		$toastsW = $toastsW;
	}

	function scheduleDismiss(uid: string, duration: number) {
		if (scheduledUIDs.includes(uid)) {
			return;
		}

		if (duration < 0) {
			return;
		}

		setTimeout(() => dismiss(uid), duration);

		scheduledUIDs.push(uid);
	}
</script>

{#if $toastsW.length !== 0}
	<component>
		{#each $toastsW as toast}
			<container
				style='
					--colour-toast: {
						// @ts-expect-error
						CSSUtility.parse(LevelColours[toast.level])
					}
				'
				in:dropIn
				out:dropOut
			>
				<Hint
					level={toast.level}
					overrideColour='--colour-background-primary'
				>
					{toast.text}
				</Hint>
				<Button 
					icon='clear'
					backgroundColour='transparent'
					textColour='--colour-background-primary'
					hoverColour='#fff2'
					padding='4px 8px'
					height={32}
					on:click={
						() => dismiss(
							// @ts-expect-error
							toast.uid
						)
					}
				/>
			</container>
		{/each}
	</component>
{/if}

<style>
	component {
		position: fixed;

		right: 0;
		bottom: 0;

		margin: var(--padding);

		z-index: 1000;
	}

	container {
		background: var(--colour-toast);

		padding: 4px 24px 4px 32px;

		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;

		border-radius: var(--roundness);

		width: max-content;
		max-width: 25vw;
		max-width: min(400px, calc(61vw));

		margin-top: var(--padding);
	}
</style>