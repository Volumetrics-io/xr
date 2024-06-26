/// <reference types="webxr" />
import { WebXRManager } from 'three';
declare global {
    interface XRFrame {
        /**
         * @returns A boolean indicating if all of the spaces have a valid pose.
         */
        fillPoses(spaces: Iterable<XRSpace>, referenceSpace: XRSpace, target: Float32Array): boolean;
    }
}
export type XRHandPoseState = {
    name: string | undefined;
    data: Float32Array;
    distances: Record<string, number | undefined>;
};
export type XRHandPoseUrls = Record<string, string>;
export declare function createHandPoseState(hand: XRHand): XRHandPoseState;
export declare function updateXRHandPoseState(state: XRHandPoseState, frame: XRFrame | undefined, hand: XRHand, manager: WebXRManager, handedness: XRHandedness, poseUrls: XRHandPoseUrls): void;
export declare function downloadHandPoseData(handed: XRHandedness, handPoseData: Float32Array): void;
