import { Object3D } from 'three';
import { Pointer, PointerOptions } from '../pointer.js';
export type TouchPointerOptions = {
    /**
     * @default 0.1
     */
    hoverRadius?: number;
    /**
     * @default 0.03
     */
    downRadius?: number;
    /**
     * @default 0
     */
    button?: number;
} & PointerOptions;
export declare const defaultTouchPointerOptions: {
    button: number;
    downRadius: number;
    hoverRadius: number;
};
export declare function createTouchPointer(space: {
    current?: Object3D | null;
}, pointerState: any, options?: TouchPointerOptions): Pointer;
