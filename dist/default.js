import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { defaultGrabPointerOpacity, defaultRayPointerOpacity, defaultTouchPointerOpacity, } from '@pmndrs/xr/internals';
import { useRef, Suspense } from 'react';
import { XRControllerModel, useXRControllerState } from './controller.js';
import { XRHandModel, useXRHandState } from './hand.js';
import { CombinedPointer, PointerCursorModel, PointerRayModel, useGrabPointer, usePointerXRSessionEvent, useRayPointer, useTouchPointer, } from './pointer.js';
import { XRSpace } from './space.js';
import { useXRGazeState, useXRScreenInputState, useXRTransientPointerState } from './input.js';
export { defaultGrabPointerOpacity, defaultRayPointerOpacity, defaultTouchPointerOpacity, } from '@pmndrs/xr/internals';
function DefaultXRInputSourceGrabPointer(event, useInputSourceState, getSpace, options) {
    const state = useInputSourceState();
    const ref = useRef(null);
    const pointer = useGrabPointer(ref, state, options);
    usePointerXRSessionEvent(pointer, state.inputSource, event);
    const cursorModelOptions = options.cursorModel;
    return (_jsx(XRSpace, { ref: ref, space: getSpace(state.inputSource), children: cursorModelOptions !== false && (_jsx(PointerCursorModel, { pointer: pointer, opacity: defaultGrabPointerOpacity, ...cursorModelOptions })) }));
}
export const DefaultXRHandGrabPointer = DefaultXRInputSourceGrabPointer.bind(null, 'select', useXRHandState, (inputSource) => () => inputSource.hand.get('index-finger-tip'));
export const DefaultXRControllerGrabPointer = DefaultXRInputSourceGrabPointer.bind(null, 'squeeze', useXRControllerState, (inputSource) => inputSource.gripSpace);
export function DefaultXRInputSourceRayPointer(useInputSourceState, options) {
    const state = useInputSourceState();
    const ref = useRef(null);
    const pointer = useRayPointer(ref, state, options);
    usePointerXRSessionEvent(pointer, state.inputSource, 'select');
    const rayModelOptions = options.rayModel;
    const cursorModelOptions = options.cursorModel;
    return (_jsxs(XRSpace, { ref: ref, space: state.inputSource.targetRaySpace, children: [rayModelOptions !== false && (_jsx(PointerRayModel, { pointer: pointer, opacity: defaultRayPointerOpacity, ...rayModelOptions })), cursorModelOptions !== false && (_jsx(PointerCursorModel, { pointer: pointer, opacity: defaultRayPointerOpacity, ...cursorModelOptions }))] }));
}
export const DefaultXRHandRayPointer = DefaultXRInputSourceRayPointer.bind(null, useXRHandState);
export const DefaultXRControllerRayPointer = DefaultXRInputSourceRayPointer.bind(null, useXRControllerState);
export function DefaultXRHandTouchPointer(options) {
    const state = useXRHandState();
    const ref = useRef(null);
    const pointer = useTouchPointer(ref, state, options);
    const cursorModelOptions = options.cursorModel;
    return (_jsx(XRSpace, { ref: ref, space: () => state.inputSource.hand.get('index-finger-tip'), children: cursorModelOptions !== false && (_jsx(PointerCursorModel, { pointer: pointer, opacity: defaultTouchPointerOpacity, ...cursorModelOptions })) }));
}
export function DefaultXRController(options) {
    const modelOptions = options.model;
    const grabPointerOptions = options.grabPointer;
    const rayPointerOptions = options.rayPointer;
    return (_jsxs(_Fragment, { children: [modelOptions !== false && (_jsx(Suspense, { children: _jsx(XRControllerModel, { ...modelOptions }) })), _jsxs(CombinedPointer, { children: [grabPointerOptions !== false && _jsx(DefaultXRControllerGrabPointer, { ...grabPointerOptions }), rayPointerOptions !== false && (_jsx(DefaultXRControllerRayPointer, { makeDefault: true, minDistance: 0.2, ...rayPointerOptions }))] })] }));
}
export function DefaultXRHand(options) {
    const modelOptions = options.model;
    const grabPointerOptions = options.grabPointer;
    const rayPointerOptions = options.rayPointer;
    const touchPointerOptions = options.touchPointer;
    return (_jsxs(_Fragment, { children: [modelOptions !== false && (_jsx(Suspense, { children: _jsx(XRHandModel, { ...modelOptions }) })), _jsxs(CombinedPointer, { children: [grabPointerOptions !== false && _jsx(DefaultXRHandGrabPointer, { ...grabPointerOptions }), touchPointerOptions !== false && _jsx(DefaultXRHandTouchPointer, { ...touchPointerOptions }), rayPointerOptions !== false && (_jsx(DefaultXRHandRayPointer, { makeDefault: true, minDistance: 0.2, ...rayPointerOptions, rayModel: { maxLength: 0.2, ...rayPointerOptions?.rayModel } }))] })] }));
}
export function DefaultXRTransientPointer(options) {
    const state = useXRTransientPointerState();
    const ref = useRef(null);
    const pointer = useRayPointer(ref, state, options);
    usePointerXRSessionEvent(pointer, state.inputSource, 'select', state.events);
    const cursorModelOptions = options.cursorModel;
    return (_jsx(XRSpace, { ref: ref, space: state.inputSource.targetRaySpace, children: cursorModelOptions !== false && (_jsx(PointerCursorModel, { pointer: pointer, opacity: defaultRayPointerOpacity, ...cursorModelOptions })) }));
}
export function DefaultXRGaze(options) {
    const state = useXRGazeState();
    const ref = useRef(null);
    const pointer = useRayPointer(ref, state, options);
    usePointerXRSessionEvent(pointer, state.inputSource, 'select');
    const cursorModelOptions = options.cursorModel;
    return (_jsx(XRSpace, { ref: ref, space: state.inputSource.targetRaySpace, children: cursorModelOptions !== false && (_jsx(PointerCursorModel, { pointer: pointer, opacity: defaultRayPointerOpacity, ...cursorModelOptions })) }));
}
export function DefaultXRScreenInput(options) {
    const state = useXRScreenInputState();
    const ref = useRef(null);
    const pointer = useRayPointer(ref, state, options);
    usePointerXRSessionEvent(pointer, state.inputSource, 'select');
    return _jsx(XRSpace, { ref: ref, space: state.inputSource.targetRaySpace });
}
