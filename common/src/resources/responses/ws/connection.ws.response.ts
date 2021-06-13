import type { TopicItem } from '../../../core/items/topic.item.js';
import { BaseResponse } from '../base.response.js';

export abstract class ConnectionSuccessWSResponse extends BaseResponse {}

export abstract class ConnectionErrorWSResponse extends BaseResponse {}

export interface ConnectionTopicWSResponse extends ConnectionSuccessWSResponse, TopicItem {}
export class ConnectionTopicWSResponse extends ConnectionSuccessWSResponse {
	constructor({ contact, content }: TopicItem) {
		super();

		this.content = content;
		this.contact = contact;
	}
}

export class ConnectionUnauthorizedErrorWSResponse extends ConnectionErrorWSResponse {}
