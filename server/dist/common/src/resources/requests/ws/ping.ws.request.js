import { BaseRequest } from '../base.request';
export class PingWSRequest extends BaseRequest {
    constructor({ token, accuracy, compass, isInDistress, location, }) {
        super();
        this.token = token;
        this.accuracy = accuracy;
        this.compass = compass;
        this.isInDistress = isInDistress;
        this.location = location;
    }
}
