import classifyPoint from 'robust-point-in-polygon';

export type Vertex = [x: number, y: number];
export type Polygon = Vertex[];

export class Intersecter {
	constructor(private vertices: Vertex[]) {}

	public polygon(polygon: Polygon) {
		this.vertices = this.vertices.filter(
			(vertex) => classifyPoint(polygon, vertex) < 1,
		);

		return this;
	}

	public vertex(vertex: Vertex, radius: number) {
		this.vertices = this.vertices.filter(
			(v) => {
				return Math.abs(
					Math.hypot(
						v[0] - vertex[0],
						v[1] - vertex[1],
					),
				) <= radius;
			},
		);

		return this;
	}

	public coordinate(coordinate: Vertex, radiusM: number) {
		this.vertices = this.vertices.filter(
			(v) => {
				return Intersecter.getDistanceBetweenCoordinates(v, coordinate) <= radiusM;
			},
		);

		return this;
	}

	public build() {
		// don't need to copy since every operation is a direct set onto the variable
		return this.vertices;
	}

	// https://stackoverflow.com/a/19356480
	public static getDistanceBetweenCoordinates([lat1, lon1]: number[], [lat2, lon2]: number[]) {
		const latMid = (lat1 + lat2) / 2.0; // or just use Lat1 for slightly less accurate estimate

		const meterPerDegreeLat = 111132.954 - (559.822 * Math.cos(2.0 * latMid)) + (1.175 * Math.cos(4.0 * latMid));
		const meterPerDegreeLon = (3.14159265359 / 180) * 6367449 * Math.cos(latMid);

		const deltaLat = Math.abs(lat1 - lat2);
		const deltaLon = Math.abs(lon1 - lon2);

		const meters = (Math.sqrt((deltaLat * meterPerDegreeLat) ** 2) + ((deltaLon * meterPerDegreeLon) ** 2));

		return meters;
	}
}
