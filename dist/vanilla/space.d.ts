import { Object3D } from 'three';
import { GetXRSpace } from '../space.js';
export declare class XRSpace extends Object3D {
    readonly space: GetXRSpace;
    constructor(space: GetXRSpace);
}
