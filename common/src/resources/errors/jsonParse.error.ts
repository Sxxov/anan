import { ClientError } from './base.error.js';

export class JSONParseError extends ClientError {
	constructor(message?: string) {
		super(`Failed to parse JSON${message ? `: ${message}` : ''}`);
	}
}
