<script lang='ts'>
	import { push } from 'svelte-spa-router';
	import { dropIn } from '../../core/transitioner';

	import Button from '../blocks/Button.svelte';
	import Fragment from '../blocks/Fragment.svelte';
	import Spacer from '../blocks/Spacer.svelte';
	import CallFragment from '../fragments/CallFragment.svelte';
	import DashboardRoute from './DashboardRoute.svelte';

	let step = 0;
	let isCallFragmentActive = false;
</script>

<Fragment
	isPadded={false}
	isInAnimated={true}
	isOutAnimated={true}
	height='100vh'
	width='100%'
	align='center'
	justify='center'
>
	<container
		class='dashboard'
	>
		{#if isCallFragmentActive}
			<CallFragment
				on:answer={() => isCallFragmentActive = false}
				on:reject={() => isCallFragmentActive = false}
			/>
		{/if}
		<DashboardRoute />
	</container>
	<container
		class='walkthrough'
	>
		{#if step === 0}
			<overlay />
			<container
				in:dropIn
			>
				<heading>
					Welcome to Anan!
				</heading>
				<string>
					Come look around :D
				</string>
				<Spacer height={56} />
				<container
					class='actions'
				>
					<Button
						hoverColour='--colour-background-secondary'
						backgroundColour='--colour-background-primary'
						icon='cancel'
						on:click={() => push('/dashboard')}
					>Skip tour</Button>
					<Button
						icon='arrow_forward'
						on:click={() => ++step}
					>Let's go</Button>
				</container>
			</container>
		{/if}
		{#if step === 1}
			<overlay />
			<container
				style='
					max-width: 400px;
				'
				in:dropIn
			>
				<heading>
					Keep your finger on this button.
				</heading>
				<string>
					Once tapped, it'll open up a fake calling screen.
					<br>
					<br>
					In the calling screen, there will be a fake contact & a fake topic for you to talk out.
				</string>
	
				<Spacer height={56} />
				<container
					class='actions'
				>
					<Button
						hoverColour='--colour-background-secondary'
						backgroundColour='--colour-background-primary'
						icon='cancel'
						on:click={() => ++step}
					>
						Skip
					</Button>
					<Button
						icon='arrow_forward'
						on:click={() => (isCallFragmentActive = true, ++step)}
					>
						Try it
					</Button>
				</container>
			</container>
			<icon
				class='bigarrow'
				style='
					transform: rotate(45deg);
					right: 0;
					bottom: 300px;
				'
			>arrow_forward</icon>
		{/if}
		{#if step === 2}
			<overlay />
			<container
				style='
					max-width: 400px;
				'
				in:dropIn
			>
				<heading>
					From here, you're taken care of.
				</heading>
				<string>
					Tap to "answer" & notify everyone around you about your topic & approximate location.
					<br>
					<br>
					Drag to "answer" & do the same, but exclude whoever is in front of you from receiving the notification.
					<br>
					<br>
					Tap or drag "reject" to cancel.
				</string>
	
				<Spacer height={56} />
				<container
					class='actions'
				>
					<Button
						icon='arrow_forward'
						on:click={() => (isCallFragmentActive = false, ++step)}
					>
						Got it
					</Button>
				</container>
			</container>
		{/if}
		{#if step === 3}
			<overlay />
			<container
				style='
					max-width: 400px;
					bottom: 0;
				'
				in:dropIn
			>
				<heading>
					Your part in the saving.
				</heading>
				<string>
					If anyone around you sends a distress signal, you'll be able to see it here in your feed.
				</string>

				<Spacer height={56} />
				<container
					class='actions'
				>
					<Button
						icon='arrow_forward'
						on:click={() => ++step}
					>
						Got it
					</Button>
				</container>
			</container>
			<icon
				class='bigarrow'
				style='
					transform: rotate(-90deg);
					left: calc(-18rem + 50vw);
					bottom: 100px;
				'
			>arrow_forward</icon>
		{/if}
		{#if step === 4}
			<overlay />
			<container
				style='
					position: static;
					max-width: 400px;
				'
				in:dropIn
			>
				<heading>
					All set.
				</heading>
				<string>
					Take care, & remember to call authorities when needed. Anan is only here to help!
				</string>

				<Spacer height={56} />
				<container
					class='actions'
				>
					<Button
						icon='exit_to_app'
						on:click={() => push('/dashboard')}
					>
						Go to dashboard
					</Button>
				</container>
			</container>
		{/if}
	</container>
</Fragment>


<style>
	.dashboard {
		position: fixed;
		top: 0;
		left: 0;

		height: 100vh;
		width: 100vw;

		overflow: hidden;
	}

	.walkthrough {
		padding: var(--padding);
		z-index: 1;
		position: fixed;
	}

	.walkthrough overlay {
		z-index: -1;
	}

	.walkthrough heading {
		font-size: 4rem;
	}

	.bigarrow {
		display: block;
		font-size: 36rem;
		line-height: 0;
		position: fixed;
		z-index: -1;
	}
</style>