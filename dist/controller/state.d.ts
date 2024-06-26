/// <reference types="webxr" />
import { Object3D } from 'three';
import { XRControllerGamepadState } from './gamepad.js';
import { XRControllerLayout, XRControllerLayoutLoader } from './layout.js';
import { XRInputSourceState } from '../input.js';
export type XRControllerState = XRInputSourceState & {
    gamepad: XRControllerGamepadState;
    layout: XRControllerLayout;
    object?: Object3D;
};
export declare function createXRControllerState(inputSource: XRInputSource, layoutLoader: XRControllerLayoutLoader): Promise<XRControllerState>;
export declare function updateXRControllerState({ gamepad, inputSource, layout }: XRControllerState): void;
