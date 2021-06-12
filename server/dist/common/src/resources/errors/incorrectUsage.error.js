import { ClientError } from './base.error.js';
export class IncorrectUsageError extends ClientError {
    constructor(message) {
        super(`Incorrect usage of item${message ? `: ${message}` : ''}`);
    }
}
