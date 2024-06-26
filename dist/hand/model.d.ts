/// <reference types="webxr" />
import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export type XRHandLoaderOptions = {
    baseAssetPath?: string;
    defaultXRHandProfileId?: string;
};
export declare function getXRHandAssetPath(handedness: XRHandedness, options: XRHandLoaderOptions | undefined): string;
export declare function loadXRHandModel(assetPath: string, loader?: GLTFLoader): Promise<Object3D<import("three").Object3DEventMap>>;
export type XRHandModelOptions = {
    colorWrite?: boolean;
    renderOrder?: number;
};
export declare function configureXRHandModel(model: Object3D, options?: XRHandModelOptions): void;
