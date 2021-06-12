export class CaseUtility {
	public static sentence(string: string): string {
		return string.substr(0, 1).toUpperCase()
			+ string.substr(1).toLowerCase();
	}

	public static title(string: string): string {
		return string
			.split(' ')
			.map((stringPart) => this.sentence(stringPart))
			.join(' ');
	}
}
