/// <reference types="react" />
import { GetXRSpace, XRControllerState, XRHandState } from '@pmndrs/xr/internals';
import { XRStore } from './xr.js';
import { XRInputSourceState, XRTransientPointerState } from '../../../xr/dist/input.js';
import { CombinedPointer } from '@pmndrs/pointer-events';
export declare const xrContext: import("react").Context<XRStore | undefined>;
export declare const xrMeshContext: import("react").Context<XRMesh | undefined>;
export declare const xrPlaneContext: import("react").Context<XRPlane | undefined>;
export declare const xrHandContext: import("react").Context<XRHandState | undefined>;
export declare const xrControllerContext: import("react").Context<XRControllerState | undefined>;
export declare const xrGazeContext: import("react").Context<XRInputSourceState | undefined>;
export declare const xrScreenInputContext: import("react").Context<XRInputSourceState | undefined>;
export declare const xrTransientPointerContext: import("react").Context<XRTransientPointerState | undefined>;
export declare const xrReferenceSpaceContext: import("react").Context<GetXRSpace | undefined>;
export declare const combinedPointerContext: import("react").Context<CombinedPointer | undefined>;
