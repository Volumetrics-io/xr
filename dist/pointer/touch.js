import { Quaternion, Vector3 } from 'three';
import { Pointer } from '../pointer.js';
import { intersectSphere } from '../intersections/index.js';
import { generateUniquePointerId } from './index.js';
export const defaultTouchPointerOptions = {
    button: 0,
    downRadius: 0.03,
    hoverRadius: 0.1,
};
export function createTouchPointer(space, pointerState, options = defaultTouchPointerOptions) {
    const fromPosition = new Vector3();
    const fromQuaternion = new Quaternion();
    return new Pointer(generateUniquePointerId(), 'touch', pointerState, (scene, _, pointerCapture) => {
        const spaceObject = space.current;
        if (spaceObject == null) {
            return undefined;
        }
        spaceObject.updateWorldMatrix(true, false);
        fromPosition.setFromMatrixPosition(spaceObject.matrixWorld);
        fromQuaternion.setFromRotationMatrix(spaceObject.matrixWorld);
        return intersectSphere(fromPosition, fromQuaternion, options.hoverRadius ?? defaultTouchPointerOptions.hoverRadius, scene, 'touch', pointerCapture);
    }, createUpdateTouchPointer(options), undefined, undefined, options);
}
function createUpdateTouchPointer(options = defaultTouchPointerOptions) {
    let wasPointerDown = false;
    return (pointer) => {
        if (!pointer.getEnabled()) {
            return;
        }
        const intersection = pointer.getIntersection();
        const isPointerDown = computeIsPointerDown(intersection, options.downRadius ?? defaultTouchPointerOptions.downRadius);
        if (isPointerDown === wasPointerDown) {
            return;
        }
        const nativeEvent = { timeStamp: performance.now(), button: options.button ?? defaultTouchPointerOptions.button };
        if (isPointerDown) {
            pointer.down(nativeEvent);
        }
        else {
            pointer.up(nativeEvent);
        }
        wasPointerDown = isPointerDown;
    };
}
function computeIsPointerDown(intersection, downRadius) {
    if (intersection == null) {
        return false;
    }
    return intersection.distance <= downRadius;
}
