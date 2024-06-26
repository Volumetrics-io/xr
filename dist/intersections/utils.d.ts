import { Plane, Object3D } from 'three';
import { Intersection } from './index.js';
import { AllowedPointerEventsType, type AllowedPointerEvents } from '../pointer.js';
export declare function computeIntersectionWorldPlane(target: Plane, intersection: Intersection, object: Object3D): boolean;
export declare function traversePointerEventTargets(object: Object3D, pointerType: string, callback: (object: Object3D) => void, parentHasListener?: boolean, parentPointerEvents?: AllowedPointerEvents, parentPointerEventsType?: AllowedPointerEventsType): void;
