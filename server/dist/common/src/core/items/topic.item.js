import { Factory, Item } from '../blocks/item.js';
export var TopicGetResponseContentChoices;
(function (TopicGetResponseContentChoices) {
    TopicGetResponseContentChoices[TopicGetResponseContentChoices["your dog's sprained back left ankle"] = 0] = "your dog's sprained back left ankle";
    TopicGetResponseContentChoices[TopicGetResponseContentChoices["your cat's vet bills"] = 1] = "your cat's vet bills";
    TopicGetResponseContentChoices[TopicGetResponseContentChoices["the stationery you left at their home"] = 2] = "the stationery you left at their home";
    TopicGetResponseContentChoices[TopicGetResponseContentChoices["the grocery list that you gave them to buy"] = 3] = "the grocery list that you gave them to buy";
    TopicGetResponseContentChoices[TopicGetResponseContentChoices["the car/bike you gave him to fix"] = 4] = "the car/bike you gave him to fix";
})(TopicGetResponseContentChoices || (TopicGetResponseContentChoices = {}));
export var TopicGetResponseContactChoices;
(function (TopicGetResponseContactChoices) {
    TopicGetResponseContactChoices[TopicGetResponseContactChoices["brother"] = 0] = "brother";
    TopicGetResponseContactChoices[TopicGetResponseContactChoices["aunt"] = 1] = "aunt";
    TopicGetResponseContactChoices[TopicGetResponseContactChoices["mother"] = 2] = "mother";
    TopicGetResponseContactChoices[TopicGetResponseContactChoices["father"] = 3] = "father";
    TopicGetResponseContactChoices[TopicGetResponseContactChoices["uncle"] = 4] = "uncle";
})(TopicGetResponseContactChoices || (TopicGetResponseContactChoices = {}));
export class TopicItem extends Item {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "content", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "contact", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
export class TopicItemFactory extends Factory {
    create() {
        const contentKeys = Object.keys(TopicGetResponseContentChoices).filter((key) => Number.isNaN(Number(key)));
        const contactKeys = Object.keys(TopicGetResponseContactChoices).filter((key) => Number.isNaN(Number(key)));
        return TopicItem.from({
            content: contentKeys[Math.floor(Math.random() * contentKeys.length)],
            contact: contactKeys[Math.floor(Math.random() * contactKeys.length)],
        });
    }
}
