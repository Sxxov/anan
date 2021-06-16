import { push } from 'svelte-spa-router';
import { initializeApp } from 'firebase/app';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	browserLocalPersistence,
	signOut,
} from 'firebase/auth';
import type {
	UserCredential,
} from 'firebase/auth';
import { PingItem } from '../../../common/src/core/items/ping.item';
import {
	BaseResponse,
	ConnectionTopicWSResponse,
	ConnectionUnauthorizedErrorWSResponse,
	DistressSignalEmitSuccessWSResponse,
	DistressSignalListWSResponse,
} from '../../../common/src/resources/responses';
import { Ctx } from './ctx';
import {
	Levels, ToastItem,
} from './items/toast.item';
import type { CustomClaimsItem } from '../../../common/src/core/items/customClaims.item';

const FirebaseConfig = {
	apiKey: 'AIzaSyBb0OuAWRfu0B5bE8QWq5qocJ1D0LKBD2c',
	authDomain: 'ananlol.firebaseapp.com',
	projectId: 'ananlol',
	storageBucket: 'ananlol.appspot.com',
	messagingSenderId: '1055796918123',
	appId: '1:1055796918123:web:e33da1c092dc5e17ccbe2e',
	measurementId: 'G-CD7N9S5TWP',
};

export class Businesser {
	public static app: ReturnType<typeof initializeApp>;
	public static auth: ReturnType<typeof getAuth>;
	// eslint-disable-next-line no-spaced-func
	private static callbackMap = new Map<string, ((event: {data: any}) => void)[]>();

	public static initializeFirebase(): void {
		this.app ??= initializeApp(FirebaseConfig);
		this.auth ??= getAuth(this.app);

		this.auth.setPersistence(browserLocalPersistence);

		this.auth.onAuthStateChanged(async (user) => {
			if (user == null) {
				return;
			}

			this.callbackMap.get('authenticate')?.forEach((callback) => callback({ data: user }));

			const idTokenResult = await user.getIdTokenResult();
			const token = await user.getIdToken();

			Businesser.createContexts(token);

			if ((idTokenResult.claims as unknown as CustomClaimsItem).identityValidated) {
				await Businesser.createGlobalSocket(token);
			} else {
				this.callbackMap.get('unvalidated')?.forEach((callback) => callback({ data: user }));
			}
		});
	}

	public static async registerUser(email: string, password: string): Promise<UserCredential['user']> {
		return (await createUserWithEmailAndPassword(Businesser.auth, email, password)).user;
	}

	public static async loginUser(email: string, password: string): Promise<UserCredential['user']> {
		return (await signInWithEmailAndPassword(Businesser.auth, email, password)).user;
	}

	public static async logoutUser(): Promise<void> {
		await signOut(Businesser.auth);
	}

	public static async createGlobalSocket(token: string): Promise<void> {
		if (!Ctx.globalSocket) {
			Ctx.globalSocket = new WebSocket(`wss://anan-server.herokuapp.com/api/v1/ws/connect?token=${token}`);
			Ctx.globalSocket.addEventListener('message', this.onMessage);
		}

		await new Promise((resolve) => Ctx.globalSocket.addEventListener('open', resolve));
	}

	public static createContexts(token: string): void {
		if (Ctx.pingItem) {
			return;
		}

		Ctx.pingItem = PingItem.from({
			token,
		});

		Ctx.s.pingItem.subscribe((value) => {
			if (Ctx.globalSocket?.readyState !== Ctx.globalSocket?.OPEN) {
				return;
			}

			Ctx.globalSocket?.send(
				JSON.stringify(value),
			);
		});
	}

	public static once(name: string, callback: (event: {data: any}) => void): void {
		this.on(name, (event) => {
			callback(event);

			this.off(name, callback);
		});
	}

	public static on(name: string, callback: (event: {data: any}) => void): void {
		const arr = this.callbackMap.get(name) ?? [];

		arr.push(callback);

		this.callbackMap.set(name, arr);
	}

	public static off(name: string, callback: (event: {data: any}) => void): void {
		this.callbackMap.forEach((value, key) => {
			if (key === name) {
				const indexOfCallback = value.indexOf(callback);

				if (indexOfCallback !== -1) {
					value.splice(indexOfCallback, 1);
				}
			}
		});
	}

	private static onMessage(event: MessageEvent): void {
		console.log('$: message:', event.data);

		let data: BaseResponse;

		try {
			data = JSON.parse(event.data);

			if (data == null) {
				throw new Error();
			}
		} catch (_: unknown) {
			return;
		}

		switch (data.name) {
			case DistressSignalEmitSuccessWSResponse.name:
				break;
			case DistressSignalListWSResponse.name:
				Ctx.signals = (data as DistressSignalListWSResponse).list;
				break;
			case ConnectionTopicWSResponse.name:
				Ctx.topic = (data as ConnectionTopicWSResponse);
				break;
			case ConnectionUnauthorizedErrorWSResponse.name: {
				Ctx.globalToasts = [
					ToastItem.from({
						duration: 10000,
						text: 'Something made the connection insecure! Try logging in again.',
						level: Levels.ERROR,
					} as ToastItem),
				];

				push('/authenticate');

				break;
			}
			default:
				console.warn('Unknown WS Response:', data);
		}

		Businesser.callbackMap.forEach((value, key) => {
			if (key === data.name) {
				value.forEach((callback) => {
					callback(event);
				});
			}
		});
	}
}
