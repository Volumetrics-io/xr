import { Object3D } from 'three';
import { GetXRSpace } from '../space.js';
export declare function onXRFrame(fn: (frame: XRFrame) => void): void;
declare const provideReferenceSpaceSymbol: unique symbol;
declare module 'three' {
    interface Object3D {
        [provideReferenceSpaceSymbol]?: GetXRSpace;
    }
}
export declare function setupConsumeReferenceSpace(object: Object3D): GetXRSpace;
export declare function setupProvideReferenceSpace(object: Object3D, space: GetXRSpace): void;
export {};
