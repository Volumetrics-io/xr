import { BufferGeometry } from 'three';
export declare function updateXRMeshGeometry(mesh: XRMesh, geometry: (BufferGeometry & {
    createdAt?: number;
}) | undefined): BufferGeometry & {
    creationTime?: number;
};
