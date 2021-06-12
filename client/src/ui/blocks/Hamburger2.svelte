<script lang='ts'>
	import {
		onDestroy, onMount,
	} from 'svelte';
	import { writable } from 'svelte/store';
	import LottieToggleButton from './buttons/LottieToggleButton.svelte';
	import hamburger from '../../raw/lottie/hamburger.json';
	import {
		CSSUtility,
		$ as S,
	} from '../../resources/utilities';
	import { FrameAnimator } from '../../resources/animators';
	import Ripple from './Ripple.svelte';

	export let isActiveW = writable(false);
	export let toppings: Record<string, () => void>;
	export let buttonSize = '2rem';
	export let backgroundColour = '--colour-background-primary';
	export let prefix = '—\xa0\xa0';
	export let suffix = '';
	export let totalFrames = 120;

	let lottieToggleButton: LottieToggleButton;
	let currentOnMouseChildDom: HTMLElement;
	const toppingTitles: Record<keyof typeof toppings, HTMLHeadingElement> = {};
	const toppingContainers: Record<keyof typeof toppings, HTMLDivElement> = {};
	const toppingsAnimators: Record<keyof typeof toppings, {
		revealFrameAnimator: FrameAnimator;
		hoverFrameAnimator: FrameAnimator;
	}> = (() => {
		const result: typeof toppingsAnimators = {};

		Object.keys(toppings)
			.forEach((toppingsKey) => {
				result[toppingsKey] = {
					revealFrameAnimator: new FrameAnimator(),
					hoverFrameAnimator: new FrameAnimator(),
				};
			});

		return result;
	})();
	const rippleItems = (() => {
		const arrayW = writable<any[]>([]);

		return {
			...arrayW,
			add: (item: any) => arrayW.update((items) => [...items, item]),
			clear: () => arrayW.update(() => []),
		};
	})();

	onMount(() => {
		window.addEventListener('popstate', onPopState);
		window.addEventListener('mousedown', onMouseDown);

		createAnimations();
	});

	onDestroy(() => {
		window.removeEventListener('popstate', onPopState);
		window.removeEventListener('mousedown', onMouseDown);
	});

	$: Object.keys(toppingTitles)
		.forEach(
			(toppingTitlesKey) => animateToppingReveal(
				toppingTitlesKey,
				$isActiveW ? 'reveal' : 'hide',
			),
		);

	function onMouseDown(event: MouseEvent | TouchEvent) {
		const { target } = event;
		const indexOfTarget = Object.values(toppingContainers).indexOf(target as any);

		if (target == null
			|| indexOfTarget === -1) {
			return;
		}

		const {
			x,
			y,
		} = (target as HTMLDivElement).getBoundingClientRect();

		rippleItems.add({
			key: Object.keys(toppingContainers)[indexOfTarget],
			x: (event as MouseEvent ?? (event as TouchEvent).touches[0]).pageX - x,
			y: (event as MouseEvent ?? (event as TouchEvent).touches[0]).pageY - y,
			size: (target as HTMLDivElement).clientWidth,
		});
	}

	function onPopState() {
		isActiveW.set(false);
	}

	function createAnimations(): void {
		const toppingsAnimatorsEntries = Object.entries(toppingsAnimators);

		toppingsAnimatorsEntries
			.forEach(([toppingsAnimatorsKey, toppingsAnimator], i) => {
				const {
					revealFrameAnimator,
					hoverFrameAnimator,
				} = toppingsAnimator;
				const title = toppingTitles[toppingsAnimatorsKey];

				// add pre to enable onHidden
				revealFrameAnimator.add({
					index: -1,
					type: 'null',
				});

				// add pre to enable onHidden
				hoverFrameAnimator.add({
					index: -1,
					type: 'null',
				});

				// add container background reveal
				revealFrameAnimator.add({
					index: 0,
					type: 'null',
					items: {
						totalFrames,
						offset: -(totalFrames
						* ((i + 1) / (toppingsAnimatorsEntries.length + 1))) / 4,
						bezier: [
							0.25,
							1,
							0.5,
							1,
						],
						onHidden: (): void => {
							const containerDomContent = S(title.parentElement);

							containerDomContent.css({
								opacity: 0,
							});
						},
						onFrame: (animation, frame): void => {
							const {
								totalFrames: animationTotalFrames,
							} = animation.items;

							const containerDomContent = S(title.parentElement);

							if (frame > 0) {
								containerDomContent.css({
									width: `${((frame) / animationTotalFrames!) * 100}%`,
									opacity: 1,
								});

								return;
							}

							containerDomContent.css({
								width: `${((frame) / animationTotalFrames!) * 100}%`,
								opacity: 0,
							});
						},
					},
				});

				Array.from(title.children).forEach((node, index) => {
					// add reveal animations
					revealFrameAnimator.add({
						index: 0,
						type: 'null',
						items: {
							totalFrames,
							offset: -(totalFrames
									// prefix and suffix changes the length of textContent, so just get it from dom
									* ((title.innerText.length - index) / title.innerText.length)
							) / 4,
							bezier: [
								0.165,
								0.84,
								0.44,
								1,
							],
							onHidden: (): void => {
								const domContent = S(node);

								domContent.css({
									opacity: 0,
								});
							},
							onFrame: (animation, frame): void => {
								const {
									totalFrames: animationTotalFrames,
								} = animation.items;

								const domContent = S(node);

								domContent.css({
									transform: `translateX(-${(animationTotalFrames! - frame) * 2}px)`,
									opacity: 1,
								});
							},
						},
					});

					// if the currently working item is not the prefix
					if (node.classList.contains('prefix')) {
						return;
					}
	
					// add hover animations
					hoverFrameAnimator.add({
						index: 0,
						type: 'null',
						items: {
							totalFrames,
							offset: -(totalFrames
									* ((index) / title.innerText.length)),
							bezier: [
								0.25,
								1,
								0.5,
								1,
							],
							onHidden: (): void => {
								const domContent = S(node);

								domContent.css({
									transform: 'translateY(0px)',
								});
							},
							onFrame: (animation, frame): void => {
								const domContent = S(node);
								const {
									totalFrames: animationTotalFrames,
								} = animation.items;

								switch (true) {
									// if currently not hovering over prefix, remove 'forced'
									case !currentOnMouseChildDom.classList.contains('prefix'):
										domContent.removeClass('forced');
										break;
									case frame <= animationTotalFrames! / 2:
										domContent.removeClass('forced');
										break;
									case frame > animationTotalFrames! / 2:
										// if currently hovering on prefix, add 'forced'
										if (!currentOnMouseChildDom.classList.contains('prefix')) {
											break;
										}

										domContent.addClass('forced');
										break;
									default:
								}

								domContent.css({
									transform: `translateY(${index % 2 === 0 ? '' : '-'}${frame / 14}px)`,
								});
							},
						},
					});
				});
			});
	}

	function animateToppingHover(toppingsKey: keyof typeof toppingsAnimators, state: 'over' | 'out'): void {
		const {
			totalFrames,
		} = toppingsAnimators[toppingsKey].hoverFrameAnimator.animations[0][0].items;

		let end: number;

		switch (state) {
			case 'over':
				end = totalFrames!;
				break;
			case 'out':
				end = 0;
				break;
			default:
				return;
		}

		const { hoverFrameAnimator } = toppingsAnimators[toppingsKey];
		const options = {
			fps: 240,
		};

		if (hoverFrameAnimator.currentFrame === end
			&& end === 0) {
			hoverFrameAnimator.animate(
				end,
				end + 1,
				options,
			);

			return;
		}

		hoverFrameAnimator.animate(
			hoverFrameAnimator.currentFrame,
			end,
			options,
		);
	}

	function animateToppingReveal(toppingsKey: keyof typeof toppingsAnimators, state: 'reveal' | 'hide'): void {
		const {
			totalFrames,
		} = toppingsAnimators[toppingsKey].hoverFrameAnimator.animations[0][0].items;

		let end = null;
		let speed = null;

		switch (state) {
			case 'reveal':
				end = totalFrames!;
				speed = 1;
				break;
			case 'hide':
				end = 0;
				speed = 2;
				break;
			default:
				return;
		}

		const { revealFrameAnimator } = toppingsAnimators[toppingsKey];

		if (revealFrameAnimator.currentFrame === end) {
			revealFrameAnimator.animate(
				end,
				end + 1,
			);

			return;
		}

		revealFrameAnimator.animate(
			revealFrameAnimator.currentFrame,
			end,
			{
				speed,
			},
		);
	}
