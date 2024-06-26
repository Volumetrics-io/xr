import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useContext, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { updateXRPlaneGeometry } from '@pmndrs/xr/internals';
import { xrPlaneContext } from './contexts.js';
export const XRPlaneModel = forwardRef((props, ref) => {
    const plane = useXRPlane();
    const geometry = useXRPlaneGeometry(plane);
    return _jsx("mesh", { ref: ref, geometry: geometry, ...props });
});
export function useXRPlane() {
    const context = useContext(xrPlaneContext);
    if (context == null) {
        throw new Error(`useXRPlane can only be used inside XRPlane or ForEachXRPlane`);
    }
    return context;
}
export function useXRPlaneGeometry(plane, disposeBuffer = true) {
    const [geometry, setGeometry] = useState(updateXRPlaneGeometry(plane, undefined));
    useFrame(() => setGeometry((geometry) => updateXRPlaneGeometry(plane, geometry)));
    useEffect(() => {
        if (!disposeBuffer) {
            return;
        }
        return () => geometry.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geometry]);
    return geometry;
}
