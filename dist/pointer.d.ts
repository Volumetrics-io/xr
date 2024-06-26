/// <reference types="webxr" />
import { ReactNode, RefObject } from 'react';
import { GrabPointerOptions, Pointer, RayPointerOptions, TouchPointerOptions } from '@pmndrs/pointer-events';
import { Mesh, Object3D } from 'three';
import { PointerCursorModelOptions, PointerRayModelOptions } from '@pmndrs/xr/internals';
export declare function CombinedPointer({ children }: {
    children?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useGrabPointer(spaceRef: RefObject<Object3D>, pointerState: any, currentOptions?: GrabPointerOptions & {
    makeDefault?: boolean;
}): Pointer;
export declare function useRayPointer(spaceRef: RefObject<Object3D>, pointerState: any, currentOptions?: RayPointerOptions & {
    makeDefault?: boolean;
}): Pointer;
export declare function useTouchPointer(spaceRef: RefObject<Object3D>, pointerState: any, currentOptions?: TouchPointerOptions & {
    makeDefault?: boolean;
}): Pointer;
export declare const PointerRayModel: import("react").ForwardRefExoticComponent<PointerRayModelOptions & {
    pointer: Pointer;
} & import("react").RefAttributes<Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap>>>;
export declare const PointerCursorModel: import("react").ForwardRefExoticComponent<PointerCursorModelOptions & {
    pointer: Pointer;
} & import("react").RefAttributes<Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap>>>;
export declare function usePointerXRSessionEvent(pointer: Pointer, inputSource: XRInputSource, event: 'select' | 'squeeze', missingEvents?: ReadonlyArray<XRInputSourceEvent>): void;
