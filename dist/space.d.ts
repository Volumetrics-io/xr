import { GetXRSpace } from '@pmndrs/xr/internals';
import { RootState } from '@react-three/fiber';
import { ReactNode, RefObject } from 'react';
import { Object3D } from 'three';
export declare const XRSpace: import("react").ForwardRefExoticComponent<{
    space: GetXRSpace;
    children?: ReactNode;
} & import("react").RefAttributes<Object3D<import("three").Object3DEventMap>>>;
export declare function useXRReferenceSpace(): GetXRSpace;
export declare function useGetXRSpaceMatrix(space: GetXRSpace): (target: import("three").Matrix4, frame: XRFrame | undefined) => void;
export declare function useApplyXRSpaceMatrix(ref: RefObject<Object3D>, space: GetXRSpace, onFrame?: (state: RootState, delta: number, frame: XRFrame | undefined) => void): void;
