import { WalkUtility } from '../../resources/utilities.js';

export class Item {
	public static from<T extends typeof Item>(
		this: T,
		options: InstanceType<T>,
	): InstanceType<T> {
		const instance = new this();

		// Object.keys(options).forEach((optionKey) => {
		// 	// @ts-expect-error obj[string]
		// 	instance[optionKey] = options[optionKey];
		// });

		WalkUtility.mirror(options, instance);

		return instance as InstanceType<T>;
	}

	public toString?() {
		return JSON.stringify(this);
	}
}

export abstract class Factory<T extends Item> {
	public abstract create(): T | Promise<T>;
}
