<script lang='ts' context="module">
	export enum Levels {
		INFO,
		WARN,
		ERROR,
		OK,
		NONE,
	}

	export enum LevelIcons {
		'error_outline',
		'warning',
		'error',
		'done',
	}

	export enum LevelColours {
		'--colour-text-primary',
		'--colour-warn-primary',
		'--colour-error-primary',
		'--colour-ok-primary',
	}
</script>

<script lang='ts'>
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';

	export let level: Levels = Levels.INFO;
	export let levelW = writable<Levels>(level);
	export let overrideColour: CSS | undefined = undefined;
</script>

<component>
	<span
		class:info={$levelW === Levels.INFO}
		class:warn={$levelW === Levels.WARN}
		class:error={$levelW === Levels.ERROR}
		class:ok={$levelW === Levels.OK}
		class:none={$levelW === Levels.NONE}
		class='content'
		style='
			--colour-hint: {CSSUtility.parse(overrideColour ?? LevelColours[$levelW] ?? '')}
		'
	>
		{#if LevelIcons[$levelW] != null}
			<icon>
				{LevelIcons[$levelW]}
			</icon>
		{/if}
		<string class='text'>
			<slot>Hint</slot>
		</string>
	</span>
</component>

<style>
	.content.none {
		opacity: 0;
		height: 0;
	}

	.content {
		display: flex;
		align-items: center;

		overflow: hidden;

		/* height for '.none' */
		opacity: 1;
		height: calc(1rem + 2em);
	}

	.content * {
		color: var(--colour-hint);
	}

	.content,
	.content * {
		transition: 0.2s var(--ease-slow-slow)
	}

	string {
		font-size: 1rem;
		padding-left: 8px;
	}
</style>