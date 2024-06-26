import { Matrix4, Vector3, Object3D } from 'three';
import { Intersection } from './index.js';
import type { PointerCapture } from '../pointer.js';
export declare function intersectLines(fromMatrixWorld: Matrix4, linePoints: Array<Vector3>, scene: Object3D, pointerType: string, pointerCapture: PointerCapture | undefined): Intersection | undefined;
