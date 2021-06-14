<script lang='ts'>
	import { push } from 'svelte-spa-router';

	import {
		BaseResponse, ICSuccessVerifyResponse,
	} from '../../../../common/src/resources/responses';
	import { Businesser } from '../../core/businesser';

	import { Ctx } from '../../core/ctx';
	import {
		Levels, ToastItem,
	} from '../../core/items/toast.item';

	import ScrollableAppBar from '../blocks/appBars/ScrollableAppBar.svelte';
	import AppBarFragment from '../blocks/fragments/AppBarFragment.svelte';
	import Spacer from '../blocks/Spacer.svelte';
	import Progress from '../components/Progress.svelte';

	let isUploading = false;

	if (!Ctx.pingItem?.token) {
		window.history.back();
	
		if (window.history.length < 2) {
			Ctx.globalToasts = [
				ToastItem.from({
					duration: -1,
					text: 'No token found! Are you sure you\'re supposed to be here?',
					level: Levels.ERROR,
				}),
				...Ctx.globalToasts,
			];
		}
	}

	async function onChange(event: Event & {
		currentTarget: EventTarget & HTMLInputElement;
	}) {
		isUploading = true;

		const form = new FormData();
		const file = event.currentTarget.files?.[0];

		if (file == null) {
			return;
		}

		form.append('token', Ctx.pingItem.token);
		form.append('ic', file);

		try {
			const result = await (await fetch('https://anan-server.herokuapp.com/api/v1/verify/submit/ic', {
				method: 'POST',
				body: form,
			})).json();

			if ((result as BaseResponse).name === ICSuccessVerifyResponse.name) {
				Businesser.createGlobalSocket(Ctx.pingItem?.token);

				await push('/walkthrough');
			}
		} catch (_: unknown) {
			console.error(_);
	
			Ctx.globalToasts = [
				ToastItem.from({
					text: 'Ah crap, something happened. Could ya refresh & try again?',
					level: Levels.ERROR,
				}),
				...Ctx.globalToasts,
			];
		}
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
	appBarComponent={ScrollableAppBar}
>
	<container
		class='content'
	>
		{#if isUploading}
			<heading>
				This won't take long (;
			</heading>
			<Spacer height={56} />
			<Progress percent={-1} />
		{:else}
			<heading>
				You'll need to verify your identify before you're able to enjoy <span class='anan'>Anan</span>.
			</heading>
			<Spacer height={56} />
			<string>
				This is to prevent abuse by bad actors, since sensitive information is being flown around.
				<br>
				<br>
				<b>HACKATHON:</b> This flow is mostly stubbed for your convenience. Just submit any picture & it'll approve you.
			</string>
			<Spacer height={56} />
			<string>
				Upload an image of your IC.
			</string>
			<input
				class='file'
				type='file'
				on:change={onChange}
			/>
		{/if}
	</container>
</AppBarFragment>

<style>
	container.content {
		max-width: 700px;
	}

	heading {
		font-size: 4rem;
	}

	span.anan {
		color: var(--colour-accent-primary);
	}
</style>