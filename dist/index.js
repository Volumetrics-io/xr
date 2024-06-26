import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export const DefaultGltfLoader = new GLTFLoader();
export const DefaultAssetBasePath = 'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles/';
export * from './visible.js';
export * from './pointer/index.js';
export * from './vanilla/index.js';
