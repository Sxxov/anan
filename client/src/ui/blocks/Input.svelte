<script lang='ts'>
	import {
		onMount,
		createEventDispatcher,
	} from 'svelte';
	import { writable } from 'svelte/store';
	import {
		RandomUtility,
		CSSUtility,
	} from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';
	import Button from './Button.svelte';
	import Hint from './Hint.svelte';
	import { Shadow } from '../../core/shadow';
	import type { Levels } from '../../core/enums/level.enum';

	// @export
	export let value = '';
	export let valueW = writable(value);
	export let isActive = false;
	export let isActiveW = writable(isActive);
	export function focus(): void {
		inputDomContent.focus();
	}
	export function submit(): void {
		dispatch('submit', $valueW);
	}
	export function blur(): void {
		inputDomContent.blur();
	}
	export let onFocus = (): void => {
		$isActiveW = true;
	};
	export let onBlur = (): void => {
		$isActiveW = false;
	};
	
	export let label = 'Input';
	export let buttonComponent: typeof Button | null = Button;
	export let buttonProps = {};
	export let hintLevel: Levels = 0;
	export let hintLevelW = writable(hintLevel);
	export let hint = '';
	export let hintW = writable(hint);
	export let depth = 3;
	export let roundness: CSS = 'var(--roundness)';
	export let height: CSS = 56;
	export let width: CSS = '100%';
	export let buttonWidth: CSS = height;
	export let fontSize: CSS = '1rem';
	export let labelFontSize: CSS = '1rem';
	export let labelTop: CSS = 28;
	export let minIndent: CSS = 16;
	export let indent: CSS = 'max(var(--min-indent), var(--roundness))';
	export let backgroundColour: CSS = '--colour-background-secondary';
	export let activeBackgroundColour: CSS = '--colour-background-primary';
	export let textColour: CSS = '--colour-text-primary';
	export let labelColour: CSS = '--colour-text-secondary';
	export let floatingLabelIndent: CSS = '0';
	export let placeholder = '';
	export let fontFamily: CSS = '--font-family-2';
	export let isMovingLabel = true;
	export let button:
	| Svelte2TsxComponent<any, any, any>
	| typeof buttonComponent
	| HTMLButtonElement
	| undefined = undefined;
	export let formId: string | undefined = undefined;

	const dispatch = createEventDispatcher();

	const randomFormId = RandomUtility.string();
	const randomInputId = RandomUtility.string();
	let formDomContent: HTMLFormElement;
	let inputDomContent: HTMLInputElement;

	$: valueW.set(value);
	$: value = $valueW;

	onMount(() => {
		Shadow.apply(depth, formDomContent);
	});
</script>

<component
	style='
		--border-radius: {CSSUtility.parse(roundness)};
		--width: {CSSUtility.parse(width)};
		--height: {CSSUtility.parse(height)};
		--font-size: {CSSUtility.parse(fontSize)};
		--label-top: {CSSUtility.parse(labelTop)};
		--min-indent: {CSSUtility.parse(minIndent)};
		--indent: {CSSUtility.parse(indent)};
		--button-width: {CSSUtility.parse(buttonWidth)};
		--font-family: {CSSUtility.parse(fontFamily)};
	'
