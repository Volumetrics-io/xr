import { BufferGeometry } from 'three';
declare global {
    type XRSemanticLabel = 'desk' | 'couch' | 'floor' | 'ceiling' | 'wall' | 'door' | 'window' | 'other' | string;
    interface XRPlane {
        semanticLabel?: XRSemanticLabel;
    }
    interface XRMesh {
        semanticLabel?: XRSemanticLabel;
    }
}
export declare function updateXRPlaneGeometry(plane: XRPlane, geometry: (BufferGeometry & {
    createdAt?: number;
}) | undefined): BufferGeometry & {
    createdAt?: number;
};
