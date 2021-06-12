<script lang='ts'>
	import Siema from 'siema';
	import {
		onMount,
		tick,
	} from 'svelte';
	import {
		ResponsiveUtility,
		CSSUtility,
	} from '../../resources/utilities';
	import Button from './Button.svelte';

	export let backgroundColour = '--colour-background-secondary';
	export let roundness = 'var(--roundness)';

	let containerDomContent: HTMLDivElement;
	let leftButtonDomContent: HTMLDivElement;
	let rightButtonDomContent: HTMLDivElement;
	let siema: Siema;
	let leftIsActive = false;
	let rightIsActive = false;

	onMount(() => {
		siema = new Siema({
			duration: 700,
			easing: 'var(--ease-fast-slow)',
			loop: false,
			selector: containerDomContent,
			perPage: {
				[ResponsiveUtility.Breakpoints.MOBILE]: 1,
				[ResponsiveUtility.Breakpoints.TABLET]: 3,
				[ResponsiveUtility.Breakpoints.DESKTOP]: 5,
			},
			onInit() {
				// @unsafe
				(this as any).config.onChange(this);
			},
			// @ts-expect-error this is Siema, not any
			onChange(ctx: Siema = this) {
				leftIsActive = ctx.currentSlide !== 0;
				// @unsafe
				rightIsActive = ctx.currentSlide + ctx.perPage !== (ctx as any).innerElements.length;
			},
		});
	});

	// fix to update buttons when siema changes to different amount of items per page
	window.addEventListener('resize', () => {
		// run handler again on next tick to force siema to update 'perPage'
		setTimeout(() => {
			// @unsafe
			// @ts-expect-error
			siema.resizeHandler();
	
			// @unsafe
			// @ts-expect-error
			siema.config.onChange(siema);
		}, 0);
	});

	// fix to notify siema after its slots has mounted to change sizes
	(async () => {
		await tick();

		// @unsafe
		// @ts-expect-error
		siema.resizeHandler();
	})();
</script>

<component
	style='
		--colour-background: {CSSUtility.parse(backgroundColour)};
		--border-radius: {CSSUtility.parse(roundness)};
	'
>
	<container
		class='content'
		bind:this={containerDomContent}
	>
		<slot />
	</container>
	<container
		bind:this={leftButtonDomContent}
		class='left button {leftIsActive ? '' : 'inactive'}'
	>
		<Button
			icon='keyboard_arrow_left'
			padding='16px 16px'
			backgroundColour='#0000'
			hoverColour='#0000'
			iconSize='1.5rem'
			on:click={() => siema.prev()}
		/>
	</container>
	<container
		bind:this={rightButtonDomContent}
		class='right button {rightIsActive ? '' : 'inactive'}'
	>
		<Button
			icon='keyboard_arrow_right'
			padding='16px 16px'
			backgroundColour='#0000'
			hoverColour='#0000'
			iconSize='1.5rem'
			on:click={() => siema.next()}
		/>
	</container>
</component>

<style>
	component {
		position: relative;
		justify-content: center;
		align-items: center;

		height: 100%;
		width: 100%;
	}

	container.content {
		height: 100%;
		width: 100%;

		border-radius: var(--border-radius);
		background: var(--colour-background);
	}

	container.content :global(img) {
		position: relative;

		opacity: 1;
	}

	container.button {
		position: absolute;
		top: 50%;
		z-index: 0;
		margin-top: calc(56px / -2);

		transition: 0.2s var(--ease-slow-slow);
	}

	container.button.left {
		left: 0px;
	}

	container.button.right {
		right: 0px;
	}

	container.button.inactive {
		opacity: 0;
		pointer-events: none;
	}
</style>
