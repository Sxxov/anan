import { ClientError } from '../../../../common/src/resources/errors';
import strings from '../strings';

export class IncompatibleError extends ClientError {
	constructor(message: string) {
		super(`${strings.common.errors.INCOMPATIBLE}${message ? `:\n\n${message}` : ''}`);
	}
}
