import { Object3D } from 'three';
import { XRElementImplementations, XRUpdatesList } from './xr.js';
import { XRStore } from '../store.js';
export declare function setupSyncXRElements(scene: Object3D, store: XRStore<XRElementImplementations>, target: Object3D, updatesList: XRUpdatesList): () => void;
export declare let xrUpdatesListContext: XRUpdatesList | undefined;
