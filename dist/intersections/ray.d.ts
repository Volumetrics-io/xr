import { Camera, Quaternion, Vector2, Vector3, Object3D } from 'three';
import { Intersection } from './index.js';
import type { PointerCapture } from '../pointer.js';
export declare function intersectRay(fromPosition: Vector3, fromQuaternion: Quaternion, direction: Vector3, scene: Object3D, pointerType: string, pointerCapture: PointerCapture | undefined): Intersection | undefined;
export declare function intersectRayFromCamera(from: Camera, coords: Vector2, fromPosition: Vector3, fromQuaternion: Quaternion, scene: Object3D, pointerType: string, pointerCapture: PointerCapture | undefined): Intersection | undefined;
