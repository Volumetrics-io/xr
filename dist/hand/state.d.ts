/// <reference types="webxr" />
import { Object3D, WebXRManager } from 'three';
import { XRHandPoseState, XRHandPoseUrls } from './pose.js';
import { XRHandLoaderOptions } from './model.js';
import { XRInputSourceState } from '../input.js';
export type XRHandInputSource = XRInputSource & {
    hand: XRHand;
};
export declare function isXRHandInputSource(inputSource: XRInputSource): inputSource is XRHandInputSource;
export type XRHandState = XRInputSourceState & {
    inputSource: XRHandInputSource;
    pose: XRHandPoseState;
    assetPath: string;
    object?: Object3D;
};
export declare function createXRHandState(inputSource: XRInputSource, options: XRHandLoaderOptions | undefined): XRHandState;
export declare function updateXRHandState({ inputSource, pose }: XRHandState, frame: XRFrame | undefined, manager: WebXRManager, poseUrls: XRHandPoseUrls): void;
