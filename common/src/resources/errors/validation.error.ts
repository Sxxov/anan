import { ClientError } from './base.error.js';

export class ValidationError extends ClientError {
	constructor(message: string) {
		super(`Something happened during validation${message ? `: ${message}` : ''}`);
	}
}
