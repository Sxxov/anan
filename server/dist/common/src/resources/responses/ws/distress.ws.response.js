import { BaseResponse } from '../base.response.js';
export class DistressSignalListWSResponse extends BaseResponse {
    constructor(list) {
        super();
        Object.defineProperty(this, "list", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: list
        });
    }
}
export class DistressSignalEmitSuccessWSResponse extends BaseResponse {
    constructor(notifiedClientCount) {
        super();
        Object.defineProperty(this, "notifiedClientCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: notifiedClientCount
        });
    }
}
