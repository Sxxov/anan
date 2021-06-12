// eslint-disable-next-line import/named
import { CompatiblerResultItem } from './compatibler/item';
import { IncompatibleError } from '../resources/errors';

export * from './compatibler/item';

export class Compatibler {
	public static test(): CompatiblerResultItem {
		return CompatiblerResultItem.from({
			// use functions to calculate final result
			// because getters aren't enumerable
			common: {
				BaseSupportVersion: 'noModule' in document.createElement('script'),
			},
			// rendering: {
			// 	MediaRecorder: (() => {
			// 		try {
			// 			// @ts-expect-error
			// 			new MediaRecorder(
			// 				new MediaStream(),
			// 				{
			// 					mimeType: 'video/webm; codecs=vp9',
			// 				},
			// 			);

			// 			return true;
			// 		} catch (err) {
			// 			return false;
			// 		}
			// 	})(),
			// 	MediaStream: typeof MediaStream !== 'undefined',
			// 	SharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
			// },
		});
	}

	public static throw(result: CompatiblerResultItem): void {
		const reason: string = Object.keys(result)
			.map((categoryKey) => {
				// @ts-expect-error obj[string]
				const categoryValue = result[categoryKey];
				const prefix = `[${categoryKey}]: `;

				const unsupportedItems: (string | undefined)[] = Object.keys(categoryValue)
					.map(
						(categoryValueKey) => (
							!categoryValue[categoryValueKey]
								? categoryValueKey
								: undefined
						),
					);

				if (unsupportedItems.join('') === '') {
					return '';
				}

				const unsupportedItemsResult: string[] = [];

				unsupportedItems.forEach(
					(unsupportedItem) => (
						unsupportedItem != null
						&& unsupportedItemsResult.push(`${prefix}${unsupportedItem}\n`)
					),
				);

				return unsupportedItemsResult.join('');
			})
			.join('\n');

		if (reason.trim().length === 0) {
			return;
		}

		throw new IncompatibleError(reason);
	}
}
