<script lang='ts'>
	import { push } from 'svelte-spa-router';
	import type {
		UserCredential,
	} from 'firebase/auth';
	import { writable } from 'svelte/store';
	import type { CustomClaimsItem } from '../../../../common/src/core/items/customClaims.item';
	import { Businesser } from '../../core/businesser';
	import { Ctx } from '../../core/ctx';
	import { Levels } from '../../core/enums/level.enum';
	import { ToastItem } from '../../core/items/toast.item';

	import {
		dropIn,
	} from '../../core/transitioner';

	import Button from '../blocks/Button.svelte';
	import FillOrTwoToneButton from '../blocks/buttons/FillOrTwoToneButton.svelte';
	import Fragment from '../blocks/Fragment.svelte';
	import Input from '../blocks/Input.svelte';
	import Spacer from '../blocks/Spacer.svelte';
	import Switch from '../blocks/Switch.svelte';
import AppBarFragment from '../blocks/fragments/AppBarFragment.svelte';
import ScrollableAppBar from '../blocks/appBars/ScrollableAppBar.svelte';

	let isRegister = false;

	const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const emailValueW = writable('');
	const passwordValueW = writable('');
	const confirmPasswordValueW = writable('');
	const boringSwitchW = writable(false);

	const emailHintLevelW = writable<Levels>(0);
	const passwordHintLevelW = writable<Levels>(0);
	const confirmPasswordHintLevelW = writable<Levels>(0);

	Businesser.initializeFirebase();

	Businesser.once('authenticate', async ({ data: user }: { data: UserCredential['user'] }) => {
		const token = await user.getIdToken(true);

		Businesser.createContexts(token);
		Businesser.createGlobalSocket(token);

		const idTokenResult = await user.getIdTokenResult();

		if (!(idTokenResult.claims as unknown as CustomClaimsItem).identityValidated) {
			await push('/verify');

			return;
		}

		await push('/dashboard');

		Ctx.globalToasts = [
			ToastItem.from({
				duration: 3000,
				level: Levels.OK,
				text: 'Successfully logged in!',
			}),
			...Ctx.globalToasts,
		];
	});

	for (let i = 0, l = localStorage.length; i < l; ++i) {
		if (localStorage.key(i)?.startsWith('firebase:authUser:')) {
			Ctx.globalToasts = [
				ToastItem.from({
					duration: 3000,
					text: 'Authenticating using local session...',
				}),
				...Ctx.globalToasts,
			];

			break;
		}
	}

	$: !$emailValueW || emailRegex.test($emailValueW)
		? $emailHintLevelW = Levels.NONE
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		: $emailHintLevelW = Levels.ERROR;

	$: !$passwordValueW || $passwordValueW.length > 6
		? $passwordHintLevelW = Levels.NONE
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		: $passwordHintLevelW = Levels.ERROR;

	$: !$confirmPasswordHintLevelW || $confirmPasswordValueW === $passwordValueW
		? $confirmPasswordHintLevelW = Levels.NONE
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		: $confirmPasswordHintLevelW = Levels.ERROR;

	async function authenticate() {
		const isFormValid = (
			$emailHintLevelW === Levels.NONE
			&& $passwordHintLevelW === Levels.NONE
			&& $emailValueW
			&& $passwordValueW
			&& (isRegister ? $confirmPasswordHintLevelW === Levels.NONE : true)
			&& (isRegister ? $confirmPasswordValueW : true)
			&& (isRegister ? $boringSwitchW : true)
		);
	
		if (!isFormValid) {
			Ctx.globalToasts = [
				ToastItem.from({
					level: Levels.ERROR,
					text: 'The form is still incomplete, unfortunately.',
				}),
				...Ctx.globalToasts,
			];

			return;
		}

		Ctx.globalToasts = [
			ToastItem.from({
				duration: -1,
				text: 'Working...',
			}),
			...Ctx.globalToasts,
		];

		const user = isRegister
			? await Businesser.registerUser(
				$emailValueW,
				$passwordValueW,
			)
			: await Businesser.loginUser(
				$emailValueW,
				$passwordValueW,
			);

		// const idTokenResult = await user.getIdTokenResult();
		// const token = await user.getIdToken();

		// Businesser.createContexts(token);

		// Ctx.globalToasts = [];

		// if (!(idTokenResult.claims as unknown as CustomClaimsItem).identityValidated) {
		// 	await push('/verify');

		// 	return;
		// }

		// Businesser.createGlobalSocket(token);

		// Ctx.globalToasts = [
		// 	ToastItem.from({
		// 		level: Levels.OK,
		// 		text: 'Successfully logged in!',
		// 	}),
		// ];

		// await push('/dashboard');
	}
