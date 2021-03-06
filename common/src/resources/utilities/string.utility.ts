import { ValidationError } from '../errors/validation.error.js';
import { EscapeUtility } from './escape.utility.js';

export enum Modes {
	START = 'start',
	BISECT = 'bisect',
	END = 'end',
}

type Position = Modes | number;

export class StringUtility {
	public static Modes = Modes;

	constructor(private ctx: string) {}

	public build(): string {
		return this.ctx;
	}

	public bisectBr(): string {
		return this.br(this.ctx.length / 2);
	}

	public bisect(): string {
		return this.newLine(this.ctx.length / 2);
	}

	public newLine(position: Position): string {
		return this.insertAt('\n', position);
	}

	public br(position: Position): string {
		return this.insertAt('<br>', position);
	}

	public CRLF(position: Position): string {
		return this.insertAt('&#13;&#10;', position);
	}

	public splice(start: number, length: number, item = '') {
		return `${this.ctx.substr(0, start)}${item}${this.ctx.substr(start + length)}`;
	}

	public insertAt(substr: string, position: Position): string {
		return `${
			this.ctx.substring(this.getModePosition(Modes.START), this.getPosition(position))
		}${
			substr
		}${
			this.ctx.substring(this.getPosition(position), this.getModePosition(Modes.END))
		}`;
	}

	public splitAt(matcher: string | RegExp, eat = false): string[] {
		if (typeof matcher === 'string') {
			matcher = new RegExp(EscapeUtility.escapeRegex(matcher));
		}

		const match = matcher.exec(this.ctx);

		if (match == null) {
			throw new ValidationError(`Tried to split with a matcher ("${matcher.source}") that produced no matches on context ("${this.ctx}")`);
		}

		const position = match.index;

		return [
			this.ctx.substring(
				this.getModePosition(Modes.START),
				this.getPosition(position),
			),
			this.ctx.substring(
				position + Number(eat && match[0].length),
				this.getModePosition(Modes.END),
			),
		];
	}

	public splitAtLast(matcher: string | RegExp, eat = false): string[] {
		if (typeof matcher === 'string') {
			matcher = new RegExp(EscapeUtility.escapeRegex(matcher), 'g');
		} else {
			matcher = new RegExp(matcher.source, 'g');
		}

		let execResult: RegExpExecArray | null = null;
		let match: RegExpExecArray | null = null;
		let position = 0;

		while ((execResult = matcher.exec(this.ctx)) != null) {
			match = execResult;
			position = execResult.index;
		}

		if (match == null) {
			throw new ValidationError(`Tried to split with a matcher ("${matcher.source}") that produced no matches on context ("${this.ctx}")`);
		}

		return [
			this.ctx.substring(
				this.getModePosition(Modes.START),
				this.getPosition(position),
			),
			this.ctx.substring(
				position + Number(eat && match[0].length),
				this.getModePosition(Modes.END),
			),
		];
	}

	public splitAtIndex(position: Position, eat = false): string[] {
		return [
			this.ctx.substring(
				this.getModePosition(Modes.START),
				this.getPosition(position),
			),
			this.ctx.substring(
				this.getPosition(position) + Number(eat),
				this.getModePosition(Modes.END),
			),
		];
	}

	private getPosition(position: Position): number {
		switch (typeof position) {
			case 'string':
				return this.getModePosition(position);
			case 'number':
				return position;
			default:
				throw new ValidationError(`position === ${position as string}`);
		}
	}

	private getModePosition(mode: Modes): number {
		switch (mode) {
			case Modes.START:
				return 0;
			case Modes.END:
				return this.ctx.length;
			case Modes.BISECT:
				return (() => {
					const ctxParts = this.ctx.split(' ');

					return this.ctx.indexOf(
						ctxParts[
							Math.floor(
								ctxParts.length / 2,
							)
						],
					);
				})();
			default:
				throw new ValidationError(`mode === ${mode as string}`);
		}
	}
}
