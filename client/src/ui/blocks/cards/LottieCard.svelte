<script lang='ts'>
	import type { AnimationConfigWithData, AnimationConfigWithPath } from 'lottie-web';
	import Card from '../blocks/Card.svelte';
	import Lottie from '../blocks/Lottie.svelte';
	import Scene from '../blocks/Scene.svelte';

	export let src = '';
	export let animationData: Record<any, any> | undefined = undefined;
	export let options: Partial<AnimationConfigWithData | AnimationConfigWithPath> = {};
</script>

<Card
	isPadded={false}
	{...$$restProps}
>
	<Lottie
		{src}
		{animationData}
		{options}
	/>
	<Scene
		isPadded={true}
		width='100%'
	>
		<slot></slot>
	</Scene>
</Card>