import { useXR } from './xr.js';
export function useXRSessionVisibilityState() {
    return useXR((xr) => xr.visibilityState);
}
//TODO: move to store and do automatically by default
//export function useInitRoomCapture() {}
/*
TODO think about a better pose api
export function useXRHandOnPose(
  handedness: XRHandedness,
  poseName: string,
  fn: () => void,
  deps: Array<unknown>,
): void {}*/
