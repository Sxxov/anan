import { BaseResponse } from '../base.response';
export class RandomImageResponse extends BaseResponse {
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
