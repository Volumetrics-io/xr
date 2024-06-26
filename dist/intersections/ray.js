import { Matrix4, Plane, Ray, Raycaster, Vector3, } from 'three';
import { computeIntersectionWorldPlane, traversePointerEventTargets } from './utils.js';
const raycaster = new Raycaster();
const directionHelper = new Vector3();
const planeHelper = new Plane();
const invertedMatrixHelper = new Matrix4();
const intersectsHelper = [];
export function intersectRay(fromPosition, fromQuaternion, direction, scene, pointerType, pointerCapture) {
    if (pointerCapture != null) {
        return intersectRayPointerCapture(fromPosition, fromQuaternion, direction, pointerCapture);
    }
    let closestIntersections;
    raycaster.ray.origin.copy(fromPosition);
    raycaster.ray.direction.copy(direction).applyQuaternion(fromQuaternion);
    traversePointerEventTargets(scene, pointerType, (object) => {
        object.raycast(raycaster, intersectsHelper);
        const length = intersectsHelper.length;
        for (let i = 0; i < length; i++) {
            invertedMatrixHelper.copy(object.matrixWorld).invert();
            const newIntersection = intersectsHelper[i];
            if (closestIntersections != null && closestIntersections.distance <= newIntersection.distance) {
                continue;
            }
            closestIntersections = newIntersection;
        }
        intersectsHelper.length = 0;
    });
    if (closestIntersections == null) {
        return undefined;
    }
    return Object.assign(closestIntersections, {
        details: {
            type: 'ray',
        },
        pointerPosition: fromPosition.clone(),
        pointerQuaternion: fromQuaternion.clone(),
        pointOnFace: closestIntersections.point,
        localPoint: closestIntersections.point.clone().applyMatrix4(invertedMatrixHelper),
    });
}
const rayHelper = new Ray();
function intersectRayPointerCapture(fromPosition, fromQuaternion, direction, { intersection, object }) {
    if (intersection.details.type != 'ray') {
        return undefined;
    }
    directionHelper.copy(direction).applyQuaternion(fromQuaternion);
    rayHelper.set(fromPosition, directionHelper);
    computeIntersectionWorldPlane(planeHelper, intersection, object);
    const pointOnFace = rayHelper.intersectPlane(planeHelper, new Vector3()) ?? intersection.point;
    return {
        ...intersection,
        object,
        pointOnFace,
        point: directionHelper.clone().multiplyScalar(intersection.distance).add(fromPosition),
        pointerPosition: fromPosition.clone(),
        pointerQuaternion: fromQuaternion.clone(),
    };
}
export function intersectRayFromCamera(from, coords, fromPosition, fromQuaternion, scene, pointerType, pointerCapture) {
    if (pointerCapture != null) {
        return intersectRayFromCameraPointerCapture(from, coords, fromPosition, fromQuaternion, pointerCapture);
    }
    let clostestIntersection;
    raycaster.setFromCamera(coords, from);
    planeHelper.setFromNormalAndCoplanarPoint(from.getWorldDirection(directionHelper), raycaster.ray.origin);
    traversePointerEventTargets(scene, pointerType, (object) => {
        object.raycast(raycaster, intersectsHelper);
        const length = intersectsHelper.length;
        for (let i = 0; i < length; i++) {
            const newIntersection = intersectsHelper[i];
            if (clostestIntersection != null && clostestIntersection.distance <= newIntersection.distance) {
                continue;
            }
            invertedMatrixHelper.copy(object.matrixWorld).invert();
            clostestIntersection = newIntersection;
        }
        intersectsHelper.length = 0;
    });
    if (clostestIntersection == null) {
        return undefined;
    }
    return Object.assign(clostestIntersection, {
        details: {
            type: 'camera-ray',
            distanceViewPlane: planeHelper.distanceToPoint(clostestIntersection.point),
        },
        pointOnFace: clostestIntersection.point,
        pointerPosition: fromPosition.clone(),
        pointerQuaternion: fromQuaternion.clone(),
        localPoint: clostestIntersection.point.clone().applyMatrix4(invertedMatrixHelper),
    });
}
function intersectRayFromCameraPointerCapture(from, coords, fromPosition, fromQuaternion, { intersection, object }) {
    const details = intersection.details;
    if (details.type != 'camera-ray') {
        return undefined;
    }
    raycaster.setFromCamera(coords, from);
    from.getWorldDirection(directionHelper);
    //set the plane to the viewPlane + the distance of the prev intersection in the camera distance
    planeHelper.setFromNormalAndCoplanarPoint(directionHelper, raycaster.ray.origin);
    planeHelper.constant -= details.distanceViewPlane;
    //find captured intersection point by intersecting the ray to the plane of the camera
    const point = raycaster.ray.intersectPlane(planeHelper, new Vector3());
    if (point == null) {
        return undefined;
    }
    computeIntersectionWorldPlane(planeHelper, intersection, object);
    const pointOnFace = raycaster.ray.intersectPlane(planeHelper, new Vector3()) ?? point;
    return {
        ...intersection,
        object,
        point,
        pointOnFace,
        pointerPosition: fromPosition.clone(),
        pointerQuaternion: fromQuaternion.clone(),
    };
}
