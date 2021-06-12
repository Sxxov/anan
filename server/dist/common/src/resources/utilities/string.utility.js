import { ValidationError } from '../errors/validation.error.js';
import { EscapeUtility } from './escape.utility.js';
export var Modes;
(function (Modes) {
    Modes["START"] = "start";
    Modes["BISECT"] = "bisect";
    Modes["END"] = "end";
})(Modes || (Modes = {}));
export class StringUtility {
    constructor(ctx) {
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ctx
        });
    }
    build() {
        return this.ctx;
    }
    bisectBr() {
        return this.br(this.ctx.length / 2);
    }
    bisect() {
        return this.newLine(this.ctx.length / 2);
    }
    newLine(position) {
        return this.insertAt('\n', position);
    }
    br(position) {
        return this.insertAt('<br>', position);
    }
    CRLF(position) {
        return this.insertAt('&#13;&#10;', position);
    }
    splice(start, length, item = '') {
        return `${this.ctx.substr(0, start)}${item}${this.ctx.substr(start + length)}`;
    }
    insertAt(substr, position) {
        return `${this.ctx.substring(this.getModePosition(Modes.START), this.getPosition(position))}${substr}${this.ctx.substring(this.getPosition(position), this.getModePosition(Modes.END))}`;
    }
    splitAt(matcher, eat = false) {
        if (typeof matcher === 'string') {
            matcher = new RegExp(EscapeUtility.escapeRegex(matcher));
        }
        const match = matcher.exec(this.ctx);
        if (match == null) {
            throw new ValidationError(`Tried to split with a matcher ("${matcher.source}") that produced no matches on context ("${this.ctx}")`);
        }
        const position = match.index;
        return [
            this.ctx.substring(this.getModePosition(Modes.START), this.getPosition(position)),
            this.ctx.substring(position + Number(eat && match[0].length), this.getModePosition(Modes.END)),
        ];
    }
    splitAtLast(matcher, eat = false) {
        if (typeof matcher === 'string') {
            matcher = new RegExp(EscapeUtility.escapeRegex(matcher), 'g');
        }
        else {
            matcher = new RegExp(matcher.source, 'g');
        }
        let execResult = null;
        let match = null;
        let position = 0;
        while ((execResult = matcher.exec(this.ctx)) != null) {
            match = execResult;
            position = execResult.index;
        }
        if (match == null) {
            throw new ValidationError(`Tried to split with a matcher ("${matcher.source}") that produced no matches on context ("${this.ctx}")`);
        }
        return [
            this.ctx.substring(this.getModePosition(Modes.START), this.getPosition(position)),
            this.ctx.substring(position + Number(eat && match[0].length), this.getModePosition(Modes.END)),
        ];
    }
    splitAtIndex(position, eat = false) {
        return [
            this.ctx.substring(this.getModePosition(Modes.START), this.getPosition(position)),
            this.ctx.substring(this.getPosition(position) + Number(eat), this.getModePosition(Modes.END)),
        ];
    }
    getPosition(position) {
        switch (typeof position) {
            case 'string':
                return this.getModePosition(position);
            case 'number':
                return position;
            default:
                throw new ValidationError(`position === ${position}`);
        }
    }
    getModePosition(mode) {
        switch (mode) {
            case Modes.START:
                return 0;
            case Modes.END:
                return this.ctx.length;
            case Modes.BISECT:
                return (() => {
                    const ctxParts = this.ctx.split(' ');
                    return this.ctx.indexOf(ctxParts[Math.floor(ctxParts.length / 2)]);
                })();
            default:
                throw new ValidationError(`mode === ${mode}`);
        }
    }
}
Object.defineProperty(StringUtility, "Modes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Modes
});
