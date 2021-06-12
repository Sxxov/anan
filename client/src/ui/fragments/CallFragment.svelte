<script lang='ts'>
	import {
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
	import {
		ToastItem,
		Levels,
	} from '../blocks/Toast.svelte';
	import AppBarFragment from '../blocks/fragments/AppBarFragment.svelte';
	import ClosableAppBar from '../blocks/appBars/ClosableAppBar.svelte';
	import ExpandingButton from '../components/ExpandingButton.svelte';
	import Contact from '../components/Contact.svelte';

	let time = getTime();
	let timeInterval: ReturnType<typeof setInterval>;

	onMount(async () => {
		const date = new Date();

		await new Promise((resolve) => setTimeout(resolve, 60 - date.getSeconds()));

		timeInterval = setInterval(() => {
			time = getTime();
		}, 60000);
	});

	onDestroy(() => {
		clearInterval(timeInterval);
	});

	function getTime() {
		const date = new Date();

		return `${
			String(date.getHours()).padStart(2, '0')
		}:${
			String(date.getMinutes()).padStart(2, '0')
		}`;
	}
</script>

<container
	class='status'
>
	<container
		class='time'
	>
		<string>
			{time}
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
<Fragment
	isPadded={false}
	isInAnimated={true}
	isOutAnimated={true}
	height='calc(100vh - 4rem)'
	width='100vw'
	align='flex-end'
	justify='center'
>
	<!-- <container 
		slot='appBar'
	>
		<ClosableAppBar
			title=''
			isSpaced={false}
		/>
	</container> -->

	<container class='gradient'>
		<Gradient2 />
	</container>

	<container
		class='content'
	>
		<container
			class='contact'
		>
			<Contact 
				contact='brother'
				content='the car/bike you gave him to fix'
			/>
		</container>
		<container
			class='mid'
		>

		</container>
		<container
			class='answer'
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
				on:trigger={() => {console.log('accept')}}
			/>
		</container>
		<container
			class='reject'
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
				on:trigger={() => {console.log('decline')}}
			/>
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

		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: min-content 56px auto;
		grid-template-areas: 
			"contact contact"
			"mid mid"
			"answer reject";

		align-items: center;
		justify-items: center;

		z-index: 1;
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