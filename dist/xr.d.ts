import { XRState as BaseXRState, XRStore as BaseXRStore, XRStoreOptions as BaseXRStoreOptions, DefaultXRHandOptions, DefaultXRControllerOptions, DefaultXRTransientPointerOptions, DefaultXRGazeOptions, DefaultXRScreenInputOptions } from '@pmndrs/xr/internals';
import { ComponentType, ReactNode } from 'react';
export type XRElementImplementation = {
    /**
     * @default {}
     */
    hand: ComponentType | false | DefaultXRHandOptions;
    /**
     * @default {}
     */
    controller: ComponentType | false | DefaultXRControllerOptions;
    /**
     * @default {}
     */
    transientPointer: ComponentType | false | DefaultXRTransientPointerOptions;
    /**
     * @default {}
     */
    gaze: ComponentType | false | DefaultXRGazeOptions;
    /**
     * @default {}
     */
    screenInput: ComponentType | false | DefaultXRScreenInputOptions;
    /**
     * @default false
     */
    detectedMesh: ComponentType | false;
    /**
     * @default false
     */
    detectedPlane: ComponentType | false;
};
export type XRStore = BaseXRStore<XRElementImplementation>;
export type XRStoreOptions = BaseXRStoreOptions<XRElementImplementation>;
export type XRState = BaseXRState<XRElementImplementation>;
export declare function createXRStore(options?: XRStoreOptions): BaseXRStore<XRElementImplementation>;
export type XRProperties = {
    children?: ReactNode;
    store: XRStore;
};
export declare function XR({ children, store }: XRProperties): import("react/jsx-runtime").JSX.Element;
export declare function useXRStore(): XRStore;
export declare function useXR<T = XRState>(selector?: (s: XRState) => T): T;
