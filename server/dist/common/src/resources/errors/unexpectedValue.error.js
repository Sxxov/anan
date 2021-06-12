import { ClientError } from './base.error.js';
export class UnexpectedValueError extends ClientError {
    constructor(message) {
        super(`An unexpected value was encountered${message ? `: ${message}` : ''}`);
    }
}
