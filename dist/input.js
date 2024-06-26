import { useXR } from './xr.js';
import { xrGazeContext, xrScreenInputContext, xrTransientPointerContext } from './contexts.js';
import { useContext } from 'react';
export function useXRTransientPointerState(handedness) {
    if (handedness != null) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useXR((s) => s.transientPointerStates.find((state) => state.inputSource.handedness === handedness));
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const state = useContext(xrTransientPointerContext);
    if (state == null) {
        throw new Error(`useXRTransientPointerState() can only be used inside a <XRHand> or with using useXRHand("left")`);
    }
    return state;
}
export function useXRGazeState() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const state = useContext(xrGazeContext);
    if (state == null) {
        throw new Error(`useXRGazeState() can only be used inside a <XRGaze>`);
    }
    return state;
}
export function useXRScreenInputState() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const state = useContext(xrScreenInputContext);
    if (state == null) {
        throw new Error(`useXRScreenInputState() can only be used inside a <XRGaze>`);
    }
    return state;
}
