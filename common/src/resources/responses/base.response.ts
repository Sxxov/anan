import { Item } from '../../core/blocks/item.js';

export class BaseResponse extends Item {
	name = this.constructor.name;
}
