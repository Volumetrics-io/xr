import { bindPointerXRSessionEvent, defaultGrabPointerOpacity, defaultRayPointerOpacity, defaultTouchPointerOpacity, } from '../pointer/index.js';
import { PointerRayModel, PointerCursorModel } from './pointer.js';
import { XRSpace } from './space.js';
import { XRHandModel } from './hand.js';
import { XRControllerModel } from './controller.js';
import { setupSyncIsVisible } from '../visible.js';
import { CombinedPointer, createGrabPointer, createRayPointer, createTouchPointer, } from '@pmndrs/pointer-events';
import { onXRFrame } from './utils.js';
export function createDefaultXRInputSourceRayPointer(scene, store, space, state, session, options, combined, makeDefault) {
    //the space must be created before the pointer to make sure that the space is updated before the pointer
    const raySpace = new XRSpace(() => state.inputSource.targetRaySpace);
    const pointer = createRayPointer({ current: raySpace }, state, options);
    const cleanupPointer = setupPointer(scene, store, pointer, combined, makeDefault);
    const unbind = bindPointerXRSessionEvent(pointer, session, state.inputSource, 'select');
    space.add(raySpace);
    let undoAddRayModel;
    if (options?.rayModel !== false) {
        const rayModel = new PointerRayModel(pointer, { opacity: defaultRayPointerOpacity, ...options?.rayModel });
        raySpace.add(rayModel);
        undoAddRayModel = () => raySpace.remove(rayModel);
    }
    let undoAddCursorModel;
    if (options?.cursorModel !== false) {
        const cursorModel = new PointerCursorModel(pointer, {
            opacity: defaultRayPointerOpacity,
        });
        scene.add(cursorModel);
        undoAddCursorModel = () => scene.remove(cursorModel);
    }
    return () => {
        pointer.exit({ timeStamp: performance.now() });
        space.remove(raySpace);
        undoAddRayModel?.();
        undoAddCursorModel?.();
        unbind();
        cleanupPointer();
    };
}
function setupPointer(scene, store, pointer, combined, makeDefault) {
    if (combined != null) {
        return combined?.register(pointer, makeDefault ?? false);
    }
    onXRFrame(() => pointer.move(scene, { timeStamp: performance.now() }));
    return setupSyncIsVisible(store, (visible) => pointer.setEnabled(visible, { timeStamp: performance.now() }));
}
export function createDefaultXRInputSourceGrabPointer(scene, store, space, state, gripSpace, session, event, options, combined, makeDefault) {
    //the space must be created before the pointer to make sure that the space is updated before the pointer
    const gripSpaceObject = new XRSpace(gripSpace);
    const pointer = createGrabPointer({ current: gripSpaceObject }, state, options);
    const cleanupPointer = setupPointer(scene, store, pointer, combined, makeDefault);
    const unbind = bindPointerXRSessionEvent(pointer, session, state.inputSource, event);
    space.add(gripSpaceObject);
    let undoAddCursorModel;
    if (options?.cursorModel !== false) {
        const cursorModel = new PointerCursorModel(pointer, {
            opacity: defaultGrabPointerOpacity,
        });
        scene.add(cursorModel);
        undoAddCursorModel = () => scene.remove(cursorModel);
    }
    return () => {
        cleanupPointer();
        pointer.exit({ timeStamp: performance.now() });
        space.remove(gripSpaceObject);
        undoAddCursorModel?.();
        unbind();
    };
}
export function createDefaultXRHandTouchPointer(scene, store, space, state, options, combined, makeDefault) {
    //the space must be created before the pointer to make sure that the space is updated before the pointer
    const touchSpaceObject = new XRSpace(() => state.inputSource.hand.get('index-finger-tip'));
    const pointer = createTouchPointer({ current: touchSpaceObject }, state, options);
    const cleanupPointer = setupPointer(scene, store, pointer, combined, makeDefault);
    space.add(touchSpaceObject);
    let undoAddCursorModel;
    if (options?.cursorModel !== false) {
        const cursorModel = new PointerCursorModel(pointer, {
            opacity: defaultTouchPointerOpacity,
            ...options?.cursorModel,
        });
        scene.add(cursorModel);
        undoAddCursorModel = () => scene.remove(cursorModel);
    }
    return () => {
        cleanupPointer();
        pointer.exit({ timeStamp: performance.now() });
        space.remove(touchSpaceObject);
        undoAddCursorModel?.();
    };
}
export function createDefaultXRHand(scene, store, space, state, session, options) {
    const combined = new CombinedPointer();
    onXRFrame(() => combined.move(scene, { timeStamp: performance.now() }));
    setupSyncIsVisible(store, (visible) => combined.setEnabled(visible, { timeStamp: performance.now() }));
    const destroyRayPointer = options?.rayPointer === false
        ? undefined
        : createDefaultXRInputSourceRayPointer(scene, store, space, state, session, {
            minDistance: 0.2,
            ...options?.rayPointer,
            rayModel: {
                maxLength: 0.2,
                ...options?.rayPointer?.rayModel,
            },
        }, combined, true);
    const destroyGrabPointer = options?.grabPointer === false
        ? undefined
        : createDefaultXRInputSourceGrabPointer(scene, store, space, state, () => state.inputSource.hand.get('index-finger-tip'), session, 'select', options?.grabPointer, combined);
    const destroyTouchPointer = options?.touchPointer === false
        ? undefined
        : createDefaultXRHandTouchPointer(scene, store, space, state, options?.touchPointer, combined);
    let removeModel;
    if (options?.model !== false) {
        const model = new XRHandModel(state.inputSource.hand, state.assetPath, options?.model);
        space.add(model);
        removeModel = () => space.remove(model);
    }
    return () => {
        destroyRayPointer?.();
        destroyGrabPointer?.();
        destroyTouchPointer?.();
        removeModel?.();
    };
}
export function createDefaultXRController(scene, store, space, state, session, options) {
    const combined = new CombinedPointer();
    onXRFrame(() => combined.move(scene, { timeStamp: performance.now() }));
    setupSyncIsVisible(store, (visible) => combined.setEnabled(visible, { timeStamp: performance.now() }));
    const destroyRayPointer = options?.rayPointer === false
        ? undefined
        : createDefaultXRInputSourceRayPointer(scene, store, space, state, session, { minDistance: 0.2, ...options?.rayPointer }, combined, true);
    const destroyGrabPointer = options?.grabPointer === false
        ? undefined
        : createDefaultXRInputSourceGrabPointer(scene, store, space, state, () => state.inputSource.gripSpace, session, 'squeeze', options?.grabPointer, combined);
    let removeModel;
    if (options?.model !== false) {
        const model = new XRControllerModel(state.layout, state.gamepad, options?.model);
        space.add(model);
        removeModel = () => space.remove(model);
    }
    return () => {
        destroyRayPointer?.();
        destroyGrabPointer?.();
        removeModel?.();
    };
}
export function createDefaultXRTransientPointer(scene, store, space, state, session, options, combined, makeDefault) {
    //the space must be created before the pointer to make sure that the space is updated before the pointer
    const raySpace = new XRSpace(() => state.inputSource.targetRaySpace);
    const pointer = createRayPointer({ current: raySpace }, state, options);
    const cleanupPointer = setupPointer(scene, store, pointer, combined, makeDefault);
    const unbind = bindPointerXRSessionEvent(pointer, session, state.inputSource, 'select');
    space.add(raySpace);
    let undoAddCursorModel;
    if (options?.cursorModel !== false) {
        const cursorModel = new PointerCursorModel(pointer, {
            opacity: defaultRayPointerOpacity,
            ...options?.cursorModel,
        });
        scene.add(cursorModel);
        undoAddCursorModel = () => scene.remove(cursorModel);
    }
    return () => {
        cleanupPointer();
        pointer.exit({ timeStamp: performance.now() });
        space.remove(raySpace);
        undoAddCursorModel?.();
        unbind();
    };
}
export function createDefaultXRGaze(scene, store, space, state, session, options) {
    //the space must be created before the pointer to make sure that the space is updated before the pointer
    const raySpace = new XRSpace(() => state.inputSource.targetRaySpace);
    const pointer = createRayPointer({ current: raySpace }, state, options);
    const cleanupPointer = setupPointer(scene, store, pointer, undefined, undefined);
    const unbind = bindPointerXRSessionEvent(pointer, session, state.inputSource, 'select');
    space.add(raySpace);
    let undoAddCursorModel;
    if (options?.cursorModel !== false) {
        const cursorModel = new PointerCursorModel(pointer, {
            opacity: defaultRayPointerOpacity,
            ...options?.cursorModel,
        });
        scene.add(cursorModel);
        undoAddCursorModel = () => scene.remove(cursorModel);
    }
    return () => {
        cleanupPointer();
        pointer.exit({ timeStamp: performance.now() });
        space.remove(raySpace);
        undoAddCursorModel?.();
        unbind();
    };
}
export function createDefaultXRScreenInput(scene, store, space, state, session, options) {
    //the space must be created before the pointer to make sure that the space is updated before the pointer
    const raySpace = new XRSpace(() => state.inputSource.targetRaySpace);
    const pointer = createRayPointer({ current: raySpace }, state, options);
    const cleanupPointer = setupPointer(scene, store, pointer, undefined, undefined);
    const unbind = bindPointerXRSessionEvent(pointer, session, state.inputSource, 'select');
    space.add(raySpace);
    return () => {
        cleanupPointer();
        space.remove(raySpace);
        pointer.exit({ timeStamp: performance.now() });
        unbind();
    };
}
