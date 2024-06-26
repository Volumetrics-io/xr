import { Quaternion, Vector3 } from 'three';
import { Pointer } from '../pointer.js';
import { intersectSphere } from '../intersections/sphere.js';
import { generateUniquePointerId } from './index.js';
export const defaultGrabPointerOptions = {
    radius: 0.07,
};
export function createGrabPointer(space, pointerState, options = defaultGrabPointerOptions) {
    const fromPosition = new Vector3();
    const fromQuaternion = new Quaternion();
    return new Pointer(generateUniquePointerId(), 'grab', pointerState, (scene, _, pointerCapture) => {
        const spaceObject = space.current;
        if (spaceObject == null) {
            return undefined;
        }
        spaceObject.updateWorldMatrix(true, false);
        fromPosition.setFromMatrixPosition(spaceObject.matrixWorld);
        fromQuaternion.setFromRotationMatrix(spaceObject.matrixWorld);
        return intersectSphere(fromPosition, fromQuaternion, options.radius ?? defaultGrabPointerOptions.radius, scene, 'grab', pointerCapture);
    }, undefined, undefined, undefined, options);
}
