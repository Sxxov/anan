type Instantiable = (
	(new (...args: any[]) => any)
	| (abstract new (...args: any[]) => any)
);

enum LogLevels {
	NONE,
	ERROR,
	WARN,
	INFO,
	DEBUG,
}

type Context = string | Instantiable;

export class LogUtility {
	private ctx: string;

	constructor(ctx?: Context) {
		this.ctx = LogUtility.getCtxString(ctx);
	}

	public static CURRENT_LOG_LEVEL = LogLevels.INFO;
	public static LogLevels = LogLevels;

	private static getCtxString(ctx: Context | undefined) {
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

	public debug(this: LogUtility | Context, ...messages: any[]): void {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		LogUtility.debugWith((this as any).ctx ?? this, ...messages);
	}

	public static debugWith(ctx: Context, ...messages: any[]): void {
		void LogUtility._({
			data: messages,
			logLevel: LogUtility.LogLevels.DEBUG,
			printFunction: console.log,
			colour: 37, // white
			ctx,
		});
	}

	public log(this: LogUtility | Context, ...messages: any[]): void {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		LogUtility.logWith((this as any).ctx ?? this, ...messages);
	}

	public static logWith(ctx: Context, ...messages: any[]): void {
		void LogUtility._({
			data: messages,
			logLevel: LogUtility.LogLevels.INFO,
			printFunction: console.log,
			colour: 37, // white
			ctx,
		});
	}

	public error(this: LogUtility | Context, ...messages: any[]): void {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		LogUtility.errorWith((this as any).ctx ?? this, ...messages);
	}

	public static errorWith(ctx: Context, ...messages: any[]): void {
		void LogUtility._({
			data: messages,
			logLevel: LogUtility.LogLevels.ERROR,
			printFunction: console.error,
			colour: 31, // red
			ctx,
		});
	}

	public warn(this: LogUtility | Context, ...messages: any[]): void {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		LogUtility.warnWith((this as any).ctx ?? this, ...messages);
	}

	public static warnWith(ctx: Context, ...messages: any[]): void {
		void LogUtility._({
			data: messages,
			logLevel: LogUtility.LogLevels.WARN,
			printFunction: console.warn,
			colour: 33, // yellow
			ctx,
		});
	}

	private static async _({
		data = [''],
		logLevel = LogUtility.LogLevels.INFO,
		printFunction = console.log,
		colour = 0,
		ctx,
	}: {
		data: any[];
		logLevel: LogLevels;
		printFunction: (...args: string[]) => void;
		colour: number;
		ctx: Context;
	}): Promise<void> {
		const message = data
			.map((chunk) => {
				switch (true) {
					case chunk instanceof Error:
						return chunk?.stack ?? chunk.message;
					case typeof chunk === 'object':
						try {
							return JSON.stringify(chunk, undefined, 4);
						} catch (_: unknown) {
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
				(key) => this.LogLevels[key] === logLevel,
			);

		const currentTime = new Date().toLocaleString();

		const logMessage = `[${currentTime}] [${LogUtility.getCtxString(ctx)}/${logLevelProperty ?? 'null'}]: ${message}`;

		if (logLevel > LogUtility.CURRENT_LOG_LEVEL) {
			return;
		}

		printFunction(`\x1b[${colour}m${logMessage}\x1b[0m`);
	}

	public static alias(ctx: string): new() => LogUtility {
		const bound = LogUtility.bind(LogUtility, ctx);
		bound.prototype = LogUtility.prototype;

		return bound;
	}
}
