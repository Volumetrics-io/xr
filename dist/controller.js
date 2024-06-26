import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useContext, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { suspend } from 'suspend-react';
import { configureXRControllerModel, createUpdateXRControllerVisuals, loadXRControllerModel, } from '@pmndrs/xr/internals';
import { createPortal, useFrame } from '@react-three/fiber';
import { useXR } from './xr.js';
import { xrControllerContext } from './contexts.js';
export const XRControllerComponent = forwardRef(({ id, children, onPress, onRelease }, ref) => {
    const state = useXRControllerState();
    const [object, setObject] = useState(undefined);
    useImperativeHandle(ref, () => object, [object]);
    useXRControllerButtonEvent(id, (state) => (state === 'pressed' ? onPress?.() : onRelease?.()));
    useFrame(() => setObject(state.gamepad[id]?.object));
    if (object == null) {
        return;
    }
    return createPortal(children, object);
});
export function useXRControllerButtonEvent(id, onChange, handedness) {
    //making typescript happy (seems anti recreate but thats okay since its them same function)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const controller = handedness == null ? useXRControllerState() : useXRControllerState(handedness);
    const state = useRef();
    useFrame(() => {
        const currentState = controller?.gamepad[id]?.state;
        if (currentState != null && currentState != state.current) {
            onChange(currentState);
        }
        state.current = currentState;
    });
}
export function useXRControllerState(handedness) {
    if (handedness != null) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useXR((s) => s.controllerStates.find((state) => state.inputSource.handedness === handedness));
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const context = useContext(xrControllerContext);
    if (context == null) {
        throw new Error(`useXRControllerState() can only be used inside a <XRController> or using useXRControllerState("left")`);
    }
    return context;
}
const LoadXRControllerModelSymbol = Symbol('loadXRControllerModel');
export const XRControllerModel = forwardRef((options, ref) => {
    const state = useXRControllerState();
    const model = suspend(loadXRControllerModel, [state.layout, undefined, LoadXRControllerModelSymbol]);
    configureXRControllerModel(model, options);
    state.object = model;
    useImperativeHandle(ref, () => model, [model]);
    const update = useMemo(() => createUpdateXRControllerVisuals(model, state.layout, state.gamepad), [model, state.layout, state.gamepad]);
    useFrame(update);
    return _jsx("primitive", { object: model });
});
