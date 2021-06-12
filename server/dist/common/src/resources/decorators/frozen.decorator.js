export function Frozen(target, _) {
    Object.freeze(target);
    Object.freeze(target.prototype);
}
