import { BaseRequest } from '../base.request.js';
export class ICVerifyRequest extends BaseRequest {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ic", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
