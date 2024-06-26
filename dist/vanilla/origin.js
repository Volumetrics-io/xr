import { Group } from 'three';
export class XROrigin extends Group {
    constructor(camera) {
        super();
        this.add(camera);
    }
}
