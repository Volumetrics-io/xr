import { BoxGeometry, Mesh, PlaneGeometry } from 'three';
import { onXRFrame } from './utils.js';
import { PointerRayMaterial, updatePointerRayModel } from '../pointer/ray.js';
import { PointerCursorMaterial, updatePointerCursorModel } from '../pointer/cursor.js';
const pointerRayGeometry = new BoxGeometry();
export class PointerRayModel extends Mesh {
    constructor(pointer, options = {}) {
        const material = new PointerRayMaterial();
        super(pointerRayGeometry, material);
        this.renderOrder = options.renderOrder ?? 2;
        onXRFrame(() => updatePointerRayModel(this, material, pointer, options));
    }
}
const pointerCursorGeometry = new PlaneGeometry();
export class PointerCursorModel extends Mesh {
    constructor(pointer, options = {}) {
        const material = new PointerCursorMaterial();
        super(pointerCursorGeometry, material);
        this.renderOrder = options.renderOrder ?? 1;
        onXRFrame(() => updatePointerCursorModel(this, material, pointer, options));
    }
}
