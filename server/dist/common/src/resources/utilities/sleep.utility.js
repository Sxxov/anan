import { IncorrectUsageError } from '../errors/incorrectUsage.error.js';
export class SleepUtility {
    static async sleep(ms = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    static sleepSync(ms) {
        try {
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 1, ms);
        }
        catch (_) {
            throw new IncorrectUsageError('sleepSync() can only be used in later versions of node & web workers. (not on web main thread!)');
        }
    }
}
