import { ClientError } from './base.error.js';
export class ParseError extends ClientError {
    constructor(parser, message = '', expected = '') {
        const lineNumber = Math.floor(parser.cursor / ParseError.LINE_LENGTH);
        const charNumber = parser.cursor % ParseError.LINE_LENGTH;
        const splitterRegex = new RegExp(`(.|[\r\n]){1,${ParseError.LINE_LENGTH}}`, 'g');
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const lines = parser.chunk.match(splitterRegex) ?? [''];
        lines.splice(lineNumber + 1, 0, `${' '.repeat(charNumber)}↑`, `${' '.repeat(charNumber)}[here]`);
        super(`
${expected ? `Expected:
	${expected}
` : ''}At:
    ${lines.join('\n    ')}
${message ?? ''}`);
    }
}
Object.defineProperty(ParseError, "LINE_LENGTH", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 80
});
