<script lang='ts'>
	import { writable } from 'svelte/store';
	import type { CSS } from '../../resources/utilities';

	import FillOrTwoToneButton from '../blocks/buttons/FillOrTwoToneButton.svelte';
	import Fragment from '../blocks/Fragment.svelte';
	import Logo from '../blocks/Logo.svelte';

	export let isTitlesEnabled = true;
	export let isTitlesEnabledW = writable(isTitlesEnabled);

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
</script>

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
			<FillOrTwoToneButton
				backgroundColour='transparent'
				{icon}
				isTwoTone={i !== activeIndex}
				fillColour={i === activeIndex ? '--colour-accent-primary' : '--colour-text-secondary'}
				iconSize='1.4rem'
			>
				{#if $isTitlesEnabledW}
					<heading
						class:active={i === activeIndex}
					>
						{title}
					</heading>
				{/if}
			</FillOrTwoToneButton>
		</container>
	{/each}
</Fragment>

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
</style>