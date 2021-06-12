import { WalkUtility } from "../../../../common/src/resources/utilities";
export class Item {
    static from(options) {
        const instance = new this();
        // Object.keys(options).forEach((optionKey) => {
        // 	// @ts-expect-error obj[string]
        // 	instance[optionKey] = options[optionKey];
        // });
        WalkUtility.mirror(options, instance);
        return instance;
    }
}
export class Factory {
}
