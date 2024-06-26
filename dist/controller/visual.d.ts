import { type Object3D } from 'three';
import type { XRControllerLayout } from './layout.js';
import type { XRControllerGamepadState } from './gamepad.js';
export declare function createUpdateXRControllerVisuals(model: Object3D, layout: XRControllerLayout, gamepadState: XRControllerGamepadState): () => void;
