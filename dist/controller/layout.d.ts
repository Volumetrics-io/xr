/// <reference types="webxr" />
export type XRControllerVisualResponse = {
    states: Array<'default' | 'touched' | 'pressed'>;
    valueNodeName: string;
} & ({
    componentProperty: 'xAxis' | 'yAxis' | 'button' | 'state';
    valueNodeProperty: 'transform';
    minNodeName: string;
    maxNodeName: string;
} | {
    componentProperty: 'state';
    valueNodeProperty: 'visibility';
});
export type XRControllerComponent = {
    type: 'trigger' | 'squeeze' | 'touchpad' | 'thumbstick' | 'button' | string;
    gamepadIndices: {
        [Key in 'button' | 'xAxis' | 'yAxis']?: number;
    };
    rootNodeName: string;
    touchPointNodeName: string;
    visualResponses: Record<string, XRControllerVisualResponse>;
};
export type XRControllerLayout = {
    selectComponentId: string;
    components: {
        [Key in string]: XRControllerComponent;
    };
    gamepadMapping: string;
    rootNodeName: string;
    assetPath: string;
};
export type XRControllerLayoutLoaderOptions = {
    baseAssetPath?: string;
    defaultControllerProfileId?: string;
};
export declare class XRControllerLayoutLoader {
    private readonly baseAssetPath;
    private readonly defaultProfileId;
    private profilesListPromise;
    private profilePromisesMap;
    constructor(options?: XRControllerLayoutLoaderOptions);
    load(inputSourceProfileIds: ReadonlyArray<string>, handedness: XRHandedness): Promise<XRControllerLayout>;
    loadAsync: (inputSourceProfileIds: ReadonlyArray<string>, handedness: XRHandedness) => Promise<XRControllerLayout>;
    private loadProfile;
    private loadProfileFromPathCached;
    private loadProfileFromPath;
}
