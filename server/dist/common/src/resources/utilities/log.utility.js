var LogLevels;
(function (LogLevels) {
    LogLevels[LogLevels["NONE"] = 0] = "NONE";
    LogLevels[LogLevels["ERROR"] = 1] = "ERROR";
    LogLevels[LogLevels["WARN"] = 2] = "WARN";
    LogLevels[LogLevels["INFO"] = 3] = "INFO";
    LogLevels[LogLevels["DEBUG"] = 4] = "DEBUG";
})(LogLevels || (LogLevels = {}));
export class LogUtility {
    constructor(ctx) {
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.ctx = LogUtility.getCtxString(ctx);
    }
    static getCtxString(ctx) {
        if (typeof ctx === 'string') {
            return ctx;
        }
        if (ctx == null) {
            if (this.name !== 'LogUtility') {
                return this.name;
            }
            return 'null';
        }
        return ctx.name
            ?? ctx.constructor?.name
            ?? 'null';
    }
    debug(...messages) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        LogUtility.debugWith(this.ctx ?? this, ...messages);
    }
    static debugWith(ctx, ...messages) {
        void LogUtility._({
            data: messages,
            logLevel: LogUtility.LogLevels.DEBUG,
            printFunction: console.log,
            colour: 37,
            ctx,
        });
    }
    log(...messages) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        LogUtility.logWith(this.ctx ?? this, ...messages);
    }
    static logWith(ctx, ...messages) {
        void LogUtility._({
            data: messages,
            logLevel: LogUtility.LogLevels.INFO,
            printFunction: console.log,
            colour: 37,
            ctx,
        });
    }
    error(...messages) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        LogUtility.errorWith(this.ctx ?? this, ...messages);
    }
    static errorWith(ctx, ...messages) {
        void LogUtility._({
            data: messages,
            logLevel: LogUtility.LogLevels.ERROR,
            printFunction: console.error,
            colour: 31,
            ctx,
        });
    }
    warn(...messages) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        LogUtility.warnWith(this.ctx ?? this, ...messages);
    }
    static warnWith(ctx, ...messages) {
        void LogUtility._({
            data: messages,
            logLevel: LogUtility.LogLevels.WARN,
            printFunction: console.warn,
            colour: 33,
            ctx,
        });
    }
    static async _({ data = [''], logLevel = LogUtility.LogLevels.INFO, printFunction = console.log, colour = 0, ctx, }) {
        const message = data
            .map((chunk) => {
            switch (true) {
                case chunk instanceof Error:
                    return chunk?.stack ?? chunk.message;
                case typeof chunk === 'object':
                    try {
                        return JSON.stringify(chunk, undefined, 4);
                    }
                    catch (_) {
                        // fallthrough
                    }
                // eslint-disable-next-line
                default:
                    return chunk?.toString?.() ?? String(chunk);
            }
        })
            .join(' ');
        // get the log level name from 'logLevel' as value (eg. { ...VERBOSE: 4 } → 'VERBOSE')
        const logLevelProperty = Object.keys(this.LogLevels)
            .find(
        // @ts-expect-error obj[string]
        (key) => this.LogLevels[key] === logLevel);
        const currentTime = new Date().toLocaleString();
        const logMessage = `[${currentTime}] [${LogUtility.getCtxString(ctx)}/${logLevelProperty ?? 'null'}]: ${message}`;
        if (logLevel > LogUtility.CURRENT_LOG_LEVEL) {
            return;
        }
        printFunction(`\x1b[${colour}m${logMessage}\x1b[0m`);
    }
    static alias(ctx) {
        const bound = LogUtility.bind(LogUtility, ctx);
        bound.prototype = LogUtility.prototype;
        return bound;
    }
}
Object.defineProperty(LogUtility, "CURRENT_LOG_LEVEL", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LogLevels.INFO
});
Object.defineProperty(LogUtility, "LogLevels", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LogLevels
});
