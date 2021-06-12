<script lang='ts'>
	import Fragment from '../blocks/Fragment.svelte';
import Image from '../blocks/Image.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import Tweet from '../components/Tweet.svelte';

	
</script>

<Fragment
	isPadded={false}
	isInAnimated={true}
	isOutAnimated={true}
	height='100vh'
	width='100%'
	justify='center'
>
	<component>
		<container
			class='sidebar'
		>
			<Sidebar />
		</container>
		<container
			class='main'
		>
			<component
				class='header'
			>
				<heading>
					Home
				</heading>
			</component>
			<Tweet>
				Welcome to Anan!
			</Tweet>
			<Tweet>
				Here's something nice to look at (:
				<container
					slot='rich'
				>
					<Image
						
					/>
				</container>
			</Tweet>
		</container>
	</component>
</Fragment>

<style>
	component {
		display: grid;
		width: auto;
		height: 100%;
		max-width: 1300px;
		grid-template-areas: 
			"sidebar main crap";
		grid-template-columns: min-content min-content min-content;
		grid-template-rows: 1fr;
	}

	.sidebar {
		grid-area: sidebar;
	}

	.main {
		grid-area: main;
	}

	.main > .header {
		position: sticky;
		height: 3rem;

		display: flex;
		align-items: center;
		justify-content: flex-start;

		padding: 8px calc(var(--padding) / 2);

		border: solid 1px var(--colour-background-secondary);
		border-top: 0;
	}

	.main > .header > heading {
		font-size: 1.5rem;
	}
	
	.crap {
		grid-area: crap;
	}
</style>