/// <reference types="webxr" />
import { XRInputSourceState, XRTransientPointerState } from '@pmndrs/xr/internals';
export declare function useXRTransientPointerState(handedness: XRHandedness): XRTransientPointerState | undefined;
export declare function useXRTransientPointerState(): XRTransientPointerState;
export declare function useXRGazeState(): XRInputSourceState;
export declare function useXRScreenInputState(): XRInputSourceState;
