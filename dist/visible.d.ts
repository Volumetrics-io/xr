import type { XRElementImplementations, XRStore } from './store.js';
export declare function setupSyncIsVisible(store: XRStore<XRElementImplementations>, setIsVisible: (visible: boolean) => void): () => void;
