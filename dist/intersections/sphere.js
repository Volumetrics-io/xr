import { InstancedMesh, Matrix4, Mesh, Vector3, Sphere, Quaternion, Plane, } from 'three';
import { computeIntersectionWorldPlane, traversePointerEventTargets } from './utils.js';
const collisionSphere = new Sphere();
const intersectsHelper = [];
export function intersectSphere(fromPosition, fromQuaternion, radius, scene, pointerType, pointerCapture) {
    if (pointerCapture != null) {
        return intersectSpherePointerCapture(fromPosition, fromQuaternion, pointerCapture);
    }
    let clostestIntersection;
    collisionSphere.center.copy(fromPosition);
    collisionSphere.radius = radius;
    traversePointerEventTargets(scene, pointerType, (object) => {
        intersectSphereWithObject(collisionSphere, object, intersectsHelper);
        const length = intersectsHelper.length;
        for (let i = 0; i < length; i++) {
            const intersection = intersectsHelper[i];
            if (clostestIntersection != null && clostestIntersection.distance < intersection.distance) {
                continue;
            }
            clostestIntersection = intersection;
        }
        intersectsHelper.length = 0;
    });
    if (clostestIntersection == null) {
        return undefined;
    }
    return Object.assign(clostestIntersection, {
        details: {
            type: 'sphere',
        },
        pointOnFace: clostestIntersection.point,
        pointerPosition: fromPosition.clone(),
        pointerQuaternion: fromQuaternion.clone(),
        localPoint: clostestIntersection.point
            .clone()
            .applyMatrix4(invertedMatrixHelper.copy(clostestIntersection.object.matrixWorld).invert()),
    });
}
const matrixHelper = new Matrix4();
function isSpherecastable(obj) {
    return 'spherecast' in obj;
}
function intersectSphereWithObject(pointerSphere, object, target) {
    object.updateWorldMatrix(true, false);
    if (isSpherecastable(object)) {
        object.spherecast(pointerSphere, target);
        return;
    }
    if (object instanceof InstancedMesh) {
        if (object.geometry.boundingSphere == null) {
            object.geometry.computeBoundingSphere();
        }
        if (object.geometry.boundingBox == null) {
            object.geometry.computeBoundingBox();
        }
        for (let i = 0; i < object.count; i++) {
            object.getMatrixAt(i, matrixHelper);
            matrixHelper.premultiply(object.matrixWorld);
            if (!isSphereIntersectingMesh(pointerSphere, object, matrixHelper)) {
                continue;
            }
            const intersection = intersectSphereMesh(pointerSphere, object, matrixHelper, i);
            if (intersection == null) {
                continue;
            }
            target.push(intersection);
        }
    }
    if (!(object instanceof Mesh)) {
        return;
    }
    if (!isSphereIntersectingMesh(pointerSphere, object, object.matrixWorld)) {
        return;
    }
    invertedMatrixHelper.copy(object.matrixWorld).invert();
    const intersection = intersectSphereMesh(pointerSphere, object, object.matrixWorld);
    if (intersection == null) {
        return;
    }
    target.push(intersection);
}
const oldInputDevicePointOffset = new Vector3();
const inputDeviceQuaternionOffset = new Quaternion();
const planeHelper = new Plane();
function intersectSpherePointerCapture(fromPosition, fromQuaterion, { intersection, object }) {
    if (intersection.details.type != 'sphere') {
        return undefined;
    }
    //compute old inputDevicePosition-point offset
    oldInputDevicePointOffset.copy(intersection.point).sub(intersection.pointerPosition);
    //compute oldInputDeviceQuaternion-newInputDeviceQuaternion offset
    inputDeviceQuaternionOffset.copy(intersection.pointerQuaternion).invert().multiply(fromQuaterion);
    //apply quaternion offset to old inputDevicePosition-point offset and add to new inputDevicePosition
    const point = oldInputDevicePointOffset.clone().applyQuaternion(inputDeviceQuaternionOffset).add(fromPosition);
    computeIntersectionWorldPlane(planeHelper, intersection, object);
    const pointOnFace = planeHelper.projectPoint(fromPosition, new Vector3());
    return {
        details: {
            type: 'sphere',
        },
        distance: intersection.distance,
        pointerPosition: fromPosition.clone(),
        pointerQuaternion: fromQuaterion.clone(),
        object,
        point,
        pointOnFace,
        face: intersection.face,
        localPoint: intersection.localPoint,
    };
}
const helperSphere = new Sphere();
function isSphereIntersectingMesh(pointerSphere, { geometry }, meshMatrixWorld) {
    if (geometry.boundingSphere == null) {
        geometry.computeBoundingSphere();
    }
    helperSphere.copy(geometry.boundingSphere).applyMatrix4(meshMatrixWorld);
    return helperSphere.center.distanceToSquared(pointerSphere.center) < (pointerSphere.radius + helperSphere.radius) ** 2;
}
const vectorHelper = new Vector3();
const boxSizeHelper = new Vector3();
const boxCenterHelper = new Vector3();
const vec0_0001 = new Vector3(0.0001, 0.0001, 0.0001);
const invertedMatrixHelper = new Matrix4();
function intersectSphereMesh(pointerSphere, mesh, meshMatrixWorld, instanceId) {
    invertedMatrixHelper.copy(meshMatrixWorld).invert();
    helperSphere.copy(pointerSphere).applyMatrix4(invertedMatrixHelper);
    const { geometry } = mesh;
    if (geometry.boundingBox == null) {
        geometry.computeBoundingBox();
    }
    geometry.boundingBox.getSize(boxSizeHelper);
    geometry.boundingBox.getCenter(boxCenterHelper);
    geometry.boundingBox.clampPoint(helperSphere.center, vectorHelper);
    vectorHelper.applyMatrix4(meshMatrixWorld); //world coordinates
    const distanceToSphereCenterSquared = vectorHelper.distanceToSquared(pointerSphere.center);
    if (distanceToSphereCenterSquared > pointerSphere.radius * pointerSphere.radius) {
        return undefined;
    }
    boxSizeHelper.max(vec0_0001);
    const normal = helperSphere.center.clone().sub(boxCenterHelper);
    normal.divide(boxSizeHelper);
    maximizeAxisVector(normal);
    const point = vectorHelper.clone();
    return {
        distance: Math.sqrt(distanceToSphereCenterSquared),
        face: {
            a: 0,
            b: 0,
            c: 0,
            materialIndex: 0,
            normal,
        },
        normal,
        point,
        instanceId,
        object: mesh,
    };
}
function maximizeAxisVector(vec) {
    const absX = Math.abs(vec.x);
    const absY = Math.abs(vec.y);
    const absZ = Math.abs(vec.z);
    if (absX >= absY && absX >= absZ) {
        //x biggest
        vec.set(vec.x < 0 ? -1 : 1, 0, 0);
        return;
    }
    if (absY >= absX && absY >= absZ) {
        //y biggest
        vec.set(0, vec.y < 0 ? -1 : 1, 0);
        return;
    }
    //z biggest
    vec.set(0, 0, vec.z < 0 ? -1 : 1);
}
