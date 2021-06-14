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
    coordinate(coordinate, radiusM) {
        this.vertices = this.vertices.filter((v) => {
            return Intersecter.getDistanceBetweenCoordinates(v, coordinate) <= radiusM / 1000;
        });
        return this;
    }
    build() {
        // don't need to copy since every operation is a direct set onto the variable
        return this.vertices;
    }
    // https://stackoverflow.com/a/19356480
    static getDistanceBetweenCoordinates(ll1, ll2) {
        const lat1 = ll1[0];
        const lon1 = ll1[1];
        const lat2 = ll2[0];
        const lon2 = ll2[1];
        const R = 6371; // Radius of the earth in km
        const dLat = this.degToRad(lat2 - lat1); // deg2rad below
        const dLon = this.degToRad(lon2 - lon1);
        const a = (Math.sin(dLat / 2) * Math.sin(dLat / 2))
            + (((Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)))
                * Math.sin(dLon / 2)) * Math.sin(dLon / 2));
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }
    static degToRad(degree) {
        return degree * Math.PI / 180;
    }
}
