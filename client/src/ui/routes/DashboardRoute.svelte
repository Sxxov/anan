<script lang='ts'>
	import { push } from 'svelte-spa-router';

	import { writable } from 'svelte/store';
	import type { Store } from '../../../../common/src/core/blocks/store';
	import { Ctx } from '../../core/ctx';
	import {
		Levels, ToastItem,
	} from '../../core/items/toast.item';

	import Button from '../blocks/Button.svelte';
	import Fragment from '../blocks/Fragment.svelte';
	import Image from '../blocks/Image.svelte';
	import CallDialog from '../components/CallDialog.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import Tweet from '../components/Tweet.svelte';

	export let isDemoMode = false;

	if (!isDemoMode && (
		Ctx.pingItem == null
		|| Ctx.pingItem.token == null
	)) {
		push('/authenticate');
	}

	const isCallDialogActiveW = writable(false);
	const signalsW: Store<typeof Ctx.signals> = Ctx.s.signals;
	let isLocationGotten = false;
	let currentPosition: GeolocationPosition;
	let currentOrientation: number | null;
	let callDialogContainer: HTMLDivElement;

	if (!isDemoMode
		&& Ctx.pingItem) {
		Ctx.globalToasts = [
			ToastItem.from({
				text: 'Attempting to get location...',
			}),
			...Ctx.globalToasts,
		];

		setTimeout(() => {
			if (!isLocationGotten) {
				Ctx.globalToasts = [
					ToastItem.from({
						duration: 5000,
						text: 'Hmm, I can\'t seem to get an accurate location... Is GPS on?',
						level: Levels.WARN,
					}),
					...Ctx.globalToasts,
				];
			}
		}, 10000);

		navigator.geolocation.watchPosition(
			(position) => {
				currentPosition = position;

				if (position.coords.accuracy == null
					|| position.coords.accuracy > 100) {
					return;
				}

				if (!isLocationGotten) {
					isLocationGotten = true;

					Ctx.globalToasts = [
						ToastItem.from({
							text: 'Location locked in!',
							level: Levels.OK,
						}),
						...Ctx.globalToasts,
					];
				}

				Ctx.pingItem.location ??= [0, 0];
				Ctx.pingItem.location[0] = position.coords.latitude;
				Ctx.pingItem.location[1] = position.coords.longitude;
				Ctx.pingItem = Ctx.pingItem;
			},
			(err) => {
				console.error(err);
				Ctx.globalToasts = [
					ToastItem.from({
						duration: -1,
						text: 'Error getting location. Check your browser\'s permissions.',
						level: Levels.ERROR,
					}),
					...Ctx.globalToasts,
				];
			},
			{
				enableHighAccuracy: true,
			},
		);
	}
</script>

<svelte:window on:deviceorientation={(event) => currentOrientation = event.gamma} />

<Fragment
	isPadded={false}
	isInAnimated={true}
	isOutAnimated={true}
	height='100vh'
	width='100%'
	justify='center'
>
	<component>
		<container
			class='sidebar'
		>
			<Sidebar />
		</container>
		<container
			class='main'
		>
			<component
				class='header'
			>
				<heading>
					Home
				</heading>
			</component>
			{#if $signalsW && !isDemoMode}
				{#each $signalsW as signal}
					<Tweet>
						<b>💥 Distress:</b>
						<br>
						Lookout for anyone talking about <i>{signal.topic.content}</i> to their <i>{signal.topic.contact}</i>.
					</Tweet>
				{/each}
			{/if}
			<Tweet>
				Welcome to Anan!
			</Tweet>
			<Tweet>
				Statistics about your current state:
				<br>
				<br>
				<b>Accuracy:</b> {currentPosition?.coords.accuracy}
				<br>
				<b>Coordinates:</b> [{currentPosition?.coords.latitude}, {currentPosition?.coords.longitude}]
				<br>
				<b>Facing:</b> {currentOrientation}
			</Tweet>
			<Tweet>
				Here's something nice to look at (:
				<container
					class='unsplash'
					slot='rich'
				>
					<Image
						src={
							fetch('https://anan-server.herokuapp.com/api/v1/image/random')
							.then((res) => res.json())
							.then((res) => res.url)
						}
						alt='Random image found from Unsplash, just for decoration'
					/>
				</container>
			</Tweet>
		</container>
	</component>
	<container
		class='fab'
	>
		<Button
			icon='accessibility'
			backgroundColour='--colour-accent-primary'
			hoverColour='--colour-accent-secondary'
			height={72}
			width={72}
			padding={(72 - 16) / 2}
			roundness='100%'
			iconSize='2rem'
			on:click={(event) => ($isCallDialogActiveW = true, callDialogContainer.requestFullscreen())}
			{...$$restProps}
		/>
	</container>
	<container
		bind:this={callDialogContainer}
	>
		<CallDialog
			isActiveW={isCallDialogActiveW}
		/>
	</container>
</Fragment>

<style>
	component {
		display: grid;
		width: auto;
		height: 100%;
		max-width: 1300px;
		grid-template-areas: 
			"sidebar main crap";
		grid-template-columns: min-content 1fr min-content;
		grid-template-rows: 1fr;
	}

	.sidebar {
		grid-area: sidebar;
	}

	.main {
		grid-area: main;
		width: 100%;
    	max-width: 700px;
	}

	.main > .header {
		position: sticky;
		height: 3rem;

		display: flex;
		align-items: center;
		justify-content: flex-start;

		padding: 8px calc(var(--padding) / 2);

		border: solid 1px var(--colour-background-secondary);
		border-top: 0;
	}

	.main > .header > heading {
		font-size: 1.5rem;
	}
	
	.crap {
		grid-area: crap;
	}

	.unsplash {
		height: 100%;
    	width: 100%;
	}

	.fab {
		position: fixed;
		right: 36px;
    	bottom: 36px;
	}
</style>