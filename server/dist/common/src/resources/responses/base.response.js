import { Item } from '../../core/blocks/item.js';
export class BaseResponse extends Item {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.constructor.name
        });
    }
}
