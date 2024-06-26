/// <reference types="webxr" />
import { ReactNode } from 'react';
import { XRControllerGamepadComponentId, XRControllerGamepadComponentState, XRControllerModelOptions, XRControllerState } from '@pmndrs/xr/internals';
import { Object3D } from 'three';
export declare const XRControllerComponent: import("react").ForwardRefExoticComponent<{
    onPress?: (() => void) | undefined;
    onRelease?: (() => void) | undefined;
    id: XRControllerGamepadComponentId;
    children?: ReactNode;
} & import("react").RefAttributes<Object3D<import("three").Object3DEventMap> | undefined>>;
export declare function useXRControllerButtonEvent(id: XRControllerGamepadComponentId, onChange: (state: XRControllerGamepadComponentState['state']) => void, handedness?: XRHandedness): void;
export declare function useXRControllerState(handedness: XRHandedness): XRControllerState | undefined;
export declare function useXRControllerState(): XRControllerState;
export declare const XRControllerModel: import("react").ForwardRefExoticComponent<XRControllerModelOptions & import("react").RefAttributes<Object3D<import("three").Object3DEventMap>>>;
