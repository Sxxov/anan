import { Store } from '../store.js';
export class StoreExtendable extends Store {
    constructor(value) {
        super(value);
        const valueDescriptors = Object.getOwnPropertyDescriptors(this.value);
        const prototypeDescriptors = Object.getOwnPropertyDescriptors(this.value
            ?.constructor
            ?.prototype
            ?? {});
        const descriptors = {
            ...prototypeDescriptors,
            ...valueDescriptors,
        };
        Object.keys(descriptors).forEach((descriptorKey) => {
            // @ts-expect-error
            if (this[descriptorKey] != null) {
                return;
            }
            const { value: descriptorValue, } = descriptors[descriptorKey];
            descriptors[descriptorKey].value = descriptorValue
                ?.bind?.(this.value) ?? descriptorValue;
            Object.defineProperty(this, descriptorKey, descriptors[descriptorKey]);
        });
    }
}
