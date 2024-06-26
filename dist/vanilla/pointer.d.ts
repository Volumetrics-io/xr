import { Pointer } from '@pmndrs/pointer-events';
import { Mesh } from 'three';
import { PointerRayModelOptions } from '../pointer/ray.js';
import { PointerCursorModelOptions } from '../pointer/cursor.js';
export declare class PointerRayModel extends Mesh {
    constructor(pointer: Pointer, options?: PointerRayModelOptions);
}
export declare class PointerCursorModel extends Mesh {
    constructor(pointer: Pointer, options?: PointerCursorModelOptions);
}
