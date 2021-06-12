import { ClientError } from './base.error.js';
export class JSONParseError extends ClientError {
    constructor(message) {
        super(`Failed to parse JSON${message ? `: ${message}` : ''}`);
    }
}
