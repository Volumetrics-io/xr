import { Object3D } from 'three';
import { XRControllerLayout } from '../controller/layout.js';
import { XRControllerModelOptions } from '../controller/model.js';
import { XRControllerGamepadState } from '../controller/gamepad.js';
export declare class XRControllerModel extends Object3D {
    constructor(layout: XRControllerLayout, gamepadState: XRControllerGamepadState, options?: XRControllerModelOptions);
}
