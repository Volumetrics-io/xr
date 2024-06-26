import { Material, Mesh } from 'three';
import { DefaultAssetBasePath, DefaultGltfLoader } from '../index.js';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
//from https://github.com/pmndrs/three-stdlib/blob/main/src/webxr/XRHandMeshModel.ts
const DefaultDefaultXRHandProfileId = 'generic-hand';
export function getXRHandAssetPath(handedness, options) {
    const baseAssetPath = options?.baseAssetPath ?? DefaultAssetBasePath;
    const defaultProfileId = options?.defaultXRHandProfileId ?? DefaultDefaultXRHandProfileId;
    return new URL(`${defaultProfileId}/${handedness}.glb`, baseAssetPath).href;
}
export async function loadXRHandModel(assetPath, loader = DefaultGltfLoader) {
    const { scene } = await loader.loadAsync(assetPath);
    const result = cloneSkeleton(scene);
    const mesh = scene.getObjectByProperty('type', 'SkinnedMesh');
    if (mesh == null) {
        throw new Error(`missing SkinnedMesh in loaded XRHand model`);
    }
    mesh.frustumCulled = false;
    return result;
}
export function configureXRHandModel(model, options) {
    model.renderOrder = options?.renderOrder ?? 0;
    model.traverse((child) => {
        if (child instanceof Mesh && child.material instanceof Material) {
            child.material.colorWrite = options?.colorWrite ?? true;
        }
    });
}
