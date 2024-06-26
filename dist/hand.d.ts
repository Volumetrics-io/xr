/// <reference types="webxr" />
import { XRHandModelOptions, XRHandState } from '@pmndrs/xr/internals';
import { ReactNode } from 'react';
import { Object3D } from 'three';
export declare function useXRHandState(handedness: XRHandedness): XRHandState | undefined;
export declare function useXRHandState(): XRHandState;
export declare const XRHandModel: import("react").ForwardRefExoticComponent<XRHandModelOptions & import("react").RefAttributes<Object3D<import("three").Object3DEventMap>>>;
export declare const XRHandJoint: import("react").ForwardRefExoticComponent<{
    joint: XRHandJoint;
    children?: ReactNode;
} & import("react").RefAttributes<Object3D<import("three").Object3DEventMap>>>;
