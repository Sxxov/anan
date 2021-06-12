import { Item } from '../blocks/item.js';
export class DistressItem extends Item {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "topic", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "location", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
