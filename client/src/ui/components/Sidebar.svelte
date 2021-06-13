<script lang='ts'>
import { push } from 'svelte-spa-router';

import { writable } from 'svelte/store';
import { Breakpointer } from '../../core/breakpointer';
import { Businesser } from '../../core/businesser';
import { Ctx } from '../../core/ctx';
import { ToastItem } from '../../core/items/toast.item';

import FillOrTwoToneButton from '../blocks/buttons/FillOrTwoToneButton.svelte';
import Fragment from '../blocks/Fragment.svelte';
import Logo from '../blocks/Logo.svelte';

export let isTitlesEnabled = true;
export let isTitlesEnabledW = writable(isTitlesEnabled);
export let isEnabled = true;
export let isEnabledW = writable(isEnabled);

const IconAndTitleMap = {
	cottage: 'Home',
	tag: 'These',
	notifications: 'Aren\'t',
	mail: 'Actually',
	bookmark: 'Functional',
	subject: 'They\'re',
	account_circle: 'Purely',
	more_vert: 'Distractions',
};
const IconAndTitleEntries = Object.entries(IconAndTitleMap);
const activeIndex = 0;

// const mediaQuery1300 = window.matchMedia('only screen and (max-width: 1300px)');
// const mediaQuery400 = window.matchMedia('only screen and (max-width: 400px)');

const b600W = Breakpointer.Stores[600];
const b1300W = Breakpointer.Stores[1300];

$: $b600W.matches
	? $isEnabledW = false
	: $isEnabledW = true;

$: $b1300W.matches
	? $isTitlesEnabledW = false
	: $isTitlesEnabledW = true;

// onMount(() => {
// 	onMediaQuery1300Change(mediaQuery1300);
// 	onMediaQuery400Change(mediaQuery400);
// 	mediaQuery1300.addEventListener('change', onMediaQuery1300Change);
// 	mediaQuery400.addEventListener('change', onMediaQuery400Change);
// });

// onDestroy(() => {
// 	mediaQuery1300.removeEventListener('change', onMediaQuery1300Change);
// 	mediaQuery400.removeEventListener('change', onMediaQuery400Change);
// });

// function onMediaQuery1300Change(event: { matches: boolean }) {
// 	if (event.matches) {
// 		$isTitlesEnabledW = false;
// 	} else {
// 		$isTitlesEnabledW = true;
// 	}
// }

// function onMediaQuery400Change(event: { matches: boolean }) {
// 	if (event.matches) {
// 		$isEnabledW = false;
// 	} else {
// 		$isEnabledW = true;
// 	}
// }
</script>

{#if $isEnabledW}
	<Fragment
		isPadded={true}
		isInAnimated={true}
		isOutAnimated={true}
		padding='calc(var(--padding) / 2)'
		height='100vh'
		width='100%'
		justify='flex-start'
		rows={`repeat(${
			// + logo
			IconAndTitleEntries.length + 1
		}, 56px)`}
	>
		<container
			class='logo'
		>
			<Logo
				colour='--colour-text-primary'
				height='auto'
				width='auto'
			/>
		</container>
		{#each IconAndTitleEntries as [icon, title], i}
			<container
				class='button'
			>
				{#key $isTitlesEnabledW}
					<FillOrTwoToneButton
						backgroundColour='transparent'
						{icon}
						isTwoTone={i !== activeIndex}
						fillColour={i === activeIndex ? '--colour-accent-primary' : '--colour-text-secondary'}
						iconSize='1.4rem'
						isIconOnly={!$isTitlesEnabledW}
					>
						{#if $isTitlesEnabledW}
							<heading
								class:active={i === activeIndex}
							>
								{title}
							</heading>
						{/if}
					</FillOrTwoToneButton>
				{/key}
			</container>
		{/each}
		<container
				class='button logout'
			>
			{#key $isTitlesEnabledW}
				<FillOrTwoToneButton
					backgroundColour='transparent'
					icon='logout'
					isTwoTone={true}
					fillColour={'--colour-text-secondary'}
					iconSize='1.4rem'
					isIconOnly={!$isTitlesEnabledW}
					on:click={async () => {
						await Businesser.logoutUser();
						Ctx.globalToasts = [
							ToastItem.from({
								text: 'Logging out...'
							}),
							...Ctx.globalToasts,
						]
						await push('/authenticate');
					}}
				>
					{#if $isTitlesEnabledW}
						<heading>
							Logout
						</heading>
					{/if}
				</FillOrTwoToneButton>
			{/key}
		</container>
	</Fragment>
{/if}

<style>
	heading {
		font-size: 1.2rem;
		letter-spacing: -0.04em;
	}

	heading.active {
		color: var(--colour-accent-primary);
	}

	container.button:hover * {
		color: var(--colour-accent-primary);
	}

	container.logo {
		padding-left: calc(max(var(--border-radius), 24px) - 16px);
	}

	.button.logout {
		align-self: flex-end;
	}
</style>