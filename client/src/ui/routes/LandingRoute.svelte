<script lang='ts'>
	import { onMount } from 'svelte';
	import type { AnimationItem } from 'lottie-web';
	import { writable } from 'svelte/store';
	import { push } from 'svelte-spa-router';
	import { Ctx } from '../../core/ctx';
	import Button from '../blocks/Button.svelte';
	import Input from '../blocks/Input.svelte';
	import Fragment from '../blocks/Fragment.svelte';
	import Lottie from '../blocks/Lottie.svelte';
	import Dialog from '../blocks/Dialog.svelte';
	import Gradient2 from '../components/Gradient2.svelte';
	import AppBarFragment from '../blocks/fragments/AppBarFragment.svelte';
	import ScrollableAppBar from '../blocks/appBars/ScrollableAppBar.svelte';
	import {
		dropIn, dropOut,
	} from '../../core/transitioner';
	import CallToAction from '../components/CallToAction.svelte';
	import Spacer from '../blocks/Spacer.svelte';
	import Footer from '../components/Footer.svelte';

	let animationCurrentFrameW = writable(0);
	let animation: AnimationItem;
	let lottieContainerDomContent: HTMLDivElement;

	let scrollY = 0;

	$: onScroll(scrollY);

	function onScroll(y: number) {
		if (!lottieContainerDomContent) {
			return;
		}

		const { top } = lottieContainerDomContent.getBoundingClientRect();

		const currentFrame = Math.max(
			animation?.totalFrames
			- (
				y / 8
				// - top
			),
			-1,
		);
	
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		$animationCurrentFrameW = Math.max(y - 10, 0);
	}
</script>

<svelte:window bind:scrollY />

<AppBarFragment
	isPadded={false}
	isInAnimated={true}
	isOutAnimated={true}
	height='100vh'
	width='100%'
	align='center'
	justify='center'
	rows='auto'
>
	<container
		slot='appBar'
	>
		<ScrollableAppBar
			backgroundColour='transparent'
		>
			<Button
				backgroundColour='--colour-accent-secondary'
				textColour='--colour-accent-primary'
				hoverColour='#fff3'
				on:click={() => push('/dashboard')}
			>
				<iconf
					style='color: var(--colour-accent-primary)'
					slot='icon'
				>
					exit_to_app
				</iconf>
				Launch app
			</Button>
		</ScrollableAppBar>
	</container>

	<container 
		class='lottie'
		bind:this={lottieContainerDomContent}
	>
		<Lottie 
			bind:animationCurrentFrameW
			bind:animation
			overrideColour='--colour-text-primary'
			animationData={import('../../raw/lottie/blocks.json')}
			options={{

			}}
		/>
	</container>

	<container
		class='boo'
		in:dropIn
		out:dropOut
	>
		<heading>
			BOO.
		</heading>
	</container>

	<container
		class='normal'
	>
		<heading>
			Don't be scared,
			<br>
			<i>Anan</i> is here for when you're creeped out.
		</heading>
		<Spacer height={56} />
		<string>
			Anan is a web app that enables you to inconspiciously escape from situations, through peer-to-peer magic.
			<br>
			<br>
			It's based on modern technologies such as WebSockets to ensure reliability.
			<br>
			Basically, it's awesome.
			<br>
			<br>
			What are you waiting for?
		</string>
	</container>

	<CallToAction />

	<Footer />
</AppBarFragment>

<style>
	container.lottie {
		width: 100%;
		height: 100vh;
		/* position: absolute; */
		/* top: 0; */

		/* to be above collage, not sure why it's 21 though (collage goes up to 40) */
		z-index: 0;
	}

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

	.boo {
		display: flex;
		align-items: center;
		justify-content: center;

		/* height: 100vh; */
		width: calc(100vw - 12px);
		overflow: hidden;

		padding: calc(var(--padding) * 4);
		box-sizing: border-box;
	}

	.boo > heading {
		font-size: 28rem;
		transform: rotate(0deg);
		word-break: break-word;
    	line-height: 0.7em;

		text-align: center;
		margin-left: -32px;
	}

	.miniboo {
		font-size: 28rem;
		display: block;
		position: absolute;
	}

	.normal {
		padding: calc(var(--padding) * 2);
		box-sizing: border-box;

		background: var(--colour-accent-secondary);
	}
</style>