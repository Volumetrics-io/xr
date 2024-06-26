import { GrabPointerOptions, RayPointerOptions, TouchPointerOptions } from '@pmndrs/pointer-events';
import { PointerCursorModelOptions } from './pointer/cursor.js';
import { PointerRayModelOptions } from './pointer/ray.js';
import { XRControllerModelOptions } from './controller/model.js';
import { XRHandModelOptions } from './hand/model.js';
export type DefaultXRInputSourceGrabPointerOptions = GrabPointerOptions & {
    makeDefault?: boolean;
    cursorModel?: false | PointerCursorModelOptions;
};
export type DefaultXRInputSourceRayPointerOptions = RayPointerOptions & {
    makeDefault?: boolean;
    rayModel?: false | PointerRayModelOptions;
    cursorModel?: false | PointerCursorModelOptions;
};
export type DefaultXRHandTouchPointerOptions = TouchPointerOptions & {
    makeDefault?: boolean;
    cursorModel?: false | PointerCursorModelOptions;
};
export type DefaultXRControllerOptions = {
    model?: false | XRControllerModelOptions;
    grabPointer?: false | DefaultXRInputSourceGrabPointerOptions;
    rayPointer?: false | DefaultXRInputSourceRayPointerOptions;
};
export type DefaultXRHandOptions = {
    model?: false | XRHandModelOptions;
    grabPointer?: false | DefaultXRInputSourceGrabPointerOptions;
    rayPointer?: false | DefaultXRInputSourceRayPointerOptions;
    touchPointer?: false | DefaultXRHandTouchPointerOptions;
};
export type DefaultXRTransientPointerOptions = RayPointerOptions & {
    cursorModel?: false | PointerCursorModelOptions;
};
export type DefaultXRGazeOptions = RayPointerOptions & {
    cursorModel?: false | PointerCursorModelOptions;
};
export type DefaultXRScreenInputOptions = RayPointerOptions;
