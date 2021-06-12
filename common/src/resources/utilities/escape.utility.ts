import { StringUtility } from './string.utility.js';

export class EscapeUtility {
	public static escapeRegex(string: string) {
		return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	}

	// todo: only escape non alphanumeric
	public static escapeHTML(string: string) {
		return string
			.split('')
			.map((char) => `&#${char.charCodeAt(0)};`)
			.join('');
	}

	public static unescapeHTML(string: string) {
		const regex = /&#(\d?\d{2});/g;
		let match: RegExpExecArray | null;

		while ((match = regex.exec(string)) != null) {
			const { index } = match;
			const { length } = match[0];
			const charCode = Number(match[1]);

			string = new StringUtility(string)
				.splice(
					index,
					length,
					String.fromCharCode(charCode),
				);
		}

		return string;
	}

	public static escapeHTMLCommonEntities(string: string) {
		return string
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	public static unescapeHTMLCommonEntities(string: string) {
		return string
			.replace(/&amp[;]?/g, '&')
			.replace(/&lt[;]?/g, '<')
			.replace(/&gt[;]?/g, '>')
			.replace(/&quot[;]?/g, '"')
			.replace(/&#[0]?39[;]?/g, '\'');
	}
}
