import type { RandomImageItem } from '../../../core/items/randomImage.item';
import { BaseResponse } from '../base.response';

export class RandomImageResponse extends BaseResponse {
	url!: RandomImageItem['url'];
}