</script>

<AppBarFragment
	isPadded={true}
	isInAnimated={true}
	isOutAnimated={true}
	height='100vh'
	width='100%'
	align='flex-start'
	justify='center'
	rows='min-content min-content 1fr'
	appBarComponent={ScrollableAppBar}
>
	<!-- <container
		slot='appBar'
	>
		<AppBar
			title='Authenticate yourself, mortal!'
		/>
	</container> -->

	<container
		class='buttons'
	>
		{#key isRegister}
			<container
				class='login'
				in:dropIn
				_={isRegister}
				
			>
				<FillOrTwoToneButton
					backgroundColour={!isRegister ? '--colour-accent-secondary' : '--colour-background-secondary'}
					icon='login'
					isTwoTone={isRegister}
					fillColour={!isRegister ? '--colour-accent-primary' : '--colour-text-secondary'}
					iconSize='1.4rem'
					on:click={() => isRegister = false}
				>
						<string
							class:active={!isRegister}
						>
							Login
						</string>
				</FillOrTwoToneButton>
			</container>
			<container
				class='register'
				in:dropIn={{
					delay: 100,
				}}
				_={isRegister}
			>
				<FillOrTwoToneButton
					backgroundColour={isRegister ? '--colour-accent-secondary' : '--colour-background-secondary'}
					icon='person_add'
					isTwoTone={!isRegister}
					fillColour={isRegister ? '--colour-accent-primary' : '--colour-text-secondary' }
					iconSize='1.4rem'
					on:click={() => isRegister = true}
				>
						<string
							class:active={isRegister}
						>
							Register
						</string>
				</FillOrTwoToneButton>
			</container>
		{/key}
	</container>

	<Spacer
		height={56}
	/>

	{#key isRegister}
		<container
			class='form'
			class:register={isRegister}
			in:dropIn
			_={isRegister}
		>
			<Input
				title='Email'
				label='Email'
				buttonComponent={null}
				valueW={emailValueW}
				hint='Invalid email.'
				hintLevelW={emailHintLevelW}
			/>
			<Input
				title='Password'
				label='Password'
				type='password'
				buttonComponent={null}
				valueW={passwordValueW}
				hint='Passwords should be longer than 6 letters.'
				hintLevelW={passwordHintLevelW}
			/>
			{#if isRegister}
				<Input
					title='Confirm Password'
					label='Confirm Password'
					type='password'
					buttonComponent={null}
					valueW={confirmPasswordValueW}
					hint={'Passwords don\'t match.'}
					hintLevelW={confirmPasswordHintLevelW}
				/>
				<container
					class='boring'
				>
					<Switch
						isCheckedW={boringSwitchW}
					/>
					<string>
						I hereby agree to the <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>Terms and Conditions</a>.
					</string>
				</container>
			{/if}
		</container>
	{/key}
	<Spacer
		height={112}
	/>
	<Button
		icon='arrow_forward'
		on:click={authenticate}
	/>
</AppBarFragment>

<style>
	container.buttons {
		display: flex;
		flex-wrap: wrap;
	}

	container.buttons string {
		margin: 0;
	}

	container.buttons string.active {
		color: var(--colour-accent-primary);
	}

	container.buttons > container:hover * {
		color: var(--colour-accent-primary);
	}

	container.form {
		display: grid;
		width: 100%;
		max-width: 300px;
		grid-template-rows: repeat(2, minmax(72px, auto));
		align-items: flex-end;
	}

	container.form.register {
		grid-template-rows: repeat(3, minmax(72px, auto)) 1fr;
	}

	container.boring {
		margin-top: 16px;
		display: grid;
    	grid-template-columns: min-content 1fr;
		gap: 16px;
	}

	container.boring string {
		margin: 0;
	}
</style>