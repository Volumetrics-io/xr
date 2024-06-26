/// <reference types="react" />
import { MeshProps } from '@react-three/fiber';
import { BufferGeometry, Mesh } from 'three';
export declare const XRPlaneModel: import("react").ForwardRefExoticComponent<Omit<MeshProps, "ref"> & import("react").RefAttributes<Mesh<BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap>>>;
export declare function useXRPlane(): XRPlane;
export declare function useXRPlaneGeometry(plane: XRPlane, disposeBuffer?: boolean): BufferGeometry;