</script>

{#if toppings}
	<component
		style='
			--colour-background: {CSSUtility.parse(backgroundColour)};
		'
	>
		<container
			class:boosted={$isActiveW}
			class='button'
			style='
				--button-size: {CSSUtility.parse(buttonSize)};
			'
		>
			<LottieToggleButton
				animationData={hamburger}
				bind:this={lottieToggleButton}
				bind:isActiveW
				overrideColour='--colour-text-primary'
			/>
		</container>
		<container
			class:active={$isActiveW}
			class='overlay y top'
		/>
		<container
			class:active={$isActiveW}
			class='overlay y bottom'
		/>
		<container
			class:active={$isActiveW}
			class='overlay x left'
		/>
		<container
			class:active={$isActiveW}
			class='overlay x right'
		/>
		<container
			class='wrapper'
		>
			<container
				class:active={$isActiveW}
				class='toppings'
				style='
					--grid-template-rows: auto repeat({Object.keys(toppingsAnimators).length}, min-content) auto;
				'
			>
			<container />
				{#each Object.entries(toppings) as [key, value], i}
					<container
						class='topping'
						style='
							--grid-row: {i + 2} / {i + 3};
							--grid-column: 2 / 3;
						'
						on:click={() => {
							isActiveW.set(false);
							value();
						}}
						on:mouseover={
							// @ts-expect-error
							(event) => {
								currentOnMouseChildDom = event.target;

								animateToppingHover(key, 'over');
							}
						}
						on:mouseout={
							// @ts-expect-error
							(event) => {
								currentOnMouseChildDom = event.target;

								animateToppingHover(key, 'out');
							}
						}
						bind:this={toppingContainers[key]}
					>
						<string
							bind:this={toppingTitles[key]}
						>
							{#if prefix}
								<span
									class='prefix'
								>
									{prefix}
								</span>
							{/if}
							{#each key.split('') as char}
								<span
									class='char'
								>
									{
										char === ' '
										? '\xa0'
										: char
									}
								</span>
							{/each}
							{#if suffix}
								<span
									class='suffix'
								>
									{suffix}
								</span>
							{/if}
						</string>
						<svg>
							{#each $rippleItems as ripple}
								{#if ripple.key === key} 
									<Ripple 
										x='{ripple.x}' 
										y='{ripple.y}' 
										size={ripple.size} 
										speed={250}
										sizeIn={20}
										opacityIn={0.2}
										fill='--colour-accent-primary'
									/>
								{/if}
							{/each}
						</svg>
					</container>
				{/each}
				<container />
			</container>
		</container>
	</component>
{/if}

<style>
	svg {
		z-index: 1;

		position: absolute;
		left: 0;
		top: 0;

		width: 100%;
		height: 100%;

		pointer-events: none;

		border-radius: var(--roundness);
	}

	component {
		height: 100%;

		display: grid;
		align-items: center;
		justify-items: center;
	}

	container.button {
		position: relative;

		width: var(--button-size);

		z-index: 0;

		transition: z-index 0s 0.5s;
	}

	container.button.boosted {
		z-index: 3;

		transition: unset;
	}

	span {
		display: inline-block;
	}

	container.wrapper {
		display: grid;
		align-items: center;
		justify-items: center;

		position: fixed;

		top: 0;
		left: 0;

		height: 100vh;
		width: 100vw;

		pointer-events: none;
	}

	container.toppings {
		height: 100%;
		width: auto;

		position: relative;

		display: grid;

		grid-template-rows: var(--grid-template-rows);
		align-items: center;
		justify-items: center;

		gap: 32px;

		z-index: 1;

		pointer-events: none;
	}

	container.overlay {
		--duration: 0.5s;

		position: fixed;

		height: 100vh;
		width: 100vw;

		background: var(--colour-background-primary);

		clip-path: inset(100% 100% 100% 100%);
	}

	container.overlay.y.top {
		top: 0;
		left: 0;

		clip-path: inset(0 0 100% 0);
		transition: clip-path var(--duration) var(--ease-fast-slow);
	}

	container.overlay.y.top.active {
		clip-path: inset(0 0 50% 0);
	}

	container.overlay.y.bottom {
		bottom: 0;
		left: 0;

		clip-path: inset(100% 0 0 0);
		transition: clip-path var(--duration) var(--ease-fast-slow);
	}

	container.overlay.y.bottom.active {
		clip-path: inset(50% 0 0 0);
	}
	container.overlay.x.left {
		top: 0;
		left: 0;

		clip-path: inset(0 100% 0 0);
		transition: clip-path 0.8s var(--ease-slow-slow);
	}

	container.overlay.x.left.active {
		clip-path: inset(0 50% 0 0);
	}

	container.overlay.x.right {
		top: 0;
		right: 0;

		clip-path: inset(0 0 0 100%);
		transition: clip-path 0.8s var(--ease-slow-slow);
	}

	container.overlay.x.right.active {
		clip-path: inset(0 0 0 50%);
	}

	container.topping:hover string {
		color: var(--colour-text-primary);
	}

	container.topping string {
		white-space: nowrap;

		margin-left: 32px;

		color: var(--colour-background-primary);
	}

	container.topping {
		position: relative;
		width: 100%;
		/* box-sizing: border-box; */
		
		overflow: hidden;
		opacity: 0;
		
		width: fit-content;
		margin: 0 32px;
		padding: 4px 0;

		display: flex;

		transition: padding 0.5s var(--ease-fast-slow);

		-webkit-tap-highlight-color: transparent;

		pointer-events: visible;
	}

	/* container.toppings:not(.active) > .topping {
		padding: 32px 0px;
	} */

	container.topping::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;

		border-radius: var(--roundness);

		background: var(--colour-text-primary);

		left: 0;
	}

	container.topping::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;

		border-radius: var(--roundness);
		border: 10px solid var(--colour-text-primary);
		box-sizing: border-box;

		left: 0;

		transition: border 0.3s var(--ease-slow-slow);
	}

	container.topping:hover,
	container.topping:hover::before {
		cursor: pointer;
		/* cursor: crosshair; */

		color: var(--colour-text-primary);
		background: var(--colour-background-primary);

		border-radius: var(--roundness);

		padding: 48px 0px 64px 0px;
	}

	container.topping:hover::after {
		border: 0 solid var(--colour-text-primary);
	}

	/* .__hamburgerMenu.containersWrapper > .container > .title > .prefix {
		font-weight: 400;
	}

	.__hamburgerMenu.containersWrapper > .container > .title > span {
		display: inline-block;
	} */
</style>