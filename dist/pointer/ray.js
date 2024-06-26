import { MeshBasicMaterial, } from 'three';
export class PointerRayMaterial extends MeshBasicMaterial {
    constructor() {
        super({ transparent: true, toneMapped: false });
    }
    onBeforeCompile(parameters, renderer) {
        super.onBeforeCompile(parameters, renderer);
        parameters.vertexShader = `varying float vFade;\n` + parameters.vertexShader;
        parameters.vertexShader = parameters.vertexShader.replace(`#include <color_vertex>`, `#include <color_vertex>
            vFade = position.z + 0.5;`);
        parameters.fragmentShader = `varying float vFade;\n` + parameters.fragmentShader;
        parameters.fragmentShader = parameters.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
              diffuseColor.a *= vFade;`);
    }
}
export function updatePointerRayModel(mesh, material, pointer, options) {
    if (!pointer.getEnabled()) {
        mesh.visible = false;
        return;
    }
    mesh.visible = true;
    const intersection = pointer.getIntersection();
    const color = typeof options.color === 'function' ? options.color(pointer) : options.color;
    if (Array.isArray(color)) {
        material.color.set(...color);
    }
    else {
        material.color.set(color ?? 'white');
    }
    material.opacity = typeof options.opacity === 'function' ? options.opacity(pointer) : options.opacity ?? 0.4;
    let length = options.maxLength ?? 1;
    if (intersection != null) {
        length = Math.min(length, intersection.distance);
    }
    mesh.position.z = -length / 2;
    const size = options.size ?? 0.005;
    mesh.scale.set(size, size, length);
    mesh.updateMatrix();
}
