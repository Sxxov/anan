export class WalkUtility {
	public static object(object: any, callback: (object: any) => any) {
		if (typeof object !== 'object') {
			return callback(object);
		}

		const keys = Object.keys(object as Record<any, any>);
		const result: Record<string, any> = {};

		for (let i = 0, l = keys.length; i < l; ++i) {
			const key = keys[i];
			const value = object[key];

			result[key] = this.object(value, callback);
		}

		return result;
	}

	public static void(object: any, callback: (objectPart: any) => void) {
		if (typeof object !== 'object') {
			callback(object);

			return;
		}

		const keys = Object.keys(object as Record<any, any>);

		for (let i = 0, l = keys.length; i < l; ++i) {
			const key = keys[i];
			const value = object[key];

			this.object(value, callback);
		}
	}

	public static mirror(from: any, to: any) {
		const keys = Object.keys(from as Record<any, any>);

		for (let i = 0, l = keys.length; i < l; ++i) {
			const key = keys[i];
			const fromValue = from[key];

			if (fromValue === null
				|| typeof fromValue !== 'object') {
				to[key] = fromValue;

				continue;
			}

			if (to[key] === null
				|| typeof to[key] !== 'object') {
				to[key] = Number.isNaN(Number(key)) ? {} : [];
			}

			this.mirror(fromValue, to[key]);
		}
	}
}
