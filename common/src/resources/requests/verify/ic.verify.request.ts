import { BaseRequest } from '../base.request.js';

export class ICVerifyRequest extends BaseRequest {
	token!: string;
	ic!: any;
}
