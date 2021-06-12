import { BaseResponse } from '../base.response.js';
import 'mixmix';
export class ConnectionSuccessWSResponse extends BaseResponse {
}
export class ConnectionErrorWSResponse extends BaseResponse {
}
export class ConnectionTopicWSResponse extends ConnectionSuccessWSResponse {
    constructor({ contact, content }) {
        super();
        this.content = content;
        this.contact = contact;
    }
}
export class ConnectionUnauthorizedErrorWSResponse extends ConnectionErrorWSResponse {
}
