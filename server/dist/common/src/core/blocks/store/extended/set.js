import { StoreExtendable } from '../extendable.js';
export class StoreSet extends StoreExtendable {
    constructor(iterable) {
        super(new Set(iterable));
        Object.defineProperty(this, "setLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    [Symbol.iterator]() {
        return this.value.values();
    }
    add(value) {
        this.value.add(value);
        if (this.value.size !== this.setLength) {
            this.trigger();
        }
        return this;
    }
    delete(value) {
        const result = this.value.delete(value);
        if (result) {
            this.trigger();
        }
        return result;
    }
    clear() {
        this.value.clear();
        this.trigger();
    }
}
