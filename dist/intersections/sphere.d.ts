import { Object3D, Vector3, Quaternion } from 'three';
import { Intersection } from './index.js';
import type { PointerCapture } from '../pointer.js';
export declare function intersectSphere(fromPosition: Vector3, fromQuaternion: Quaternion, radius: number, scene: Object3D, pointerType: string, pointerCapture: PointerCapture | undefined): Intersection | undefined;
