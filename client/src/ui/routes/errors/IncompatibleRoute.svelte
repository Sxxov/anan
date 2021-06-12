<script lang='ts'>
	import { replace } from 'svelte-spa-router';
	import { Ctx } from '../../../core/ctx';
	import Scene from '../../blocks/Fragment.svelte';
	import Spacer from '../../blocks/Spacer.svelte';

	const context = Ctx.incompatibleReason;

	if (!context) {
		replace('/');
	}
</script>

<Scene
	isInAnimated={true}
	isOutAnimated={true}
	height='100%'
	align='flex-end'
>
	<container
		class='content'
	>
		<heading>
			your browser f*cking stinks. 
		</heading>
		<Spacer height={24} />
		<string>
			get a life at <a href='https://chrome.google.com'>chrome.google.com</a>
		</string>
		<Spacer height={24} />
		<string>
			{context}
		</string>
	</container>
</Scene>

<style>
	heading,
	string {
		white-space: pre-line;
	}
</style>

