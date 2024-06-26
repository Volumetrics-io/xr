/// <reference types="webxr" />
import { Object3D } from 'three';
import { XRHandState } from '../hand/index.js';
import { GetXRSpace } from '../space.js';
import { XRControllerState, XRStore } from '../internals.js';
import { XRInputSourceState, XRTransientPointerState } from '../input.js';
import { XRElementImplementations } from './xr.js';
import { DefaultXRControllerOptions, DefaultXRGazeOptions, DefaultXRHandOptions, DefaultXRHandTouchPointerOptions, DefaultXRInputSourceGrabPointerOptions, DefaultXRInputSourceRayPointerOptions, DefaultXRScreenInputOptions, DefaultXRTransientPointerOptions } from '../default.js';
import { CombinedPointer } from '@pmndrs/pointer-events';
export declare function createDefaultXRInputSourceRayPointer(scene: Object3D, store: XRStore<XRElementImplementations>, space: Object3D, state: {
    inputSource: XRInputSource;
}, session: XRSession, options?: DefaultXRInputSourceRayPointerOptions, combined?: CombinedPointer, makeDefault?: boolean): () => void;
export declare function createDefaultXRInputSourceGrabPointer(scene: Object3D, store: XRStore<XRElementImplementations>, space: Object3D, state: {
    inputSource: XRInputSource;
}, gripSpace: GetXRSpace, session: XRSession, event: 'select' | 'squeeze', options?: DefaultXRInputSourceGrabPointerOptions, combined?: CombinedPointer, makeDefault?: boolean): () => void;
export declare function createDefaultXRHandTouchPointer(scene: Object3D, store: XRStore<XRElementImplementations>, space: Object3D, state: XRHandState, options?: DefaultXRHandTouchPointerOptions, combined?: CombinedPointer, makeDefault?: boolean): () => void;
export declare function createDefaultXRHand(scene: Object3D, store: XRStore<XRElementImplementations>, space: Object3D, state: XRHandState, session: XRSession, options?: DefaultXRHandOptions): () => void;
export declare function createDefaultXRController(scene: Object3D, store: XRStore<XRElementImplementations>, space: Object3D, state: XRControllerState, session: XRSession, options?: DefaultXRControllerOptions): () => void;
export declare function createDefaultXRTransientPointer(scene: Object3D, store: XRStore<XRElementImplementations>, space: Object3D, state: XRTransientPointerState, session: XRSession, options?: DefaultXRTransientPointerOptions, combined?: CombinedPointer, makeDefault?: boolean): () => void;
export declare function createDefaultXRGaze(scene: Object3D, store: XRStore<XRElementImplementations>, space: Object3D, state: XRInputSourceState, session: XRSession, options?: DefaultXRGazeOptions): () => void;
export declare function createDefaultXRScreenInput(scene: Object3D, store: XRStore<XRElementImplementations>, space: Object3D, state: XRInputSourceState, session: XRSession, options?: DefaultXRScreenInputOptions): () => void;
