import { Item } from '../blocks/item.js';
export class CustomClaimsItem extends Item {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "identityValidated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
