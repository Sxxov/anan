import { ClientError } from './base.error.js';
export class UnreachableError extends ClientError {
    constructor(message) {
        super(`Somehow, you're in an unreachable part of code${message ? `: ${message}` : ''}`);
    }
}
