<script lang='ts'>
	import Scene from '../../blocks/Fragment.svelte';
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
			404.
		</heading>
	</container>
</Scene>

<style>
	heading {
		white-space: pre-line;
		font-size: var(--font-size-big);
	}
</style>

