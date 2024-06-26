/// <reference types="webxr" />
import { StoreApi } from 'zustand/vanilla';
import type { Camera, Object3D, WebXRManager } from 'three';
import { XRControllerLayoutLoaderOptions } from './controller/index.js';
import { XRHandPoseUrls } from './hand/pose.js';
import { XRHandLoaderOptions } from './hand/index.js';
import { XRInputSourceStateMap, XRInputSourceStates } from './input.js';
import { XRSessionInitOptions } from './init.js';
export type XRState<T extends XRElementImplementations> = Readonly<{
    session?: XRSession;
    visibilityState?: XRVisibilityState;
    frameRate?: number;
    mode: XRSessionMode | null;
    detectedPlanes: ReadonlyArray<XRPlane>;
    detectedMeshes: ReadonlyArray<XRMesh>;
    origin?: Object3D;
} & WithRecord<T> & XRInputSourceStates>;
export type XRElementImplementations = {
    [Key in keyof XRInputSourceStateMap]: unknown;
} & {
    detectedMesh: unknown;
    detectedPlane: unknown;
};
export type WithRecord<T extends XRElementImplementations> = {
    controller: T['controller'] | ({
        [Key in XRHandedness]?: T['controller'];
    } & {
        default?: T['controller'];
    });
    transientPointer: T['transientPointer'] | ({
        [Key in XRHandedness]?: T['transientPointer'];
    } & {
        default?: T['transientPointer'];
    });
    hand: T['hand'] | ({
        [Key in XRHandedness]?: T['hand'];
    } & {
        default?: T['hand'];
    });
    gaze: T['gaze'];
    screenInput: T['screenInput'];
    detectedPlane: T['detectedPlane'] | ({
        [Key in XRSemanticLabel]?: T['detectedPlane'];
    } & {
        default?: T['detectedPlane'];
    });
    detectedMesh: T['detectedMesh'] | ({
        [Key in XRSemanticLabel]?: T['detectedMesh'];
    } & {
        default?: T['detectedMesh'];
    });
};
export declare function resolveInputSourceImplementation<T extends object | Function>(implementation: T | ({
    [Key in XRHandedness]?: T | false;
} & {
    default?: T | false;
}) | false, handedness: XRHandedness, defaultValue: T | false): T | false;
export declare function resolveDetectedImplementation<T extends {
    [Key in XRSemanticLabel | 'default']?: never;
} | Function>(implementation: T | ({
    [Key in XRSemanticLabel]?: T | false;
} & {
    default?: T | false;
}) | false, semanticLabel: XRSemanticLabel | undefined, defaultValue: T | false): T | false;
export type FrameBufferScalingOption = number | false | ((maxFrameBufferScaling: number) => number | false) | 'high' | 'mid' | 'low';
export type FrameRateOption = ((supportedFrameRates: ArrayLike<number>) => number | false) | 'high' | 'mid' | 'low' | false;
export type XRStoreOptions<T extends XRElementImplementations> = {
    /**
     * @default false
     */
    foveation?: number;
    /**
     * @default "high"
     */
    frameRate?: FrameRateOption;
    /**
     * @default false
     */
    frameBufferScaling?: FrameBufferScalingOption;
    /**
     * session modes that can be entered automatically without manually requesting a session when granted by the system
     * @default true
     */
    enterGrantedSession?: boolean | Array<XRSessionMode>;
    /**
     * @default {} TBD base64 encoded default poses (fist, idle, ...)
     */
    handPoseUrls?: XRHandPoseUrls;
} & XRControllerLayoutLoaderOptions & XRHandLoaderOptions & Partial<WithRecord<T>> & XRSessionInitOptions;
export type XRStore<T extends XRElementImplementations> = Omit<StoreApi<XRState<T>>, 'destroy'> & {
    setWebXRManager(xr: WebXRManager): void;
    destroy(): void;
    enterAR(options?: XRSessionInitOptions): Promise<XRSession>;
    enterVR(options?: XRSessionInitOptions): Promise<XRSession>;
    onBeforeFrame(scene: Object3D, camera: Camera, frame: XRFrame | undefined): void;
    setHand(implementation: T['hand'], handedness?: XRHandedness): void;
    setController(implementation: T['controller'], handedness?: XRHandedness): void;
    setGaze(implementation: T['gaze']): void;
    setScreenInput(implementation: T['screenInput']): void;
    setTransientPointer(implementation: T['transientPointer'], handedness?: XRHandedness): void;
    setDetectedPlane(implementation: T['detectedPlane'], semanticLabel?: XRSemanticLabel): void;
    setDetectedMesh(implementation: T['detectedMesh'], semanticLabel?: XRSemanticLabel): void;
    setFrameRate(value: FrameRateOption): void;
};
export declare function createXRStore<T extends XRElementImplementations>(options?: XRStoreOptions<T>): XRStore<T>;
