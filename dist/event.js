import { getObjectListeners } from './utils.js';
export class PointerEvent {
    type;
    bubbles;
    nativeEvent;
    pointer;
    intersection;
    //--- pointer events data
    target;
    currentTarget;
    get pointerId() {
        return this.pointer.id;
    }
    get pointerType() {
        return this.pointer.type;
    }
    get pointerState() {
        return this.pointer.state;
    }
    get timeStamp() {
        return this.nativeEvent.timeStamp;
    }
    get shiftKey() {
        return this.nativeEvent.shiftKey ?? false;
    }
    get metaKey() {
        return this.nativeEvent.metaKey ?? false;
    }
    get ctrlKey() {
        return this.nativeEvent.ctrlKey ?? false;
    }
    get altKey() {
        return this.nativeEvent.altKey ?? false;
    }
    //--- intersection data
    get distance() {
        return this.intersection.distance;
    }
    get distanceToRay() {
        return this.intersection.distanceToRay;
    }
    get point() {
        return this.intersection.point;
    }
    get index() {
        return this.intersection.index;
    }
    get face() {
        return this.intersection.face;
    }
    get faceIndex() {
        return this.intersection.faceIndex;
    }
    get uv() {
        return this.intersection.uv;
    }
    get uv1() {
        return this.intersection.uv1;
    }
    get normal() {
        return this.intersection.normal;
    }
    get instanceId() {
        return this.intersection.instanceId;
    }
    get pointOnLine() {
        return this.intersection.pointOnLine;
    }
    get batchId() {
        return this.intersection.batchId;
    }
    get pointerPosition() {
        return this.intersection.pointerPosition;
    }
    get pointerQuaternion() {
        return this.intersection.pointerQuaternion;
    }
    get pointOnFace() {
        return this.intersection.pointOnFace;
    }
    get localPoint() {
        return this.intersection.localPoint;
    }
    get details() {
        return this.intersection.details;
    }
    /** same as target */
    get object() {
        return this.target;
    }
    /** same as currentTarget */
    get currentObject() {
        return this.currentTarget;
    }
    //the stop propagation functions will be set while propagating
    stopPropagation;
    stopImmediatePropagation;
    constructor(type, bubbles, nativeEvent, pointer, intersection, currentObject = intersection.object, target) {
        this.type = type;
        this.bubbles = bubbles;
        this.nativeEvent = nativeEvent;
        this.pointer = pointer;
        this.intersection = intersection;
        const pointerCaptureTarget = pointer.createPointerCaptureTarget(nativeEvent, currentObject, intersection);
        this.target = target ?? Object.assign(currentObject, pointerCaptureTarget);
        this.currentTarget = Object.assign(currentObject, pointerCaptureTarget);
    }
    /**
     * for internal use
     */
    retarget(currentObject) {
        const { type, bubbles, nativeEvent, pointer, intersection, target } = this;
        return new PointerEvent(type, bubbles, nativeEvent, pointer, intersection, currentObject, target);
    }
}
export class WheelEvent extends PointerEvent {
    get deltaX() {
        return this.nativeEvent.deltaX;
    }
    get deltaY() {
        return this.nativeEvent.deltaY;
    }
    get deltaZ() {
        return this.nativeEvent.deltaZ;
    }
    constructor(nativeEvent, pointer, intersection) {
        super('wheel', true, nativeEvent, pointer, intersection);
    }
}
export function emitPointerEvent(event) {
    emitPointerEventRec(event, event.currentObject);
}
function emitPointerEventRec(baseEvent, currentObject) {
    if (currentObject == null) {
        return;
    }
    const listeners = getObjectListeners(currentObject, baseEvent.type);
    let propagationStopped = !baseEvent.bubbles;
    if (listeners != null && listeners.length > 0) {
        const event = baseEvent.retarget(currentObject);
        const length = listeners.length;
        event.stopPropagation = () => (propagationStopped = true);
        let loopStopped = false;
        event.stopImmediatePropagation = () => {
            propagationStopped = true;
            loopStopped = true;
        };
        for (let i = 0; i < length && !loopStopped; i++) {
            listeners[i](event);
        }
    }
    if (propagationStopped) {
        return;
    }
    emitPointerEventRec(baseEvent, currentObject.parent);
}
