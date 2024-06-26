/// <reference types="webxr" />
import { Camera, Object3D, WebXRManager } from 'three';
import { XRStore, XRStoreOptions } from '../store.js';
import { XRHandState } from '../hand/state.js';
import { XRControllerState } from '../controller/state.js';
import { XRInputSourceState, XRTransientPointerState } from '../input.js';
import { ForwardEventsOptions } from '@pmndrs/pointer-events';
import { DefaultXRControllerOptions, DefaultXRGazeOptions, DefaultXRHandOptions, DefaultXRScreenInputOptions, DefaultXRTransientPointerOptions } from '../default.js';
export type XRElementImplementationCleanup = (() => void) | void;
export type XRUpdatesList = Array<(frame: XRFrame) => void>;
export type XRElementImplementations = {
    hand: ((store: XRStore<XRElementImplementations>, handSpace: Object3D, state: XRHandState, session: XRSession) => XRElementImplementationCleanup) | false | DefaultXRHandOptions;
    gaze: ((store: XRStore<XRElementImplementations>, handSpace: Object3D, state: XRInputSourceState, session: XRSession) => XRElementImplementationCleanup) | false | DefaultXRGazeOptions;
    screenInput: ((store: XRStore<XRElementImplementations>, handSpace: Object3D, state: XRInputSourceState, session: XRSession) => XRElementImplementationCleanup) | false | DefaultXRScreenInputOptions;
    transientPointer: ((store: XRStore<XRElementImplementations>, handSpace: Object3D, state: XRTransientPointerState, session: XRSession) => XRElementImplementationCleanup) | false | DefaultXRTransientPointerOptions;
    controller: ((store: XRStore<XRElementImplementations>, controllerSpace: Object3D, state: XRControllerState, session: XRSession) => XRElementImplementationCleanup) | false | DefaultXRControllerOptions;
    detectedPlane: ((store: XRStore<XRElementImplementations>, detectedPlaneSpace: Object3D, plane: XRPlane, session: XRSession) => XRElementImplementationCleanup) | false;
    detectedMesh: ((store: XRStore<XRElementImplementations>, detecedMeshSpace: Object3D, mesh: XRMesh, session: XRSession) => XRElementImplementationCleanup) | false;
};
export declare function createXRStore(canvas: HTMLCanvasElement, scene: Object3D, camera: Camera, xr: WebXRManager, options?: XRStoreOptions<XRElementImplementations> & {
    htmlInput?: ForwardEventsOptions | false;
}): Omit<import("zustand/vanilla").StoreApi<Readonly<{
    session?: XRSession | undefined;
    visibilityState?: XRVisibilityState | undefined;
    frameRate?: number | undefined;
    mode: XRSessionMode | null;
    detectedPlanes: readonly XRPlane[];
    detectedMeshes: readonly XRMesh[];
    origin?: Object3D<import("three").Object3DEventMap> | undefined;
} & import("../store.js").WithRecord<XRElementImplementations> & import("../input.js").XRInputSourceStates>>, "destroy"> & {
    setWebXRManager(xr: WebXRManager): void;
    destroy(): void;
    enterAR(options?: import("../init.js").XRSessionInitOptions | undefined): Promise<XRSession>;
    enterVR(options?: import("../init.js").XRSessionInitOptions | undefined): Promise<XRSession>;
    onBeforeFrame(scene: Object3D<import("three").Object3DEventMap>, camera: Camera, frame: XRFrame | undefined): void;
    setHand(implementation: false | ((store: XRStore<XRElementImplementations>, handSpace: Object3D<import("three").Object3DEventMap>, state: XRHandState, session: XRSession) => XRElementImplementationCleanup) | DefaultXRHandOptions, handedness?: XRHandedness | undefined): void;
    setController(implementation: false | ((store: XRStore<XRElementImplementations>, controllerSpace: Object3D<import("three").Object3DEventMap>, state: XRControllerState, session: XRSession) => XRElementImplementationCleanup) | DefaultXRControllerOptions, handedness?: XRHandedness | undefined): void;
    setGaze(implementation: false | ((store: XRStore<XRElementImplementations>, handSpace: Object3D<import("three").Object3DEventMap>, state: XRInputSourceState, session: XRSession) => XRElementImplementationCleanup) | DefaultXRGazeOptions): void;
    setScreenInput(implementation: false | import("@pmndrs/pointer-events").RayPointerOptions | ((store: XRStore<XRElementImplementations>, handSpace: Object3D<import("three").Object3DEventMap>, state: XRInputSourceState, session: XRSession) => XRElementImplementationCleanup)): void;
    setTransientPointer(implementation: false | ((store: XRStore<XRElementImplementations>, handSpace: Object3D<import("three").Object3DEventMap>, state: XRTransientPointerState, session: XRSession) => XRElementImplementationCleanup) | DefaultXRTransientPointerOptions, handedness?: XRHandedness | undefined): void;
    setDetectedPlane(implementation: false | ((store: XRStore<XRElementImplementations>, detectedPlaneSpace: Object3D<import("three").Object3DEventMap>, plane: XRPlane, session: XRSession) => XRElementImplementationCleanup), semanticLabel?: string | undefined): void;
    setDetectedMesh(implementation: false | ((store: XRStore<XRElementImplementations>, detecedMeshSpace: Object3D<import("three").Object3DEventMap>, mesh: XRMesh, session: XRSession) => XRElementImplementationCleanup), semanticLabel?: string | undefined): void;
    setFrameRate(value: import("../store.js").FrameRateOption): void;
} & {
    destroy(): void;
    update(frame: XRFrame | undefined): void;
};
