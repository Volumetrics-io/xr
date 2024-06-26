import { Pointer } from '@pmndrs/pointer-events';
import { ColorRepresentation, Mesh, MeshBasicMaterial, Vector3Tuple, WebGLProgramParametersWithUniforms, WebGLRenderer } from 'three';
export type PointerCursorModelOptions = {
    /**
     * @default "white"
     */
    color?: ColorRepresentation | Vector3Tuple | ((pointer: Pointer) => ColorRepresentation | Vector3Tuple);
    /**
     * @default 0.4
     */
    opacity?: number | ((pointer: Pointer) => number);
    /**
     * @default 0.1
     */
    size?: number;
    /**
     * @default 1
     */
    renderOrder?: number;
    /**
     * @default 0.01
     */
    cursorOffset?: number;
    /**
     * @default PointerCursorMaterial
     */
    materialClass?: {
        new (): MeshBasicMaterial;
    };
};
export declare class PointerCursorMaterial extends MeshBasicMaterial {
    constructor();
    onBeforeCompile(parameters: WebGLProgramParametersWithUniforms, renderer: WebGLRenderer): void;
}
export declare function updatePointerCursorModel(mesh: Mesh, material: MeshBasicMaterial, pointer: Pointer, options: PointerCursorModelOptions): void;
