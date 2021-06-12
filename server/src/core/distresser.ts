import type { PingItem } from '../../../common/src/core/items/ping.item.js';
import { ValidationError } from '../../../common/src/resources/errors.js';
import { Constants } from '../index.js';
import type { Contexts } from './ctx.js';
import { Intersecter, Polygon, Vertex } from './interesecter.js';

export class Distresser {
	constructor(private connections: typeof Contexts['connections']) {}

	public verticesAround(connection: PingItem) {
		if (connection.location == null) {
			throw new ValidationError('Connection\'s location has not been initialized');
		}

		const validConnections: PingItem[] = [];
		const validVertices: Vertex[] = [];

		for (let i = 0, l = this.connections.length; i < l; ++i) {
			const c = this.connections.getAt(i);

			if (c.location == null) {
				continue;
			}

			validConnections.push(c);
			validVertices.push(c.location);
		}

		const intersecter = new Intersecter(validVertices);

		const verticesInRadius = intersecter
			.vertex(
				connection.location,
				Constants.DISTRESS_RADIUS_DEG,
			)
			.build();

		const verticesInIgnoreZone = connection.compass
			? intersecter
				.polygon(
					Distresser.rectPolygonAlongAngle(
						Constants.DISTRESS_RADIUS_DEG,
						connection.compass,
						connection.accuracy ?? undefined,
					),
				)
				.build()
			: [];

		const verticesToNotify = verticesInRadius.filter(
			(connectionInRadius) => !verticesInIgnoreZone.includes(connectionInRadius),
		);

		return verticesToNotify;
	}

	public connectionsAround(connection: PingItem) {
		const verticesToNotify = this.verticesAround(connection);

		const connectionsToNotify = this.connections.filter(
			(validConnection) => (
				verticesToNotify.includes(validConnection.location!)
				// validConnection.location![0] === verticesToNotify[i][0]
				// && validConnection.location![1] === verticesToNotify[i][1]
			),
		);

		return connectionsToNotify;
	}

	private static rectPolygonAlongAngle(lengthM: number, angleDeg: number, angleWidthDeg = 10): Polygon {
		const angleOffset = angleWidthDeg / 2;
		const zeroZeroVertex: Vertex = [0, 0];
		const topLeft = this.vertexFromDistanceAlongAngle(zeroZeroVertex, lengthM, angleDeg + angleOffset);
		const topRight = this.vertexFromDistanceAlongAngle(zeroZeroVertex, lengthM, angleDeg - angleOffset);
		const bottomLeft = this.vertexFromDistanceAlongAngle(topLeft, lengthM, angleDeg + 180);
		const bottomRight = this.vertexFromDistanceAlongAngle(topRight, lengthM, angleDeg + 180);

		return [
			topLeft,
			topRight,
			bottomLeft,
			bottomRight,
		];
	}

	private static vertexFromDistanceAlongAngle([x, y]: Vertex, distanceM: number, angleDeg: number): Vertex {
		return [
			(Math.cos(this.degToRad(angleDeg)) * distanceM) + x,
			(Math.sin(this.degToRad(angleDeg)) * distanceM) + y,
		];
	}

	// https://gis.stackexchange.com/a/2964
	private static latitudeToMeters(latitude: number) {
		// latitude / Math.pow(10, 7) / 90
		return latitude * 111111.11111111111;
	}

	private static longitudeToMeters(longitude: number, latitude: number) {
		return longitude * (111111.11111111111 * Math.cos(this.degToRad(latitude)));
	}

	private static degToRad(degree: number) {
		return degree * Math.PI / 180;
	}
}
