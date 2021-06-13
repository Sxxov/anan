<script lang='ts'>
	import {
		createEventDispatcher,
		onDestroy,
		onMount,
	} from 'svelte';
	import { writable } from 'svelte/store';
	import { push } from 'svelte-spa-router';
	import { Ctx } from '../../core/ctx';
	import Button from '../blocks/Button.svelte';
	import Input from '../blocks/Input.svelte';
	import Fragment from '../blocks/Fragment.svelte';
	import Dialog from '../blocks/Dialog.svelte';
	import Gradient2 from '../components/Gradient2.svelte';
	import AppBarFragment from '../blocks/fragments/AppBarFragment.svelte';
	import ClosableAppBar from '../blocks/appBars/ClosableAppBar.svelte';
	import ExpandingButton from '../components/ExpandingButton.svelte';
	import Spacer from '../blocks/Spacer.svelte';
	import Contact from '../components/Contact.svelte';
	import {
		dropIn,
		dropOut,
	} from '../../core/transitioner';

	const dispatch = createEventDispatcher();

	export let isAnswered = false;
	export let isAnsweredW = writable(isAnswered);

	let timerHandle: ReturnType<typeof setInterval> | null;
	let timerSeconds = 0;
	let clock = getTime();
	let clockHandle: ReturnType<typeof setInterval>;

	onMount(async () => {
		const date = new Date();

		await new Promise((resolve) => setTimeout(resolve, 60 - date.getSeconds()));

		clockHandle = setInterval(() => {
			clock = getTime();
		}, 60000);
	});

	onDestroy(() => {
		clearInterval(clockHandle);
	});

	function getTime() {
		const date = new Date();

		return `${
			String(date.getHours()).padStart(2, '0')
		}:${
			String(date.getMinutes()).padStart(2, '0')
		}`;
	}

	$: $isAnsweredW
		? startTimer()
		: stopTimer();

	$: timer = `${
		String(Math.floor(timerSeconds / 60)).padStart(2, '0')
	}:${
		String(timerSeconds).padStart(2, '0')
	}`;
	
	onDestroy(() => {
		stopTimer();
	});

	function stopTimer() {
		clearInterval(timerHandle!);
		timerSeconds = 0;
		timerHandle = null;
	}

	function startTimer() {
		timerHandle ??= setInterval(() => ++timerSeconds, 1000);
	}
</script>


<Fragment
	isPadded={false}
	isInAnimated={true}
	isOutAnimated={true}
	height='100vh'
	width='100vw'
	align='center'
	justify='center'
	rows='min-content 1fr'
>
	<!-- <container 
		slot='appBar'
	>
		<ClosableAppBar
			title=''
			isSpaced={false}
		/>
	</container> -->

	<container
		class='status'
	>
		<container
			class='time'
		>
			<string>
				{clock}
			</string>
		</container>
		<icon>
			fmd_good
		</icon>
		&nbsp;
		<icon>
			network_wifi
		</icon>
		&nbsp;
		<icon>
			signal_cellular_alt
		</icon>
		&nbsp;
		<icon>
			battery_full
		</icon>
	</container>

	<container class='gradient'>
		<Gradient2 />
	</container>

	<container
		class='content'
	>
		<container
			class='contact'
		>
			<string>
				{#if $isAnsweredW}
					{timer}
				{:else}
					Incoming call
				{/if}
			</string>
			<Spacer
				height={72}
			/>
			<Contact 
				contact={Ctx.topic.contact}
				content={Ctx.topic.content}
			/>
		</container>
		<container
			class='mid'
		>

		</container>
		<container
			class='actions'
			class:answered={$isAnsweredW}
		>
			{#if !$isAnsweredW}
				<container
					class='answer'
					in:dropIn
				>
					<ExpandingButton
						isBlinkerEnabled={true}
						isArrowEnabled={true}
						backgroundColour='radial-gradient(circle, #0000 0%, var(--colour-ok-primary) 100%)'
						buttonColour='--colour-ok-primary'
						hoverColour='--colour-ok-secondary'
						icon='call'
						iconSize='2em'
						size={72}
						on:click={() => (dispatch('answer', 'click'), $isAnsweredW = true)}
						on:trigger={() => (dispatch('answer', 'trigger'), $isAnsweredW = true)}
					/>
				</container>
			{/if}
			{#key $isAnsweredW}
				<container
					class='reject'
					in:dropIn
					_={$isAnsweredW}
				>
					<ExpandingButton
						isBlinkerEnabled={false}
						isArrowEnabled={false}
						backgroundColour='radial-gradient(circle, #0000 0%, var(--colour-error-primary) 100%)'
						buttonColour='--colour-error-primary'
						hoverColour='--colour-error-secondary'
						icon='call_end'
						iconSize='2em'
						size={72}
						on:click={() => (dispatch('reject', 'click'))}
						on:trigger={() => (dispatch('reject', 'trigger'))}
					/>
				</container>
			{/key}
		</container>
	</container>
</Fragment>

<style>
	container.gradient {
		position: fixed;
		top: 0;
		left: 0;
			
		height: 100vh;
		width: 100%;

		z-index: 0;
	}

	container.content {
		height: 100%;
		width: 100%;
		display: grid;

		grid-template-columns: 1fr;
		grid-template-rows: min-content 56px auto;
		grid-template-areas: 
			"contact"
			"mid"
			"actions";

		align-items: center;
		justify-items: center;

		z-index: 1;
	}

	container.actions {
		display: grid;
		width: 100%;

		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: auto;
		grid-template-areas: 
			"answer reject";

		align-items: center;
		justify-items: center;
	}

	container.actions.answered {
		grid-template-columns: 1fr;
		grid-template-rows: auto;
		grid-template-areas: 
			"reject";
	}

	container.answer {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		grid-area: answer;
		justify-self: flex-start;
	}

	container.reject {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		
		grid-area: reject;
		justify-self: flex-end;
	}

	container.contact {
		grid-area: contact;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	container.mid {
		grid-area: mid;
	}

		
	container.status {
		width: 100%;
		height: 4rem;

		padding: 1.5rem;
    	box-sizing: border-box;

		z-index: 1;

		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	container.status > .time {
		margin-right: auto;
	}

	container.status > .time > string {
		margin: 0;
   		margin-top: 1px;
	}
</style>