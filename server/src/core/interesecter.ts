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

	public build() {
		// don't need to copy since every operation is a direct set onto the variable
		return this.vertices;
	}
}
