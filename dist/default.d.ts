/// <reference types="webxr" />
import { DefaultXRInputSourceGrabPointerOptions, DefaultXRInputSourceRayPointerOptions, DefaultXRControllerOptions, DefaultXRGazeOptions, DefaultXRHandOptions, DefaultXRHandTouchPointerOptions, DefaultXRScreenInputOptions, DefaultXRTransientPointerOptions } from '@pmndrs/xr/internals';
export { type DefaultXRControllerOptions, type DefaultXRGazeOptions, type DefaultXRHandOptions, type DefaultXRHandTouchPointerOptions, type DefaultXRInputSourceGrabPointerOptions, type DefaultXRInputSourceRayPointerOptions, type DefaultXRScreenInputOptions, type DefaultXRTransientPointerOptions, defaultGrabPointerOpacity, defaultRayPointerOpacity, defaultTouchPointerOpacity, } from '@pmndrs/xr/internals';
export declare const DefaultXRHandGrabPointer: (options: DefaultXRInputSourceGrabPointerOptions) => import("react/jsx-runtime").JSX.Element;
export declare const DefaultXRControllerGrabPointer: (options: DefaultXRInputSourceGrabPointerOptions) => import("react/jsx-runtime").JSX.Element;
export declare function DefaultXRInputSourceRayPointer(useInputSourceState: () => {
    inputSource: XRInputSource;
}, options: DefaultXRInputSourceRayPointerOptions): import("react/jsx-runtime").JSX.Element;
export declare const DefaultXRHandRayPointer: (options: DefaultXRInputSourceRayPointerOptions) => import("react/jsx-runtime").JSX.Element;
export declare const DefaultXRControllerRayPointer: (options: DefaultXRInputSourceRayPointerOptions) => import("react/jsx-runtime").JSX.Element;
export declare function DefaultXRHandTouchPointer(options: DefaultXRHandTouchPointerOptions): import("react/jsx-runtime").JSX.Element;
export declare function DefaultXRController(options: DefaultXRControllerOptions): import("react/jsx-runtime").JSX.Element;
export declare function DefaultXRHand(options: DefaultXRHandOptions): import("react/jsx-runtime").JSX.Element;
export declare function DefaultXRTransientPointer(options: DefaultXRTransientPointerOptions): import("react/jsx-runtime").JSX.Element;
export declare function DefaultXRGaze(options: DefaultXRGazeOptions): import("react/jsx-runtime").JSX.Element;
export declare function DefaultXRScreenInput(options: DefaultXRScreenInputOptions): import("react/jsx-runtime").JSX.Element;
