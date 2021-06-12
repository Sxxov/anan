import { CustomClaimsItem } from '../../../../common/src/core/items/customClaims.item.js';
import admin from 'firebase-admin';
class AccountDBSingleton {
    constructor() {
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
    async authenticate(idToken) {
        try {
            const user = await this.getUserFromIDToken(idToken);
            if (user.customClaims == null
                || !user.customClaims.identityValidated) {
                throw new Error();
            }
        }
        catch (_) {
            return false;
        }
        return true;
    }
    async approveIdentityValidation(idToken) {
        const user = await this.getUserFromIDToken(idToken);
        await this.auth.setCustomUserClaims(user.uid, CustomClaimsItem.from({
            identityValidated: true,
        }));
    }
    async getUserFromIDToken(idToken) {
        const token = await this.decodeIDToken(idToken);
        const user = await this.auth.getUser(token.uid);
        return user;
    }
    async decodeIDToken(idToken) {
        return this.auth.verifyIdToken(idToken, true);
    }
}
export const AccountDB = new AccountDBSingleton();
