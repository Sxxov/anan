import { WalkUtility } from "../../../../common/src/resources/utilities";


export class Item {
	public static from<T extends typeof Item>(
		this: T,
		options: Partial<InstanceType<T>>,
	): InstanceType<T> {
		const instance = new this();

		// Object.keys(options).forEach((optionKey) => {
		// 	// @ts-expect-error obj[string]
		// 	instance[optionKey] = options[optionKey];
		// });

		WalkUtility.mirror(options, instance);

		return instance as any;
	}
}

export class Factory {}
