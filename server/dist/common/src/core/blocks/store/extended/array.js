import { StoreExtendable } from '../extendable.js';
export class StoreArray extends StoreExtendable {
    constructor(length = 0) {
        super(new Array(length));
    }
    [Symbol.iterator]() {
        return this.value.values();
    }
    get length() {
        return this.value.length;
    }
    removeAt(index) {
        this.value.splice(index, 1);
        this.trigger();
    }
    remove(...items) {
        items.forEach((item) => {
            this.value.splice(this.value.indexOf(item), 1);
        });
        this.trigger();
    }
    setAt(index, newValue) {
        this.value[index] = newValue;
        this.trigger();
    }
    getAt(index) {
        return this.value[index];
    }
    push(...items) {
        const result = this.value.push(...items);
        this.trigger();
        return result;
    }
    pop() {
        const result = this.value.pop();
        this.trigger();
        return result;
    }
    shift() {
        const result = this.value.shift();
        this.trigger();
        return result;
    }
    unshift(...items) {
        const result = this.value.unshift(...items);
        this.trigger();
        return result;
    }
    splice(start, deleteCount) {
        const result = this.value.splice(start, deleteCount);
        this.trigger();
        return result;
    }
    reverse() {
        const result = this.value.reverse();
        this.trigger();
        return result;
    }
    sort(compareFn) {
        this.value.sort(compareFn);
        this.trigger();
        return this;
    }
}
