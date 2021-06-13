<script lang='ts'>
	import { onMount } from 'svelte';
	import Router, { push } from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';
	import { Compatibler } from './core/compatibler';
	import { ScrollUtility } from './resources/utilities';
	import LandingScene from './ui/routes/LandingRoute.svelte';
	import { Ctx } from './core/ctx';
	import HamburgerAppBar from './ui/blocks/appBars/HamburgerAppBar.svelte';
	import Toast from './ui/blocks/Toast.svelte';
	import NotFoundScene from './ui/routes/errors/NotFoundRoute.svelte';

	// Compatibler.throw(Compatibler.test());

	let mainDomContent: HTMLDivElement;

	const Paths = [
		'/',
		'/incompatible',
		'/call',
		'/dashboard',
		'/authenticate',
		'/verify',
		'/walkthrough',
		'/*',
	];
	const RouteDestinations = {
		[Paths[0]]: LandingScene,
		[Paths[1]]: wrap({
			asyncComponent: () => import('./ui/routes/errors/IncompatibleRoute.svelte'),
		}),
		[Paths[2]]: wrap({
			asyncComponent: () => import('./ui/components/CallDialog.svelte'),
		}),
		[Paths[3]]: wrap({
			asyncComponent: () => import('./ui/routes/DashboardRoute.svelte'),
		}),
		[Paths[4]]: wrap({
			asyncComponent: () => import('./ui/routes/AuthenticateRoute.svelte'),
		}),
		[Paths[5]]: wrap({
			asyncComponent: () => import('./ui/routes/VerifyRoute.svelte'),
		}),
		[Paths[6]]: wrap({
			asyncComponent: () => import('./ui/routes/WalkthroughRoute.svelte'),
		}),

		[Paths[Paths.length - 1]]: NotFoundScene,
	};

	// try {
	// 	Compatibler.throw(Compatibler.test());
	// } catch (err) {
	// 	Ctx.incompatibleReason = err.message;
	// 	push('/incompatible');
	// }

	onMount(() => {
		ScrollUtility.target = mainDomContent;
	});
</script>

<main
	bind:this={mainDomContent}
>
	<!-- <HamburgerAppBar
		isSpaced={false}
		isInAnimated={true}
		isOutAnimated={true}
		bind:this={Ctx.globalAppBar}
		toppingsW={Ctx.s.globalHamburger}
	/> -->
	<Router 
		routes={RouteDestinations}
		on:routeLoading={() => {
			Ctx.isRouting = true;
		}}
		on:routeLoaded={() => {
			Ctx.isRouting = false;
		}}
	/>
	<Toast 
		toastsW={Ctx.s.globalToasts}
	/>
</main>

<style>
	main {
		height: 100%;
		background: var(--colour-background-primary);
	}
</style>