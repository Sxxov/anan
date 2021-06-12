import type { PingItem } from '../../../common/src/core/items/ping.item.js';
import { Store } from '../../../common/src/core/blocks/store.js';
import type { StoreArray } from '../../../common/src/core/blocks/store/extended/array.js';
import type WebSocket from 'ws';
import type { DistressItem } from '../../../common/src/core/items/distress.item.js';
import type { TopicItem } from '../../../common/src/core/items/topic.item.js';

const _: any = undefined;

export class Contexts {
	/* eslint-disable @typescript-eslint/no-unsafe-assignment */
	// initializing everything to undefined else typescript will strip them
	public static '*': unknown = _;
	public static connections: StoreArray<PingItem> = _;
	public static clients: Map<PingItem, WebSocket> = _;
	public static topics: Map<PingItem, TopicItem> = _;
	public static signals: Map<PingItem, DistressItem[]> = _;
	/* eslint-enable @typescript-eslint/no-unsafe-assignment */
}

type KeyType = keyof typeof Contexts | string | number;

export class Ctx extends Contexts {
	public static BROADCAST_KEY: '*' = '*';
	public static items: Record<KeyType, Store<any>> = {};
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	public static s: Record<Exclude<keyof typeof Contexts, 'prototype'>, Store<any>> = {} as any;

	public static getStore<T>(key: KeyType): Store<T> {
		if (this.items[key] == null) {
			this.items[key] = new Store<any>(undefined);
		}

		return this.items[key] as Store<T>;
	}

	public static get<T>(key: KeyType): T {
		return this.getStore<T>(key)?.value;
	}

	public static set<T>(
		key:
		| string
		| number
		| typeof Ctx.BROADCAST_KEY
		| NewableFunction,
		value: T,
	): void {
		key = this.getKey(key);

		if (this.items[key] == null) {
			this.items[key] = new Store(value);

			return;
		}

		this.items[key].set(value);
	}

	private static getKey(from: number | string | NewableFunction): string {
		return typeof from === 'function' ? from.name : String(from);
	}
}

Object.keys(Contexts).forEach((contextKey) => {
	Object.defineProperty(Ctx, contextKey, {
		get<T = unknown>() {
			return Ctx.get<T>(contextKey);
		},
		set<T = unknown>(value: T) {
			Ctx.set<T>(contextKey, value);
		},
	});
	Object.defineProperty(Ctx.s, contextKey, {
		get<T>() {
			return Ctx.getStore<T>(contextKey);
		},
		// set(value) {
		// 	Ctx.items[contextKey] = value;
		// },
	});
});
