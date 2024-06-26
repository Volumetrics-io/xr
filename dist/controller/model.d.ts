import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { XRControllerLayout } from './layout.js';
import { Object3D } from 'three';
export declare function loadXRControllerModel(layout: XRControllerLayout, loader?: GLTFLoader): Promise<import("three").Group<import("three").Object3DEventMap>>;
export type XRControllerModelOptions = {
    colorWrite?: boolean;
    renderOrder?: number;
};
export declare function configureXRControllerModel(model: Object3D, options?: XRControllerModelOptions): void;
