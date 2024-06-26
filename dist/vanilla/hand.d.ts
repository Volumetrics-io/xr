/// <reference types="webxr" />
import { Object3D } from 'three';
import { XRHandModelOptions } from '../hand/index.js';
export declare class XRHandModel extends Object3D {
    constructor(hand: XRHand, assetPath: string, options?: XRHandModelOptions);
}
