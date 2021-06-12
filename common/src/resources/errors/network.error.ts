import { ClientError } from './base.error.js';

export class NetworkError extends ClientError {
	constructor(message: string) {
		super(`A network error was encountered${message ? `: ${message}` : ''}`);
	}
}
