import { jsx as _jsx } from "react/jsx-runtime";
import { configureXRHandModel, createUpdateXRHandVisuals, loadXRHandModel, } from '@pmndrs/xr/internals';
import { forwardRef, useContext, useImperativeHandle, useMemo } from 'react';
import { XRSpace, useXRReferenceSpace } from './space.js';
import { useXR } from './xr.js';
import { suspend } from 'suspend-react';
import { useFrame } from '@react-three/fiber';
import { xrHandContext } from './contexts.js';
export function useXRHandState(handedness) {
    if (handedness != null) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useXR((s) => s.handStates.find((state) => state.inputSource.handedness === handedness));
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const state = useContext(xrHandContext);
    if (state == null) {
        throw new Error(`useXRHandState() can only be used inside a <XRHand> or with using useXRHandState("left")`);
    }
    return state;
}
const LoadXRHandModelSymbol = Symbol('loadXRHandModel');
export const XRHandModel = forwardRef((options, ref) => {
    const state = useXRHandState();
    const model = suspend(loadXRHandModel, [state.assetPath, undefined, LoadXRHandModelSymbol]);
    configureXRHandModel(model, options);
    useImperativeHandle(ref, () => model, [model]);
    const referenceSpace = useXRReferenceSpace();
    const update = useMemo(() => createUpdateXRHandVisuals(state.inputSource.hand, model, referenceSpace), [state.inputSource, model, referenceSpace]);
    useFrame((_state, _delta, frame) => update(frame));
    return _jsx("primitive", { object: model });
});
export const XRHandJoint = forwardRef(({ joint, children }, ref) => {
    const state = useXRHandState();
    return (_jsx(XRSpace, { ref: ref, space: () => state.inputSource.hand.get(joint), children: children }));
});
