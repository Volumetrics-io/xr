import { DefaultGltfLoader } from '../index.js';
import { Material, Mesh } from 'three';
export async function loadXRControllerModel(layout, loader = DefaultGltfLoader) {
    const { scene } = await loader.loadAsync(layout.assetPath);
    return scene.clone(true);
}
export function configureXRControllerModel(model, options) {
    model.renderOrder = options?.renderOrder ?? 0;
    model.traverse((child) => {
        if (child instanceof Mesh && child.material instanceof Material) {
            child.material.colorWrite = options?.colorWrite ?? true;
        }
    });
}
