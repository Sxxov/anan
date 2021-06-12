import { Store } from '../../../common/src/core/blocks/store.js';
const _ = undefined;
export class Contexts {
}
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// initializing everything to undefined else typescript will strip them
Object.defineProperty(Contexts, '*', {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _
});
Object.defineProperty(Contexts, "connections", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _
});
Object.defineProperty(Contexts, "clients", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _
});
Object.defineProperty(Contexts, "topics", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _
});
Object.defineProperty(Contexts, "signals", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _
});
export class Ctx extends Contexts {
    static getStore(key) {
        if (this.items[key] == null) {
            this.items[key] = new Store(undefined);
        }
        return this.items[key];
    }
    static get(key) {
        return this.getStore(key)?.value;
    }
    static set(key, value) {
        key = this.getKey(key);
        if (this.items[key] == null) {
            this.items[key] = new Store(value);
            return;
        }
        this.items[key].set(value);
    }
    static getKey(from) {
        return typeof from === 'function' ? from.name : String(from);
    }
}
Object.defineProperty(Ctx, "BROADCAST_KEY", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: '*'
});
Object.defineProperty(Ctx, "items", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {}
});
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
Object.defineProperty(Ctx, "s", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {}
});
Object.keys(Contexts).forEach((contextKey) => {
    Object.defineProperty(Ctx, contextKey, {
        get() {
            return Ctx.get(contextKey);
        },
        set(value) {
            Ctx.set(contextKey, value);
        },
    });
    Object.defineProperty(Ctx.s, contextKey, {
        get() {
            return Ctx.getStore(contextKey);
        },
        // set(value) {
        // 	Ctx.items[contextKey] = value;
        // },
    });
});
