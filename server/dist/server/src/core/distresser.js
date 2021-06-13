import { ValidationError } from '../../../common/src/resources/errors.js';
import '../index.js';
import { Intersecter } from './interesecter.js';
export class Distresser {
    constructor(connections) {
        Object.defineProperty(this, "connections", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: connections
        });
    }
    verticesAround(connection) {
        if (connection.location == null) {
            throw new ValidationError('Connection\'s location has not been initialized');
        }
        const validConnections = [];
        const validVertices = [];
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
            .vertex(connection.location, 100 /* DISTRESS_RADIUS_M */)
            .build();
        console.log('$: connection.location:', connection.location);
        console.log('$: Constants.DISTRESS_RADIUS_M:', 100 /* DISTRESS_RADIUS_M */);
        console.log('$: validVertices:', validVertices);
        console.log('$: verticesInRadius:', verticesInRadius);
        const verticesInIgnoreZone = connection.compass
            ? intersecter
                .polygon(Distresser.rectPolygonAlongAngle(0.001 /* DISTRESS_RADIUS_DEG */, connection.compass, 10))
                .build()
            : [];
        console.log('$: verticesInIgnoreZone:', verticesInIgnoreZone);
        const verticesToNotify = verticesInRadius.filter((connectionInRadius) => !verticesInIgnoreZone.includes(connectionInRadius));
        return verticesToNotify;
    }
    connectionsAround(connection) {
        const verticesToNotify = this.verticesAround(connection);
        const connectionsToNotify = this.connections.filter((validConnection) => (verticesToNotify.includes(validConnection.location)
        // validConnection.location![0] === verticesToNotify[i][0]
        // && validConnection.location![1] === verticesToNotify[i][1]
        ));
        return connectionsToNotify;
    }
    static rectPolygonAlongAngle(lengthM, angleDeg, angleWidthDeg = 10) {
        const angleOffset = angleWidthDeg / 2;
        const zeroZeroVertex = [0, 0];
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
    static vertexFromDistanceAlongAngle([x, y], distanceM, angleDeg) {
        return [
            (Math.cos(this.degToRad(angleDeg)) * distanceM) + x,
            (Math.sin(this.degToRad(angleDeg)) * distanceM) + y,
        ];
    }
    // https://gis.stackexchange.com/a/2964
    static latitudeToMeters(latitude) {
        // latitude / Math.pow(10, 7) / 90
        return latitude * 111111.11111111111;
    }
    static longitudeToMeters(longitude, latitude) {
        return longitude * (111111.11111111111 * Math.cos(this.degToRad(latitude)));
    }
    static degToRad(degree) {
        return degree * Math.PI / 180;
    }
}
