/// <reference types="webxr" />
import { XRControllerLayoutLoaderOptions, XRControllerState } from './controller/index.js';
import { XRHandLoaderOptions, XRHandState } from './hand/index.js';
export type XRInputSourceState = {
    inputSource: XRInputSource;
};
export type XRTransientPointerState = XRInputSourceState & {
    events: ReadonlyArray<XRInputSourceEvent>;
};
export type XRInputSourceStates = {
    [Key in keyof XRInputSourceStateMap as `${Key}States`]: ReadonlyArray<XRInputSourceStateMap[Key]>;
};
export type XRInputSourceStateMap = {
    hand: XRHandState;
    controller: XRControllerState;
    transientPointer: XRTransientPointerState;
    gaze: XRInputSourceState;
    screenInput: XRInputSourceState;
};
export declare function createSyncXRInputSourceStates(addAsyncMap: {
    [Key in keyof XRInputSourceStateMap]?: (state: XRInputSourceStateMap[Key]) => void;
}, options: (XRControllerLayoutLoaderOptions & XRHandLoaderOptions) | undefined): (session: XRSession, currentStates: XRInputSourceStates | undefined, added: ReadonlyArray<XRInputSource> | XRInputSourceArray | undefined, removed: ReadonlyArray<XRInputSource> | XRInputSourceArray | 'all' | undefined) => Partial<XRInputSourceStates>;
