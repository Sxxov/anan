import type { DistressItem } from '../../../core/items/distress.item.js';
import { BaseResponse } from '../base.response.js';

export class DistressSignalListWSResponse extends BaseResponse {
	constructor(public list: DistressItem[]) {
		super();
	}
}

export class DistressSignalEmitSuccessWSResponse extends BaseResponse {
	constructor(public notifiedClientCount: number) {
		super();
	}
}
