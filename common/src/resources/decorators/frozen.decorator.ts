export function Frozen(target: any, _: string): void {
	Object.freeze(target);
	Object.freeze(target.prototype);
}
