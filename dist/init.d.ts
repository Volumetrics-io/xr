/// <reference types="webxr" />
export type XRSessionFeatureRequest = 'required' | true | false;
export type XRSessionInitOptions = {
    /**
     * @default "local-floor"
     */
    referenceSpaceType?: XRReferenceSpaceType;
    /**
     * @default true
     */
    anchors?: XRSessionFeatureRequest;
    /**
     * @defaulttrue
     */
    handTracking?: XRSessionFeatureRequest;
    /**
     * @default true
     */
    layers?: XRSessionFeatureRequest;
    /**
     * @default true
     */
    meshDetection?: XRSessionFeatureRequest;
    /**
     * @default true
     */
    planeDetection?: XRSessionFeatureRequest;
    /**
     * @default false
     */
    depthSensing?: XRSessionFeatureRequest;
    /**
     * @default undefined
     */
    customSessionInit?: XRSessionInit;
};
export declare function buildXRSessionInit({ anchors, handTracking, layers, meshDetection, planeDetection, referenceSpaceType, customSessionInit, depthSensing, }?: XRSessionInitOptions): XRSessionInit;
