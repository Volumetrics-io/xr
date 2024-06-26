import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { CombinedPointer as CombinedPointerImpl, createGrabPointer, createRayPointer, createTouchPointer, defaultGrabPointerOptions, defaultRayPointerOptions, defaultTouchPointerOptions, } from '@pmndrs/pointer-events';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { PointerCursorMaterial, PointerRayMaterial, bindPointerXRSessionEvent, updatePointerCursorModel, updatePointerRayModel, } from '@pmndrs/xr/internals';
import { useXR, useXRStore } from './xr.js';
import { setupSyncIsVisible } from '@pmndrs/xr';
import { combinedPointerContext } from './contexts.js';
export function CombinedPointer({ children }) {
    const pointer = useMemo(() => new CombinedPointerImpl(), []);
    usePointerXRSessionVisibility(pointer);
    useFrame((state) => pointer.move(state.scene, { timeStamp: performance.now() }), -50);
    return _jsx(combinedPointerContext.Provider, { value: pointer, children: children });
}
function useSetupPointer(pointer, makeDefault = false) {
    const combinedPointer = useContext(combinedPointerContext);
    if (combinedPointer == null) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        usePointerXRSessionVisibility(pointer);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useFrame((state) => pointer.move(state.scene, { timeStamp: performance.now() }), -50);
    }
    else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => combinedPointer.register(pointer, makeDefault), [combinedPointer, pointer, makeDefault]);
    }
    useEffect(() => () => pointer.exit({ timeStamp: performance.now() }), [pointer]);
}
export function useGrabPointer(spaceRef, pointerState, currentOptions) {
    const options = useMemo(() => ({}), []);
    Object.assign(options, defaultGrabPointerOptions, currentOptions);
    const pointer = useMemo(() => createGrabPointer(spaceRef, pointerState, options), [spaceRef, pointerState, options]);
    useSetupPointer(pointer, currentOptions?.makeDefault);
    return pointer;
}
export function useRayPointer(spaceRef, pointerState, currentOptions) {
    const options = useMemo(() => ({}), []);
    Object.assign(options, defaultRayPointerOptions, currentOptions);
    const pointer = useMemo(() => createRayPointer(spaceRef, pointerState, options), [spaceRef, pointerState, options]);
    useSetupPointer(pointer, currentOptions?.makeDefault);
    return pointer;
}
export function useTouchPointer(spaceRef, pointerState, currentOptions) {
    const options = useMemo(() => ({}), []);
    Object.assign(options, defaultTouchPointerOptions, currentOptions);
    const pointer = useMemo(() => createTouchPointer(spaceRef, pointerState, options), [spaceRef, pointerState, options]);
    useSetupPointer(pointer, currentOptions?.makeDefault);
    return pointer;
}
export const PointerRayModel = forwardRef((props, ref) => {
    const material = useMemo(() => new PointerRayMaterial(), []);
    const internalRef = useRef(null);
    useImperativeHandle(ref, () => internalRef.current, []);
    useFrame(() => internalRef.current != null && updatePointerRayModel(internalRef.current, material, props.pointer, props));
    return (_jsx("mesh", { matrixAutoUpdate: false, renderOrder: props.renderOrder ?? 2, ref: internalRef, material: material, children: _jsx("boxGeometry", {}) }));
});
export const PointerCursorModel = forwardRef((props, ref) => {
    const material = useMemo(() => new PointerCursorMaterial(), []);
    const internalRef = useRef(null);
    useImperativeHandle(ref, () => internalRef.current, []);
    useFrame(() => internalRef.current != null && updatePointerCursorModel(internalRef.current, material, props.pointer, props));
    const scene = useThree((s) => s.scene);
    return createPortal(_jsx("mesh", { renderOrder: props.renderOrder ?? 1, ref: internalRef, matrixAutoUpdate: false, material: material, children: _jsx("planeGeometry", {}) }), scene);
});
export function usePointerXRSessionEvent(pointer, inputSource, event, missingEvents) {
    const session = useXR((xr) => xr.session);
    useEffect(() => {
        if (session == null) {
            return;
        }
        return bindPointerXRSessionEvent(pointer, session, inputSource, event, missingEvents);
    }, [event, inputSource, pointer, session, missingEvents]);
}
function usePointerXRSessionVisibility(pointer) {
    const store = useXRStore();
    useEffect(() => setupSyncIsVisible(store, (visible) => pointer.setEnabled(visible, { timeStamp: performance.now() })), [store, pointer]);
}
