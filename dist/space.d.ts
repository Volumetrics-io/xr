/// <reference types="webxr" />
import { Matrix4 } from 'three';
export type GetXRSpace = XRSpace | (() => XRSpace | undefined | null);
export declare function createGetXRSpaceMatrix(space: GetXRSpace, referenceSpace: GetXRSpace): (target: Matrix4, frame: XRFrame | undefined) => void;
