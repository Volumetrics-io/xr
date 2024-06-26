/// <reference types="webxr" />
import { Object3D } from 'three';
import { GetXRSpace } from '../space.js';
export declare function createUpdateXRHandVisuals(hand: XRHand, handModel: Object3D, referenceSpace: GetXRSpace): (frame: XRFrame | undefined) => void;
