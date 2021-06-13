<script lang='ts'>
	import { writable } from 'svelte/store';
	import { CSSUtility } from '../../resources/utilities';
	import type { CSS } from '../../resources/utilities';
	import {
		LevelColours, LevelIcons, Levels,
	} from '../../core/enums/level.enum';

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
			<icono>
				{LevelIcons[$levelW]}
			</icono>
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