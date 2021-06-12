import type { PingItem } from '../../../core/items/ping.item';
import { BaseRequest } from '../base.request';

export interface PingWSRequest extends BaseRequest, PingItem {}
export class PingWSRequest extends BaseRequest {
	constructor({
		token,
		accuracy,
		compass,
		isInDistress,
		location,
	}: PingItem) {
		super();

		this.token = token;
		this.accuracy = accuracy;
		this.compass = compass;
		this.isInDistress = isInDistress;
		this.location = location;
	}
}
