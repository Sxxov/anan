import { Item } from '../blocks/item.js';

export class PingItem extends Item {
	public token!: string;
	public location?: [latitude: number, longitude: number] | null = null;
	public compass?: number | null = null;
	public accuracy?: number | null = null;
	public isInDistress? = false;
}
