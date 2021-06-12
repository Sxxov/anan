import { Factory, Item } from '../blocks/item.js';

export enum TopicGetResponseContentChoices {
	'your dog\'s sprained back left ankle',
	'your cat\'s vet bills',
	'the stationery you left at their home',
	'the grocery list that you gave them to buy',
	'the car/bike you gave him to fix',
}
export enum TopicGetResponseContactChoices {
	'brother',
	'aunt',
	'mother',
	'father',
	'uncle',
}

export class TopicItem extends Item {
	content!: keyof typeof TopicGetResponseContentChoices;
	contact!: keyof typeof TopicGetResponseContactChoices;
}

export class TopicItemFactory extends Factory<TopicItem> {
	public create() {
		const contentKeys = Object.keys(TopicGetResponseContentChoices);
		const contactKeys = Object.keys(TopicGetResponseContactChoices);

		return TopicItem.from({
			content: contentKeys[Math.floor(Math.random() * contentKeys.length)] as keyof typeof TopicGetResponseContentChoices,
			contact: contactKeys[Math.floor(Math.random() * contactKeys.length)] as keyof typeof TopicGetResponseContactChoices,
		});
	}
}
