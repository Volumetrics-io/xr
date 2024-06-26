import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createXRStore as createXRStoreImpl, } from '@pmndrs/xr/internals';
import { useFrame, useThree, useStore as useRootStore } from '@react-three/fiber';
import { useContext, useEffect } from 'react';
import { useStore } from 'zustand';
import { xrContext } from './contexts.js';
import { XRElements } from './elements.js';
export function createXRStore(options) {
    return createXRStoreImpl(options);
}
export function XR({ children, store }) {
    store.setWebXRManager(useThree((s) => s.gl.xr));
    const rootStore = useRootStore();
    useEffect(() => {
        let initialCamera;
        return store.subscribe((state, prevState) => {
            const isInXR = state.mode != null;
            const wasInXR = prevState.mode != null;
            if (isInXR === wasInXR) {
                return;
            }
            //mode has changed
            if (isInXR) {
                const { camera, gl } = rootStore.getState();
                initialCamera = camera;
                rootStore.setState({ camera: gl.xr.getCamera() });
                return;
            }
            if (initialCamera == null) {
                //we always were in xr?
                return;
            }
            rootStore.setState({ camera: initialCamera });
        });
    }, [rootStore, store]);
    useFrame((state, _delta, frame) => store.onBeforeFrame(state.scene, state.camera, frame), -1000);
    return (_jsxs(xrContext.Provider, { value: store, children: [_jsx(XRElements, {}), children] }));
}
export function useXRStore() {
    const store = useContext(xrContext);
    if (store == null) {
        throw new Error(`XR features can only be used inside the <XR> component`);
    }
    return store;
}
export function useXR(selector = (state) => state) {
    return useStore(useXRStore(), selector);
}
