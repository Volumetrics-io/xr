import { Group } from 'three';
import { createXRStore as createXRStoreImpl } from '../store.js';
import { setupSyncXRElements } from './elements.js';
import { forwardHtmlEvents } from '@pmndrs/pointer-events';
import { setupProvideReferenceSpace } from './utils.js';
export function createXRStore(canvas, scene, camera, xr, options) {
    const cleanupHtmlEventForward = options?.htmlInput === false ? undefined : forwardHtmlEvents(canvas, camera, scene, options?.htmlInput);
    const updatesList = [];
    const store = createXRStoreImpl(options);
    store.setWebXRManager(xr);
    const internalOrigin = new Group();
    internalOrigin.matrixAutoUpdate = false;
    setupProvideReferenceSpace(internalOrigin, () => xr.getReferenceSpace());
    const cleanupSyncElements = setupSyncXRElements(scene, store, internalOrigin, updatesList);
    const unsubscribeOrigin = store.subscribe((state, prevState) => {
        if (state.origin === prevState.origin) {
            return;
        }
        prevState.origin?.remove(internalOrigin);
        state.origin?.add(internalOrigin);
    });
    return Object.assign(store, {
        destroy() {
            store.getState().origin?.remove(internalOrigin);
            unsubscribeOrigin();
            cleanupHtmlEventForward?.();
            cleanupSyncElements();
            store.destroy();
        },
        update(frame) {
            if (frame == null) {
                return;
            }
            store.onBeforeFrame(scene, camera, frame);
            const length = updatesList.length;
            for (let i = 0; i < length; i++) {
                updatesList[i](frame);
            }
        },
    });
}
