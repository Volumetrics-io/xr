import { Quaternion, Vector3 } from 'three';
import { Pointer } from '../pointer.js';
import { intersectLines, intersectRay } from '../intersections/index.js';
import { generateUniquePointerId } from './index.js';
const NegZAxis = new Vector3(0, 0, -1);
export const defaultRayPointerOptions = {
    direction: NegZAxis,
    minDistance: 0,
    linePoints: null,
};
export function createRayPointer(space, pointerState, options = defaultRayPointerOptions) {
    const fromPosition = new Vector3();
    const fromQuaternion = new Quaternion();
    return new Pointer(generateUniquePointerId(), 'ray', pointerState, (scene, _, pointerCapture) => {
        const spaceObject = space.current;
        if (spaceObject == null) {
            return undefined;
        }
        spaceObject.updateWorldMatrix(true, false);
        let intersection;
        const linePoints = options.linePoints ?? defaultRayPointerOptions.linePoints;
        if (linePoints == null) {
            fromPosition.setFromMatrixPosition(spaceObject.matrixWorld);
            fromQuaternion.setFromRotationMatrix(spaceObject.matrixWorld);
            intersection = intersectRay(fromPosition, fromQuaternion, options.direction ?? defaultRayPointerOptions.direction, scene, 'ray', pointerCapture);
        }
        else {
            intersection = intersectLines(spaceObject.matrixWorld, linePoints, scene, 'ray', pointerCapture);
        }
        if (intersection == null) {
            return undefined;
        }
        if (intersection.distance < (options.minDistance ?? defaultRayPointerOptions.minDistance)) {
            return undefined;
        }
        return intersection;
    }, undefined, undefined, undefined, options);
}
