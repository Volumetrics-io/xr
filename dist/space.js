import { jsx as _jsx } from "react/jsx-runtime";
import { createGetXRSpaceMatrix } from '@pmndrs/xr/internals';
import { useFrame } from '@react-three/fiber';
import { forwardRef, useContext, useImperativeHandle, useMemo, useRef } from 'react';
import { xrReferenceSpaceContext } from './contexts.js';
export const XRSpace = forwardRef(({ space, children }, ref) => {
    const internalRef = useRef(null);
    useImperativeHandle(ref, () => internalRef.current, []);
    useApplyXRSpaceMatrix(internalRef, space, (_state, _delta, frame) => {
        if (internalRef.current == null) {
            return;
        }
        internalRef.current.visible = frame != null;
    });
    return (_jsx("group", { visible: false, matrixAutoUpdate: false, ref: internalRef, children: _jsx(xrReferenceSpaceContext.Provider, { value: space, children: children }) }));
});
export function useXRReferenceSpace() {
    const context = useContext(xrReferenceSpaceContext);
    if (context == null) {
        throw new Error(`XR objects must be placed inside the XROrigin`);
    }
    return context;
}
export function useGetXRSpaceMatrix(space) {
    const referenceSpace = useXRReferenceSpace();
    return useMemo(() => createGetXRSpaceMatrix(space, referenceSpace), [space, referenceSpace]);
}
export function useApplyXRSpaceMatrix(ref, space, onFrame) {
    const getXRSpaceMatrix = useGetXRSpaceMatrix(space);
    useFrame((state, delta, frame) => {
        if (ref.current == null) {
            return;
        }
        getXRSpaceMatrix(ref.current.matrix, frame);
        onFrame?.(state, delta, frame);
        //makes sure we update the frame before using the space transformation anywhere
    }, -100);
}
