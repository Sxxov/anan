import { Item } from '../blocks/item.js';
import type { PingItem } from './ping.item.js';
import type { TopicItem } from './topic.item.js';

export class DistressItem extends Item {
	topic!: TopicItem;
	location!: PingItem['location'];
}
