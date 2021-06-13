<footer>
	<container
		class='footer'
	>
		<container class='footer socials container invert'>
			<a class='hoverline' href='https://github.com/sxxov/ljs.lol' target='_blank'>
				<svg class='github' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'>
					<path d='M22 6.4c-8.83 0-16 7.16-16 16c0 7.07 4.58 13.07 10.94 15.18c0.8 0.15 1.09-0.35 1.09-0.77c0-0.38-0.01-1.39-0.02-2.72c-4.45 0.97-5.39-2.14-5.39-2.14c-0.73-1.85-1.78-2.34-1.78-2.34c-1.45-0.99 0.11-0.97 0.11-0.97c1.61 0.11 2.45 1.65 2.45 1.65c1.43 2.45 3.74 1.74 4.66 1.33c0.15-1.03 0.56-1.74 1.02-2.14c-3.55-0.4-7.29-1.78-7.29-7.91c0-1.75 0.62-3.17 1.65-4.29c-0.16-0.4-0.71-2.03 0.16-4.23c0 0 1.34-0.43 4.4 1.64c1.28-0.35 2.64-0.53 4.01-0.54c1.36 0.01 2.73 0.18 4.01 0.54c3.05-2.07 4.4-1.64 4.4-1.64c0.87 2.2 0.32 3.83 0.16 4.23c1.03 1.12 1.64 2.55 1.64 4.29c0 6.15-3.74 7.5-7.31 7.9c0.57 0.49 1.09 1.47 1.09 2.96c0 2.14-0.02 3.86-0.02 4.39c0 0.43 0.29 0.93 1.1 0.77C33.42 35.46 38 29.46 38 22.4C38 13.56 30.84 6.4 22 6.4z'></path>
				</svg>
			</a>
		</container>
	</container>

	<string
		style='
			color: var(--colour-background-primary)
		'
	>
		&copy; Anan, 2021.
	</string>
</footer>

<style>
	footer {
		height: auto;
		width: 100%;
		background: var(--colour-text-primary);
	}

	.footer {
		display: flex;


		position: relative;

		padding: calc(var(--padding) / 2);
		box-sizing: border-box;

		justify-content: center;
		align-items: center;
	}

	svg {
		fill: var(--colour-background-primary);
	}

	.footer > container {
		/* height: 100%;
		width: 100%; */
		
		display: flex;
		gap: 32px;

		align-content: center;
		justify-items: center;
	}

	@media only screen and (max-width: 512px) {
		footer > container {
			display: grid;
			grid-template-columns: repeat(6, 1fr);
			width: 100%;
			gap: 0;
			/* justify-content: flex-end; */
			/* width: 100px; */
			/* flex-shrink: 0; */
			/* gap: 25%; */
		}
	}
		
	/* .socials.container {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-template-rows: 1fr;
		grid-column-gap: 0px;
		grid-row-gap: 0px;

		width: 50%;
		max-width: 360px;

		align-items: center;
		justify-items: center;

		position: absolute;
	} */

	.socials.container > a {
		position: relative;

		height: 24px;

		pointer-events: auto;

		-webkit-tap-highlight-color: transparent;
	}

	.socials.container > a:hover > svg {
		bottom: 6px;
	}

	.socials.container > a > svg {
		height: 24px;
		width: 24px;

		bottom: 0;

		position: relative;
		
		transition: bottom 0.3s var(--ease-fast-slow);
	}
</style>