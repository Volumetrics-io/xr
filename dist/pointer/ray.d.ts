import { Object3D, Vector3 } from 'three';
import { Pointer, PointerOptions } from '../pointer.js';
export type RayPointerOptions = {
    /**
     * @default 0
     */
    minDistance?: number;
    /**
     * @default null
     */
    linePoints?: Array<Vector3> | null;
    /**
     * @default NegZAxis
     */
    direction?: Vector3;
} & PointerOptions;
export declare const defaultRayPointerOptions: {
    direction: Vector3;
    minDistance: number;
    linePoints: null;
};
export declare function createRayPointer(space: {
    current?: Object3D | null;
}, pointerState: any, options?: RayPointerOptions): Pointer;
