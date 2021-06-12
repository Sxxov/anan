import { IncorrectUsageError } from '../../resources/errors/incorrectUsage.error.js';
export class AsyncConstructor {
    constructor() {
        if (!this.constructor.isBeingInstantiated) {
            throw new IncorrectUsageError('Constructor was called directly. (Use "await [class].new()" instead)');
        }
        this.constructor.isBeingInstantiated = false;
    }
    static async new(..._args) {
        this.brace();
        return undefined;
    }
    static brace() {
        this.isBeingInstantiated = true;
    }
}
Object.defineProperty(AsyncConstructor, "isBeingInstantiated", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
