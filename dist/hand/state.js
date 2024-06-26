import { createHandPoseState, updateXRHandPoseState } from './pose.js';
import { getXRHandAssetPath } from './model.js';
export function isXRHandInputSource(inputSource) {
    return inputSource.hand != null;
}
export function createXRHandState(inputSource, options) {
    return {
        inputSource: inputSource,
        pose: createHandPoseState(inputSource.hand),
        assetPath: getXRHandAssetPath(inputSource.handedness, options),
    };
}
export function updateXRHandState({ inputSource, pose }, frame, manager, poseUrls) {
    updateXRHandPoseState(pose, frame, inputSource.hand, manager, inputSource.handedness, poseUrls);
}
