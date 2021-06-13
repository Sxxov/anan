<script lang='ts' context='module'>
	const PATH_DELIMITER = ' → ';
</script>

<script lang='ts'>
	import { Ctx } from '../../core/ctx';
	import ClosableAppBar from './appBars/ClosableAppBar.svelte';
	import Dialog from './Dialog.svelte';
	import { Levels } from './Hint.svelte';
	import Input from './Input.svelte';
	import AppBarScene from './scenes/AppBarFragment.svelte';
	import { ToastItem } from './Toast.svelte';
	import {
		dropIn,
		dropOut,
	} from '../../core/transitioner';

	export let label = '';
	export let input: Record<string | number, any>;
	export let isExpanded = true;
	export let indent = 0;
	export let targetKey: string | undefined = undefined;
	export let path = '';

	function isRecord(value: any) {
		return typeof value === 'object' && value !== null;
	}
</script>

{#if label}
	<string
		style='
			text-indent: inherit;
		'
	>
		{@html '&middot;'} 
		{label}:
		<span 
			class='a'
			on:click={() => isExpanded = !isExpanded}
		>
			{#if isExpanded}
				<icon>
					undo
				</icon>
			{:else}
				<icon>
					open_in_full
				</icon>
				{'{...}'}
			{/if}
		</span>
	</string>
{/if}
{#if isExpanded}
	{#each Object.entries(input) as [key, value], i}
		<string
			style='
				text-indent: {indent * 16}px;
			'
			in:dropIn={{ delay: i * 30 }}
			out:dropOut
		>
			{#if isRecord(value)}
					<!-- {key}: -->
					<svelte:self
						input={value}
						isExpanded={false}
						indent={indent + 1}
						label={key}
						path={`${path}${PATH_DELIMITER}${key}`}
					/>
			{:else}
				{@html '&middot;'} {key}: <span 
												class='a'
												on:click={() => targetKey = key}
											>
												{value}
											</span>
				
			{/if}
		</string>
	{/each}
{/if}
{#if targetKey != null}
	<Dialog
		isActive={true}
		isDismissingOnBlur={true}
		onBlur={() => targetKey = undefined}
	>
		<AppBarScene
			title={`${path}${PATH_DELIMITER}${targetKey}`}
			isRounded={true}
			appBarComponent={ClosableAppBar}
			appBarProps={{
				backgroundColour: '--colour-background-secondary',
				onBlur: () => {targetKey = undefined}
			}}
		>
			<Input
				label='value'
				value={input[targetKey]}
				on:submit={({ detail }) => {
					if (detail === '') {
						Ctx.globalToasts = [
							...Ctx.globalToasts ?? [],
							ToastItem.from({
								text: 'no value provided',
								level: Levels.WARN,
							}),
						];

						return;
					}

					// @ts-expect-error
					input[targetKey] = detail;

					targetKey = undefined;
				}}
			/>
		</AppBarScene>
	</Dialog>
{/if}

<style>
	.a {
		cursor: pointer;
		color: var(--colour-accent-primary);

		-webkit-tap-highlight-color: transparent;

		transition: opacity 0.3s var(--ease-fast-slow),
					color 0.3s var(--ease-slow-slow);
	}

	.a:hover {
		color: var(--colour-accent-secondary);
		text-decoration: underline;
	}

	.a:active {
		opacity: 0;
	}
</style>
