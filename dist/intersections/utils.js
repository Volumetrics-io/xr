import { hasObjectListeners } from '../utils.js';
export function computeIntersectionWorldPlane(target, intersection, object) {
    if (intersection.face == null) {
        return false;
    }
    target.setFromNormalAndCoplanarPoint(intersection.face.normal, intersection.localPoint);
    target.applyMatrix4(object.matrixWorld);
    return true;
}
function isPointerEventsAllowed(hasListener, pointerEvents, pointerEventsType, pointerType) {
    if (pointerEvents === 'none') {
        return false;
    }
    if (pointerEvents === 'listener' && !hasListener) {
        return false;
    }
    if (pointerEventsType === 'all') {
        return true;
    }
    if (typeof pointerEventsType === 'function') {
        return pointerEventsType(pointerType);
    }
    let value;
    let invert;
    if ('deny' in pointerEventsType) {
        invert = true;
        value = pointerEventsType.deny;
    }
    else {
        invert = false;
        value = pointerEventsType.allow;
    }
    let result;
    if (Array.isArray(value)) {
        result = value.includes(pointerType);
    }
    else {
        result = value === pointerType;
    }
    return invert ? !result : result;
}
export function traversePointerEventTargets(object, pointerType, callback, parentHasListener = false, parentPointerEvents, parentPointerEventsType) {
    const hasListener = parentHasListener || hasObjectListeners(object);
    const allowedPointerEvents = object.pointerEvents ?? parentPointerEvents ?? 'listener';
    const allowedPointerEventsType = object.pointerEventsType ?? parentPointerEventsType ?? 'all';
    const isAllowed = isPointerEventsAllowed(hasListener, allowedPointerEvents, allowedPointerEventsType, pointerType);
    if (isAllowed) {
        callback(object);
    }
    const length = object.children.length;
    for (let i = 0; i < length; i++) {
        traversePointerEventTargets(object.children[i], pointerType, callback, hasListener, allowedPointerEvents, allowedPointerEventsType);
    }
}
