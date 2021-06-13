import { Item } from '../../../../common/src/core/blocks/item';
import { Levels } from '../enums/level.enum';

export class ToastItem extends Item {
	uid? = String(Date.now());
	text = '';
	level?: Levels = Levels.INFO;
	duration? = 2000;
}

export { Levels };
