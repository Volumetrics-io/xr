import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { context, reconciler, useStore, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useMemo } from 'react';
import { xrControllerContext, xrGazeContext, xrHandContext, xrMeshContext, xrPlaneContext, xrReferenceSpaceContext, xrScreenInputContext, xrTransientPointerContext, } from './contexts.js';
import { useXR } from './xr.js';
import { objectToKey } from './utils.js';
import { XRSpace } from './space.js';
import { resolveDetectedImplementation, resolveInputSourceImplementation } from '@pmndrs/xr/internals';
import { useXRSessionVisibilityState } from './hooks.js';
import { DefaultXRController, DefaultXRGaze, DefaultXRHand, DefaultXRScreenInput, DefaultXRTransientPointer, } from './default.js';
export function XRElements({ children }) {
    const xr = useThree((s) => s.gl.xr);
    const origin = useXR((xr) => xr.origin);
    const referenceSpace = useCallback(() => xr.getReferenceSpace(), [xr]);
    const visible = useXRSessionVisibilityState() === 'visible';
    const store = useStore();
    const storeWithOriginAsScene = useMemo(() => Object.assign({}, store, {
        getState() {
            return { ...store.getState(), scene: origin };
        },
    }), [origin, store]);
    if (origin == null) {
        return;
    }
    return (_jsx(_Fragment, { children: reconciler.createPortal(_jsx(context.Provider, { value: store, children: _jsxs(xrReferenceSpaceContext.Provider, { value: referenceSpace, children: [_jsxs("group", { matrixAutoUpdate: false, visible: visible, children: [_jsx(XRControllers, {}), _jsx(XRHands, {}), _jsx(XRTransientPointers, {}), _jsx(XRGazes, {}), _jsx(XRScreenInputs, {})] }), _jsx(XRDetectedMeshes, {}), _jsx(XRDetectedPlanes, {}), children] }) }), storeWithOriginAsScene, null) }));
}
function XRControllers() {
    const controllerStates = useXR((xr) => xr.controllerStates);
    let implementation = useXR((xr) => xr.controller);
    if (implementation === false) {
        return;
    }
    return (_jsx(_Fragment, { children: controllerStates.map((state) => {
            const ResolvedImpl = resolveInputSourceImplementation(implementation, state.inputSource.handedness, {});
            if (ResolvedImpl == null) {
                return null;
            }
            return (_jsx(XRSpace, { space: state.inputSource.gripSpace, children: _jsx(xrControllerContext.Provider, { value: state, children: _jsx(Suspense, { children: typeof ResolvedImpl === 'function' ? _jsx(ResolvedImpl, {}) : _jsx(DefaultXRController, { ...ResolvedImpl }) }) }) }, objectToKey(state)));
        }) }));
}
function XRHands() {
    const handStates = useXR((xr) => xr.handStates);
    const implementation = useXR((xr) => xr.hand);
    if (implementation == false) {
        return;
    }
    return (_jsx(_Fragment, { children: handStates.map((state) => {
            const ResolvedImpl = resolveInputSourceImplementation(implementation, state.inputSource.handedness, {});
            if (ResolvedImpl == null) {
                return null;
            }
            return (_jsx(XRSpace, { space: () => state.inputSource.hand.get('wrist'), children: _jsx(xrHandContext.Provider, { value: state, children: _jsx(Suspense, { children: typeof ResolvedImpl === 'function' ? _jsx(ResolvedImpl, {}) : _jsx(DefaultXRHand, { ...ResolvedImpl }) }) }) }, objectToKey(state)));
        }) }));
}
function XRTransientPointers() {
    const transientPointerStates = useXR((xr) => xr.transientPointerStates);
    const implementation = useXR((xr) => xr.transientPointer);
    if (implementation == false) {
        return;
    }
    return (_jsx(_Fragment, { children: transientPointerStates.map((state) => {
            const ResolvedImpl = resolveInputSourceImplementation(implementation, state.inputSource.handedness, {});
            if (ResolvedImpl == null) {
                return null;
            }
            return (_jsx(XRSpace, { space: () => state.inputSource.targetRaySpace, children: _jsx(xrTransientPointerContext.Provider, { value: state, children: _jsx(Suspense, { children: typeof ResolvedImpl === 'function' ? (_jsx(ResolvedImpl, {})) : (_jsx(DefaultXRTransientPointer, { ...ResolvedImpl })) }) }) }, objectToKey(state)));
        }) }));
}
function XRGazes() {
    const gazeStates = useXR((xr) => xr.gazeStates);
    const Implementation = useXR((xr) => xr.gaze);
    if (Implementation === false) {
        return;
    }
    return (_jsx(_Fragment, { children: gazeStates.map((state) => {
            return (_jsx(XRSpace, { space: () => state.inputSource.targetRaySpace, children: _jsx(xrGazeContext.Provider, { value: state, children: _jsx(Suspense, { children: typeof Implementation === 'function' ? _jsx(Implementation, {}) : _jsx(DefaultXRGaze, { ...Implementation }) }) }) }, objectToKey(state)));
        }) }));
}
function XRScreenInputs() {
    const screenInputStates = useXR((xr) => xr.screenInputStates);
    const Implementation = useXR((xr) => xr.screenInput);
    if (Implementation === false) {
        return;
    }
    return (_jsx(_Fragment, { children: screenInputStates.map((state) => {
            return (_jsx(XRSpace, { space: () => state.inputSource.targetRaySpace, children: _jsx(xrScreenInputContext.Provider, { value: state, children: _jsx(Suspense, { children: typeof Implementation === 'function' ? (_jsx(Implementation, {})) : (_jsx(DefaultXRScreenInput, { ...Implementation })) }) }) }, objectToKey(state)));
        }) }));
}
function XRDetectedMeshes() {
    const meshes = useXR((xr) => xr.detectedMeshes);
    const implementation = useXR((xr) => xr.detectedMesh);
    if (implementation === false) {
        return;
    }
    return (_jsx(_Fragment, { children: meshes.map((mesh) => {
            const ResolvedImpl = resolveDetectedImplementation(implementation, mesh.semanticLabel, false);
            if (ResolvedImpl === false) {
                return null;
            }
            return (_jsx(XRSpace, { space: mesh.meshSpace, children: _jsx(xrMeshContext.Provider, { value: mesh, children: _jsx(Suspense, { children: _jsx(ResolvedImpl, {}) }) }) }, objectToKey(mesh)));
        }) }));
}
function XRDetectedPlanes() {
    const planes = useXR((xr) => xr.detectedPlanes);
    const implementation = useXR((xr) => xr.detectedPlane);
    if (implementation == null) {
        return;
    }
    return (_jsx(_Fragment, { children: planes.map((plane) => {
            const ResolvedImpl = resolveDetectedImplementation(implementation, plane.semanticLabel, false);
            if (ResolvedImpl === false) {
                return null;
            }
            return (_jsx(XRSpace, { space: plane.planeSpace, children: _jsx(xrPlaneContext.Provider, { value: plane, children: _jsx(Suspense, { children: _jsx(ResolvedImpl, {}) }) }) }, objectToKey(plane)));
        }) }));
}
