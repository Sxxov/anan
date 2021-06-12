import { ClientError } from './base.error.js';

export class UnexpectedValueError extends ClientError {
	constructor(message: string) {
		super(`An unexpected value was encountered${message ? `: ${message}` : ''}`);
	}
}
