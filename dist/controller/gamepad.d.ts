/// <reference types="webxr" />
import type { XRControllerLayout } from './layout.js';
import { Object3D } from 'three';
export type XRControllerGamepadComponentId = `a-button` | `b-button` | `x-button` | `y-button` | `xr-standard-squeeze` | `xr-standard-thumbstick` | `xr-standard-trigger` | `thumbrest` | string;
export type XRControllerGamepadComponentState = {
    state: 'default' | 'touched' | 'pressed';
    button?: number;
    xAxis?: number;
    yAxis?: number;
    object?: Object3D;
};
export type XRControllerGamepadState = Record<XRControllerGamepadComponentId, XRControllerGamepadComponentState | undefined>;
export declare function updateXRControllerGamepadState(target: XRControllerGamepadState, inputSource: XRInputSource, layout: XRControllerLayout): void;
