import { Object3D } from 'three';
import { Pointer, PointerOptions } from '../pointer.js';
export type GrabPointerOptions = {
    /**
     * @default 0.07
     */
    radius?: number;
} & PointerOptions;
export declare const defaultGrabPointerOptions: {
    radius: number;
};
export declare function createGrabPointer(space: {
    current?: Object3D | null;
}, pointerState: any, options?: GrabPointerOptions): Pointer;
