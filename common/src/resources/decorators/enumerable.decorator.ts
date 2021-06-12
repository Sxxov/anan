// stolen wholesale from https://stackoverflow.com/a/61863345

export function Enumerable(
	target: any,
	name: string
): void;
export function Enumerable(
	target: any,
	name: string,
	desc: PropertyDescriptor
): PropertyDescriptor;
export function Enumerable(target: any, name: string, desc?: any): any {
	if (desc) {
		desc.enumerable = true;

		return desc;
	}

	Object.defineProperty(target, name, {
		set(value) {
			Object.defineProperty(this, name, {
				value,
				enumerable: true,
				writable: true,
				configurable: true,
			});
		},
		enumerable: true,
		configurable: true,
	});
}

export function NonEnumerable(
	target: any,
	name: string
): void;
export function NonEnumerable(
	target: any,
	name: string,
	desc: PropertyDescriptor
): PropertyDescriptor;
export function NonEnumerable(target: any, name: string, desc?: any): any {
	if (desc) {
		desc.enumerable = false;

		return desc;
	}

	Object.defineProperty(target, name, {
		set(value) {
			Object.defineProperty(this, name, {
				value,
				writable: true,
				configurable: true,
			});
		},
		configurable: true,
	});
}
