import { jsx as _jsx } from "react/jsx-runtime";
import { useThree } from '@react-three/fiber';
import { forwardRef } from 'react';
export const XROrigin = forwardRef((props, ref) => {
    const xrCamera = useThree((s) => s.gl.xr.getCamera());
    return (_jsx("group", { ref: ref, ...props, children: _jsx("primitive", { object: xrCamera }) }));
});
