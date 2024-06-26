import { Quaternion, Vector2, Vector3 } from 'three';
import { Pointer } from './pointer.js';
import { PointerEvent } from './event.js';
import { intersectRayFromCamera } from './intersections/ray.js';
const vectorHelper = new Vector3();
const vector2Helper = new Vector2();
const quaternionHelper = new Quaternion();
function htmlEventToCoords(element, e, target) {
    if (!(e instanceof globalThis.MouseEvent)) {
        return target.set(0, 0);
    }
    const { width, height } = element.getBoundingClientRect();
    const x = e.pageX - element.offsetLeft;
    const y = e.pageY - element.offsetTop;
    return target.set((x / width) * 2 - 1, -(y / height) * 2 + 1);
}
/**
 * sets the `pointerTypePrefix` to `"screen-"`. Therefore, a event with pointerType `touch` is forwarded to the scene as `"screen-touch"`
 */
export function forwardHtmlEvents(fromElement, toCamera, toScene, options) {
    const setPointerCapture = (nativeEvent) => {
        if (!(nativeEvent instanceof globalThis.PointerEvent)) {
            return;
        }
        fromElement.setPointerCapture(nativeEvent.pointerId);
    };
    const releasePointerCapture = (nativeEvent) => {
        if (!(nativeEvent instanceof globalThis.PointerEvent)) {
            return;
        }
        fromElement.releasePointerCapture(nativeEvent.pointerId);
    };
    return forwardEvents(fromElement, toCamera, toScene, htmlEventToCoords.bind(null, fromElement), setPointerCapture, releasePointerCapture, {
        pointerTypePrefix: 'screen-',
        ...options,
    });
}
function portalEventToCoords(e, target) {
    if (!(e instanceof PointerEvent)) {
        return target.set(0, 0);
    }
    if (e.uv == null) {
        return target.set(0, 0);
    }
    target.copy(e.uv).multiplyScalar(2).addScalar(-1);
    target.y *= -1;
    return target;
}
function objectSetPointerCapture(nativeEvent) {
    if (!(nativeEvent instanceof PointerEvent)) {
        return;
    }
    nativeEvent.target.setPointerCapture();
}
function objectReleasePointerCapture(nativeEvent) {
    if (!(nativeEvent instanceof PointerEvent)) {
        return;
    }
    nativeEvent.target.releasePointerCapture();
}
export function forwardObjectEvents(fromPortal, toCamera, toScene, options) {
    return forwardEvents(fromPortal, toCamera, toScene, portalEventToCoords, objectSetPointerCapture, objectReleasePointerCapture, options);
}
/**
 * @returns cleanup function
 */
function forwardEvents(from, toCamera, toScene, toCoords, setPointerCapture, releasePointerCapture, options = {}) {
    const forwardPointerCapture = options?.forwardPointerCapture ?? true;
    const pointerMap = new Map();
    const pointerTypePrefix = options.pointerTypePrefix ?? 'forward-';
    const getPointer = ({ pointerId = -1, pointerType = 'mouse', pointerState }) => {
        let pointer = pointerMap.get(pointerId);
        if (pointer != null) {
            return pointer;
        }
        if (!pointerType.startsWith(pointerTypePrefix)) {
            pointerType = `${pointerTypePrefix}${pointerType}`;
        }
        const computeIntersection = (scene, nativeEvent, pointerCapture) => intersectRayFromCamera(toCamera, toCoords(nativeEvent, vector2Helper), toCamera.getWorldPosition(vectorHelper), toCamera.getWorldQuaternion(quaternionHelper), scene, pointerType, pointerCapture);
        pointerMap.set(pointerId, (pointer = new Pointer(pointerId, pointerType, pointerState, computeIntersection, undefined, forwardPointerCapture ? setPointerCapture : undefined, forwardPointerCapture ? releasePointerCapture : undefined, options)));
        return pointer;
    };
    const pointerMoveListener = (e) => getPointer(e).move(toScene, e);
    const pointerCancelListener = (e) => getPointer(e).cancel(e);
    const pointerDownListener = (e) => void (hasButton(e) && getPointer(e).down(e));
    const pointerUpListener = (e) => void (hasButton(e) && getPointer(e).up(e));
    const pointerLeaveListener = (e) => getPointer(e).exit(e);
    const wheelListener = (e) => getPointer(e).wheel(toScene, e, false);
    from.addEventListener('pointermove', pointerMoveListener);
    from.addEventListener('pointercancel', pointerCancelListener);
    from.addEventListener('pointerdown', pointerDownListener);
    from.addEventListener('pointerup', pointerUpListener);
    from.addEventListener('pointerleave', pointerLeaveListener);
    from.addEventListener('wheel', wheelListener);
    return () => {
        from.removeEventListener('pointermove', pointerMoveListener);
        from.removeEventListener('pointercancel', pointerCancelListener);
        from.removeEventListener('pointerdown', pointerDownListener);
        from.removeEventListener('pointerup', pointerUpListener);
        from.removeEventListener('pointerleave', pointerLeaveListener);
        from.removeEventListener('wheel', wheelListener);
    };
}
function hasButton(val) {
    return val.button != null;
}
