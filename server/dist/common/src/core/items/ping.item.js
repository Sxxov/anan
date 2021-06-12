import { Item } from '../blocks/item.js';
export class PingItem extends Item {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "location", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "compass", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "accuracy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isInDistress", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
}
