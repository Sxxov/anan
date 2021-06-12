import { CustomClaimsItem } from '../../../../common/src/core/items/customClaims.item.js';
import admin from 'firebase-admin';

class AccountDBSingleton {
	private auth: admin.auth.Auth;

	constructor() {
		// @ts-expect-error
		if (this.auth != null) {
			return;
		}

		// credentials are loaded from ".env"
		// & subsequently "#ananlol-firebase-adminsdk-...json"
		const app = admin.initializeApp({
			credential: admin.credential.applicationDefault(),
		});

		this.auth = app.auth();
	}

	public async authenticate(idToken: string) {
		try {
			const user = await this.getUserFromIDToken(idToken);

			if (user.customClaims == null
				|| !(user.customClaims as CustomClaimsItem).identityValidated) {
				throw new Error();
			}
		} catch (_: unknown) {
			return false;
		}

		return true;
	}

	public async approveIdentityValidation(idToken: string) {
		const user = await this.getUserFromIDToken(idToken);

		await this.auth.setCustomUserClaims(
			user.uid,
			CustomClaimsItem.from({
				identityValidated: true,
			}),
		);
	}

	public async getUserFromIDToken(idToken: string) {
		const token = await this.decodeIDToken(idToken);
		const user = await this.auth.getUser(token.uid);

		return user;
	}

	public async decodeIDToken(idToken: string) {
		return this.auth.verifyIdToken(idToken, true);
	}
}

export const AccountDB = new AccountDBSingleton();
