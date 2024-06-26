import { Pointer } from '@pmndrs/pointer-events';
import { ColorRepresentation, Vector3Tuple, MeshBasicMaterial, WebGLProgramParametersWithUniforms, WebGLRenderer, Mesh } from 'three';
export type PointerRayModelOptions = {
    /**
     * @default 2
     */
    renderOrder?: number;
    /**
     * @default white
     */
    color?: ColorRepresentation | Vector3Tuple | ((pointer: Pointer) => ColorRepresentation | Vector3Tuple);
    /**
     * @default 0.4
     */
    opacity?: number | ((pointer: Pointer) => number);
    /**
     * @default 1
     */
    maxLength?: number;
    /**
     * @default 0.005
     */
    size?: number;
    /**
     * @default PointerRayMaterial
     */
    materialClass?: {
        new (): MeshBasicMaterial;
    };
};
export declare class PointerRayMaterial extends MeshBasicMaterial {
    constructor();
    onBeforeCompile(parameters: WebGLProgramParametersWithUniforms, renderer: WebGLRenderer): void;
}
export declare function updatePointerRayModel(mesh: Mesh, material: MeshBasicMaterial, pointer: Pointer, options: PointerRayModelOptions): void;
