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
            return Intersecter.getDistanceBetweenCoordinates(v, coordinate) <= radiusM;
        });
        return this;
    }
    build() {
        // don't need to copy since every operation is a direct set onto the variable
        return this.vertices;
    }
    // https://stackoverflow.com/a/19356480
    static getDistanceBetweenCoordinates([lat1, lon1], [lat2, lon2]) {
        const latMid = (lat1 + lat2) / 2.0; // or just use Lat1 for slightly less accurate estimate
        const meterPerDegreeLat = 111132.954 - (559.822 * Math.cos(2.0 * latMid)) + (1.175 * Math.cos(4.0 * latMid));
        const meterPerDegreeLon = (3.14159265359 / 180) * 6367449 * Math.cos(latMid);
        const deltaLat = Math.abs(lat1 - lat2);
        const deltaLon = Math.abs(lon1 - lon2);
        const meters = (Math.sqrt((deltaLat * meterPerDegreeLat) ** 2) + ((deltaLon * meterPerDegreeLon) ** 2));
        return meters;
    }
}