>
	<form
		class:inactive={!$isActiveW}
		class:valued={!!$valueW}
		on:submit|preventDefault={() => false}
		bind:this={formDomContent}
		id={formId ? undefined : randomFormId}
		style='
			--active-colour-background: {CSSUtility.parse(activeBackgroundColour)};
			--colour-background: {CSSUtility.parse(backgroundColour)};
			--form-valued-margin-top: {isMovingLabel ? 'var(--label-top)' : '0'};
		'
	>
		<input
			type='text'
			form={formId || randomFormId}
			id={randomInputId}
			class='text'
			placeholder={placeholder || label}
			bind:value
			bind:this={inputDomContent}
			on:focus={onFocus}
			on:blur={onBlur}
			style='
				--colour-text: {CSSUtility.parse(textColour)};
			'
			{...$$restProps}
		>
		<label
			for='{randomInputId}'
			style='
				--colour-label: {CSSUtility.parse(labelColour)};
				--floating-label-indent: {CSSUtility.parse(floatingLabelIndent)};
				--label-font-size: {CSSUtility.parse(labelFontSize)};
				--label-focused-top: {isMovingLabel ? 'calc(0px - var(--label-top))' : 'calc((var(--height) - var(--font-size)) / 2)'};
				--label-focused-opacity: {isMovingLabel ? 1 : 0.2};
				--label-focused-opacity-no-placeholder: {isMovingLabel ? 1 : 0};
				--label-focused-indent: {isMovingLabel ? 'var(--floating-label-indent)' : 'var(--indent)'};
				--label-transition-duration: {isMovingLabel ? '0.2s' : '0.1s'};
			'
		>
			<string>
				{label}
			</string>
		</label>
		<slot 
			name='button'
			{submit}
		>
			{#if buttonComponent}
				<container
					class='button'
				>
					<svelte:component
						this={buttonComponent}
						height='100%'
						width='100%'
						on:click={submit}
						bind:this={button}
						{...buttonProps}
					></svelte:component>
				</container>
			{:else}
				<button
					style='display: none'
					on:click={submit}
					bind:this={button}
				></button>
			{/if}
		</slot>
	</form>
	{#if $hintW}
		<Hint levelW={hintLevelW}>{$hintW}</Hint>
	{/if}
</component>

<style>
	component {
		position: relative;
		/* padding: var(--label-top-position) 0 0; */
		width: var(--width);
	}

	form {
		display: flex;

		transform: matrix(1, 0, 0, 1, 0, 0);

		background: var(--colour-background);
		box-shadow: var(--shadow-inactive);

		margin: 0;

		border-radius: var(--border-radius);

		transition: 0.2s var(--ease-slow-slow);
	}

	form:not(.inactive) {
		background: var(--active-colour-background);
		box-shadow: var(--shadow);

		margin: var(--form-valued-margin-top) 0 0 0;
	}

	form.valued {
		margin: var(--form-valued-margin-top) 0 0 0;
	}

	input.text {
		width: 100%;
		height: var(--height);

		padding: 0;
		border: 0;
		outline: 0;

		background: transparent;

		font-family: var(--font-family);
		font-variation-settings: var(--font-variation-regular);

		/* for browsers that doesn't support the default value with 'max()' */
		padding: 0 var(--min-indent);
		padding: 0 var(--indent);

		font-size: var(--font-size);
		line-height: 0.9em;
		letter-spacing: -0.08em;
		color: var(--colour-text);

		/* makes a white box appear when `value` is set to '' */
		/* transition: 0.2s var(--ease-slow-slow); */

		user-select: text;
	}
	
	input.text::placeholder {
		color: transparent;
	}

	label {
		position: absolute;
		display: block;

		font-size: var(--font-size);
		line-height: var(--font-size);

		/* for browsers that doesn't support the default value with 'max()' */
		text-indent: var(--min-indent);
		text-indent: var(--indent);

		cursor: text;
		top: calc((var(--height) - var(--font-size)) / 2);

		transition: top var(--label-transition-duration) var(--ease-slow-slow),
					opacity var(--label-transition-duration) var(--ease-slow-slow),
					text-indent var(--label-transition-duration) var(--ease-slow-slow);
	}

	label > string {
		font-family: var(--font-family);
		font-size: var(--label-font-size);
		color: var(--colour-label);
		display: inline;
	}

	label > string::after {
		content: '';
		display: block;
		position: absolute;
		top: -1em;
		left: -1.25em;
		width: 100%;
		height: 1em;
		padding: 1em 1.5em;
		background: var(--colour-background-primary);
		z-index: -1;
		opacity: 0.5;
		border-radius: 100px;
	}

	input.text:focus ~ label,
	input.text:not(:placeholder-shown) ~ label {
		top: var(--label-focused-top);
		opacity: var(--label-focused-opacity-no-placeholder);

		text-indent: var(--label-focused-indent);
		font-size: var(--label-font-size);
		color: var(--colour-accent-primary);
	}

	input.text:focus:placeholder-shown ~ label {
		opacity: var(--label-focused-opacity);
	}

	/* reset input */
	input.text:required, input.text:invalid {
		box-shadow: none;
	}

	container.button {
		width: var(--button-width);
	}
</style>