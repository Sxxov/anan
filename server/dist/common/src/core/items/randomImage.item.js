import { Factory, Item } from '../blocks/item.js';
import fetch from 'node-fetch';
export class RandomImageItem extends Item {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
export class RandomImageItemFactory extends Factory {
    constructor(unsplashAccessKey) {
        super();
        Object.defineProperty(this, "unsplashAccessKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: unsplashAccessKey
        });
    }
    async create() {
        try {
            return RandomImageItem.from({
                url: (await (await fetch(`https://api.unsplash.com/photos/random?client_id=${this.unsplashAccessKey}`)).json())?.urls?.full,
            });
        }
        catch (_) {
            return RandomImageItem.from({
                url: 'null',
            });
        }
    }
}
