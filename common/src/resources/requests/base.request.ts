import { Item } from '../../core/blocks/item.js';

export class BaseRequest extends Item {
	public name = this.constructor.name;
}
