export class RandomUtility {
	public static int(
		length = 16,
	): number {
		return Number(
			new Array(length)
				.fill(null)
				.map(() => String(
					Math.floor(
						Math.min(
							Math.random() * 10,
							9,
						),
					),
				))
				.join(''),
		);
	}

	public static string(
		length = 16,
		charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
	): string {
		let result = '';
		const { length: charsetLength } = charset;

		for (let i = 0; i < length; i++) {
			result += charset.charAt(Math.floor(Math.random() * charsetLength));
		}

		return result;
	}

	public static value<T>(
		obj: any[] | Record<number | string, T>,
	): T {
		return obj[this.key(obj) as any];
	}

	public static key<T extends string | number>(
		obj: T[] | Record<T, any>,
	): T {
		const isArray = obj instanceof Array;
		const keys = isArray ? null : Object.keys(obj);

		return isArray
			? Math.floor(Math.random() * ((obj as unknown as T[]).length - 1))
			: keys![Math.floor(Math.random() * (keys!.length - 1))] as any;
	}
}

