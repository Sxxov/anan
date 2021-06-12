import { ClientError } from './base.error.js';
export class UnsupportedOperationError extends ClientError {
    constructor(message) {
        super(`Attempted to execute an unsupported operation${message ? `: ${message}` : ''}`);
    }
}
