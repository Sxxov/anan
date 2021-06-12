import classifyPoint from 'robust-point-in-polygon';
export class Intersecter {
    constructor(vertices) {
        Object.defineProperty(this, "vertices", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: vertices
        });
    }
    polygon(polygon) {
        this.vertices = this.vertices.filter((vertex) => classifyPoint(polygon, vertex) < 1);
        return this;
    }
    vertex(vertex, radius) {
        this.vertices = this.vertices.filter((v) => {
            return Math.abs(Math.hypot(v[0] - vertex[0], v[1] - vertex[1])) <= radius;
        });
        return this;
    }
    build() {
        // don't need to copy since every operation is a direct set onto the variable
        return this.vertices;
    }
}
