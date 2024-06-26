import { Line3, Matrix4, Plane, Quaternion, Ray, Raycaster, Vector3, } from 'three';
import { computeIntersectionWorldPlane, traversePointerEventTargets } from './utils.js';
const raycaster = new Raycaster();
const invertedMatrixHelper = new Matrix4();
const intersectsHelper = [];
export function intersectLines(fromMatrixWorld, linePoints, scene, pointerType, pointerCapture) {
    if (pointerCapture != null) {
        return intersectLinesPointerCapture(fromMatrixWorld, linePoints, pointerCapture);
    }
    let clostestIntersection;
    traversePointerEventTargets(scene, pointerType, (object) => {
        let prevAccLineLength = 0;
        for (let i = 1; i < linePoints.length && clostestIntersection == null; i++) {
            const start = linePoints[i - 1];
            const end = linePoints[i];
            //transform from local object to world
            raycaster.ray.origin.copy(start).applyMatrix4(fromMatrixWorld);
            raycaster.ray.direction.copy(end).applyMatrix4(fromMatrixWorld);
            //compute length & normalized direction
            raycaster.ray.direction.sub(raycaster.ray.origin);
            const lineLength = raycaster.ray.direction.length();
            raycaster.ray.direction.divideScalar(lineLength);
            raycaster.far = lineLength;
            object.raycast(raycaster, intersectsHelper);
            const length = intersectsHelper.length;
            for (let i = 0; i < length; i++) {
                const intersection = intersectsHelper[i];
                const distanceOnLine = intersection.distance;
                intersection.distance += prevAccLineLength;
                if (clostestIntersection != null && clostestIntersection.distance <= intersection.distance) {
                    continue;
                }
                clostestIntersection = Object.assign(intersection, {
                    details: {
                        lineIndex: i - 1,
                        distanceOnLine,
                    },
                });
            }
            intersectsHelper.length = 0;
            prevAccLineLength += lineLength;
        }
    });
    if (clostestIntersection == null) {
        return undefined;
    }
    return Object.assign(clostestIntersection, {
        details: {
            ...clostestIntersection.details,
            type: 'lines',
        },
        pointerPosition: new Vector3().setFromMatrixPosition(fromMatrixWorld),
        pointerQuaternion: new Quaternion().setFromRotationMatrix(fromMatrixWorld),
        pointOnFace: clostestIntersection.point,
        localPoint: clostestIntersection.point
            .clone()
            .applyMatrix4(invertedMatrixHelper.copy(clostestIntersection.object.matrixWorld).invert()),
    });
}
const lineHelper = new Line3();
const planeHelper = new Plane();
function intersectLinesPointerCapture(fromMatrixWorld, linePoints, { intersection, object }) {
    const details = intersection.details;
    if (details.type != 'lines') {
        return undefined;
    }
    lineHelper.set(linePoints[details.lineIndex], linePoints[details.lineIndex + 1]).applyMatrix4(fromMatrixWorld);
    const point = lineHelper.at(details.distanceOnLine / lineHelper.distance(), new Vector3());
    computeIntersectionWorldPlane(planeHelper, intersection, object);
    const pointOnFace = backwardsIntersectionLinesWithPlane(fromMatrixWorld, linePoints, planeHelper) ?? point;
    return {
        ...intersection,
        pointOnFace,
        point,
        pointerPosition: new Vector3().setFromMatrixPosition(fromMatrixWorld),
        pointerQuaternion: new Quaternion().setFromRotationMatrix(fromMatrixWorld),
    };
}
const vectorHelper = new Vector3();
const rayHelper = new Ray();
function backwardsIntersectionLinesWithPlane(fromMatrixWorld, linePoints, plane) {
    for (let i = linePoints.length - 1; i > 0; i--) {
        const start = linePoints[i - 1];
        const end = linePoints[i];
        rayHelper.origin.copy(start).applyMatrix4(fromMatrixWorld);
        rayHelper.direction.copy(end).applyMatrix4(fromMatrixWorld).sub(raycaster.ray.origin).normalize();
        const point = rayHelper.intersectPlane(plane, vectorHelper);
        if (point != null) {
            return vectorHelper.clone();
        }
    }
    return undefined;
}
