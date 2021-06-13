<script lang='ts' context='module'>
	const gradientRemountIndexW = writable(1);
	let timeoutHandle: ReturnType<typeof setTimeout>;

	export function scheduleGradientRemount(): void {
		clearTimeout(timeoutHandle);
	
		timeoutHandle = setTimeout(() => {
			gradientRemountIndexW.update(
				(gradientRemountIndexWValue) => ++gradientRemountIndexWValue,
			);
		}, 1000);
	}
</script>

<script lang='ts'>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { push } from 'svelte-spa-router';
	import { Ctx } from '../../core/ctx';
	import Button from '../blocks/Button.svelte';
	import Input from '../blocks/Input.svelte';
	import Fragment from '../blocks/Fragment.svelte';
	import Dialog from '../blocks/Dialog.svelte';
	import Gradient2 from '../components/Gradient2.svelte';

	let name = '';
	let input: any;

	onMount(() => {
		input.focus();
	});

	function onSubmit() {
	
	}

	Ctx.globalHamburger = {
		'report bug': () => {
			document.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSd9Rgu6Wur1LbGHS8ce9hTRJLy06MrbOIrfvghNlvHJ6bOlhA/viewform?usp=sf_link';
		},
	};

	// Ctx.globalToasts = [
	// 	ToastItem.from({
	// 		duration: 100000,
	// 		text: 'yo! just a reminder issa preview, not everything works yet (:',
	// 		level: Levels.INFO,
	// 	} as ToastItem),
	// ];

	const customizeDialogIsActiveW = writable(false);
</script>

<Fragment
	isPadded={true}
	isInAnimated={true}
	isOutAnimated={true}
	height='100vh'
	width='100%'
	align='flex-end'
	justify='center'
>
	{#key $gradientRemountIndexW}
		<container
			class='gradient'
			_={$gradientRemountIndexW}
		>
			<Gradient2 />
		</container>
	{/key}

	<container
		class='content'
	>
		<container
			class='input'
		>
			<container>
				<Input 
					backgroundColour='transparent'
					activeBackgroundColour='transparent'
					depth={0}
					fontFamily='--font-family-1'
					fontSize='--font-size-big'
					isMovingLabel={false}
					labelTop='--font-size-big'
					height='min(30vw, 20rem)'
					labelFontSize='--font-size-big'
					indent={0}
					label='name…'
					buttonComponent={null}
					bind:value={name}
					on:submit={onSubmit}
					bind:this={input}
				/>
			</container>
		</container>
		<container
			class='buttons'
		>
			<container
				class='customize'
			>
				<Button
					backgroundColour='--colour-text-primary'
					hoverColour='--colour-text-secondary'
					textColour='--colour-background-primary'
					icon='settings'
					on:click={() => customizeDialogIsActiveW.set(true)}
				>
					customize
				</Button>
			</container>
			<container
				class='submit'
			>
				<Button
					icon='nat'
					on:click={onSubmit}
				>
					render it
				</Button>
			</container>
		</container>
	</container>
	<Dialog
		isDismissingOnBlur={true}
		isActiveW={customizeDialogIsActiveW} 
	>
	</Dialog>
</Fragment>

<style>
	container.gradient {
		position: fixed;
		top: 0;
		left: 0;
			
		height: 100vh;
		width: 100%;
	}

	container.content {
		height: auto;
		width: auto;

		display: grid;
		align-items: center;
		justify-items: flex-start;

		grid-template-columns: repeat(1, 1fr);
		grid-template-rows: repeat(2, min-content);
		gap: 32px 0;
		grid-template-areas:
			"input input"
			"customize submit";
	}

	container.buttons {
		display: flex;
		gap: 24px;
	}

	@media only screen and (max-width: 400px) {
		container.buttons {
			flex-direction: column;
		}
	}

	.input { 
		grid-area: input;

		display: flex;

		align-items: flex-end;

		height: 56px;
		width: 100%; 
	}

	.customize { 
		grid-area: customize; 
	}

	.submit { 
		grid-area: submit; 
	}

	.input > container {
		flex-grow: 1;
	}

</style>