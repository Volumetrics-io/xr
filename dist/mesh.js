import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useContext, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { updateXRMeshGeometry } from '@pmndrs/xr/internals';
import { xrMeshContext } from './contexts.js';
export const XRMeshModel = forwardRef((props, ref) => {
    const mesh = useXRMesh();
    const geometry = useXRMeshGeometry(mesh);
    return _jsx("mesh", { ref: ref, geometry: geometry, ...props });
});
export function useXRMesh() {
    const context = useContext(xrMeshContext);
    if (context == null) {
        throw new Error(`useXRMesh can only be used inside XRMesh or ForEachXRMesh`);
    }
    return context;
}
export function useXRMeshGeometry(mesh, disposeBuffer = true) {
    const [geometry, setGeometry] = useState(updateXRMeshGeometry(mesh, undefined));
    useFrame(() => setGeometry((geometry) => updateXRMeshGeometry(mesh, geometry)));
    useEffect(() => {
        if (!disposeBuffer) {
            return;
        }
        return () => geometry.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geometry]);
    return geometry;
}
