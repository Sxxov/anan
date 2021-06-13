import { Store } from '../../../common/src/core/blocks/store';

class BreakpointerSingleton {
	public static readonly NON_MATCH = { matches: false };
	public static readonly Breakpoints: [
		400,
		500,
		600,
		1300,
	] = [
		400,
		500,
		600,
		1300,
	];
	public static readonly MediaQueries = {
		[BreakpointerSingleton.Breakpoints[0]]: BreakpointerSingleton.queryWidth(400),
		[BreakpointerSingleton.Breakpoints[1]]: BreakpointerSingleton.queryWidth(500),
		[BreakpointerSingleton.Breakpoints[2]]: BreakpointerSingleton.queryWidth(600),
		[BreakpointerSingleton.Breakpoints[3]]: BreakpointerSingleton.queryWidth(1300),
	};
	public static readonly Stores = {
		[BreakpointerSingleton.Breakpoints[0]]: new Store(BreakpointerSingleton.NON_MATCH),
		[BreakpointerSingleton.Breakpoints[1]]: new Store(BreakpointerSingleton.NON_MATCH),
		[BreakpointerSingleton.Breakpoints[2]]: new Store(BreakpointerSingleton.NON_MATCH),
		[BreakpointerSingleton.Breakpoints[3]]: new Store(BreakpointerSingleton.NON_MATCH),
	};

	public static registerListeners(): void {
		Object.entries(this.Stores).forEach(([breakpoint, mediaQueryStore]) => {
			// @ts-expect-error obj[string]
			const mediaQuery: MediaQueryList = this.MediaQueries[breakpoint];

			mediaQueryStore.set(mediaQuery);
			mediaQuery.addEventListener('change', () => {
				mediaQueryStore.set(mediaQuery);
			});
		});
	}

	private static queryWidth(width: number): MediaQueryList {
		return window.matchMedia(`only screen and (max-width: ${width}px)`);
	}
}

BreakpointerSingleton.registerListeners();

export const Breakpointer = BreakpointerSingleton;
